-- ============================================
-- Viral Content Analyzer - Database Schema
-- ============================================

-- Users (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  plan text default 'free' check (plan in ('free','starter','pro','agency')),
  subscription_id text,
  subscription_status text default 'inactive',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Brands
create table public.brands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  name text not null,
  niche text,
  tone_of_voice text,
  target_audience text,
  created_at timestamptz default now()
);

-- Competitors (Meta page_id and/or Google domain)
create table public.competitors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  name text not null,
  meta_page_id text,
  google_domain text,
  created_at timestamptz default now()
);

-- Ads (scraped from Meta Ad Library / Google Transparency Center)
create table public.ads (
  id uuid default gen_random_uuid() primary key,
  competitor_id uuid references public.competitors on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  platform text not null check (platform in ('meta','google')),
  external_id text,
  ad_text text,
  headline text,
  cta_text text,
  image_urls jsonb default '[]',
  video_url text,
  landing_page_url text,
  format text check (format in ('image','video','carousel','text')),
  status text default 'active',
  started_at timestamptz,
  ended_at timestamptz,
  raw_data jsonb,
  created_at timestamptz default now(),
  unique(competitor_id, external_id)
);

-- Ad Analyses (Gemini results)
create table public.ad_analyses (
  id uuid default gen_random_uuid() primary key,
  ad_id uuid references public.ads on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  hook text,
  offer text,
  cta_analysis text,
  tone text,
  target_audience text,
  strengths jsonb,
  weaknesses jsonb,
  improvements jsonb,
  score int check (score between 1 and 10),
  raw_response jsonb,
  created_at timestamptz default now()
);

-- Subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  mp_subscription_id text,
  plan text not null,
  status text default 'pending',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Usage tracking
create table public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  month text not null,
  ads_scraped int default 0,
  ai_analyses int default 0,
  created_at timestamptz default now(),
  unique (user_id, month)
);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.users enable row level security;
alter table public.brands enable row level security;
alter table public.competitors enable row level security;
alter table public.ads enable row level security;
alter table public.ad_analyses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage enable row level security;

-- Users: can read/update own row
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Brands: full CRUD on own brands
create policy "Users can CRUD own brands" on public.brands
  for all using (auth.uid() = user_id);

-- Competitors: full CRUD on own competitors
create policy "Users can CRUD own competitors" on public.competitors
  for all using (auth.uid() = user_id);

-- Ads: full CRUD on own ads
create policy "Users can CRUD own ads" on public.ads
  for all using (auth.uid() = user_id);

-- Ad Analyses: full CRUD on own analyses
create policy "Users can CRUD own analyses" on public.ad_analyses
  for all using (auth.uid() = user_id);

-- Subscriptions: read own subscriptions
create policy "Users can read own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Usage: read own usage
create policy "Users can read own usage" on public.usage
  for select using (auth.uid() = user_id);

-- ============================================
-- Functions
-- ============================================

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Increment usage counter
create or replace function public.increment_usage(
  p_user_id uuid,
  p_month text,
  p_type text
) returns void as $$
begin
  IF p_type NOT IN ('ads_scraped', 'ai_analyses') THEN
    RAISE EXCEPTION 'invalid usage type: %', p_type;
  END IF;

  insert into public.usage (user_id, month)
  values (p_user_id, p_month)
  on conflict (user_id, month) do nothing;

  execute format(
    'update public.usage set %I = %I + 1 where user_id = $1 and month = $2',
    p_type, p_type
  ) using p_user_id, p_month;
end;
$$ language plpgsql security definer;

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at();
