-- Allow ads without a competitor (keyword search results)
ALTER TABLE public.ads ALTER COLUMN competitor_id DROP NOT NULL;

-- Drop the old unique constraint and recreate with user_id
ALTER TABLE public.ads DROP CONSTRAINT IF EXISTS ads_competitor_id_external_id_key;
ALTER TABLE public.ads ADD CONSTRAINT ads_user_external_id_key UNIQUE (user_id, external_id);
