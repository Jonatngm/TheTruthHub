-- Migration: Create atomic RPC to increment post views
-- Run this via psql or CI (workflow provided in .github/workflows)

BEGIN;

CREATE OR REPLACE FUNCTION public.increment_post_views(p_post_id uuid)
RETURNS posts AS $$
  UPDATE posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = p_post_id
  RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute to authenticated/anonymous as appropriate for your app
GRANT EXECUTE ON FUNCTION public.increment_post_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_post_views(uuid) TO anon;

COMMIT;
