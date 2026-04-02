-- Fix SQL injection in increment_usage by validating p_type input
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
