-- Migration: Create post_views table and RPC to increment unique views
BEGIN;

-- Create table to store unique views per post and per user/anon
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NULL,
  anon_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique indexes to ensure one view per user per post and one per anon id per post
CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_user ON public.post_views(post_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_anon ON public.post_views(post_id, anon_id) WHERE anon_id IS NOT NULL;

-- Function to insert a unique view and increment posts.views atomically if a new view was recorded
CREATE OR REPLACE FUNCTION public.increment_unique_view(p_post_id uuid, p_user_id uuid DEFAULT NULL, p_anon_id text DEFAULT NULL)
RETURNS posts AS $$
DECLARE
  inserted boolean := false;
BEGIN
  IF p_user_id IS NOT NULL THEN
    INSERT INTO public.post_views(post_id, user_id)
    VALUES (p_post_id, p_user_id)
    ON CONFLICT ON CONSTRAINT uniq_post_user DO NOTHING;
    GET DIAGNOSTICS inserted = ROW_COUNT > 0;
  ELSIF p_anon_id IS NOT NULL THEN
    INSERT INTO public.post_views(post_id, anon_id)
    VALUES (p_post_id, p_anon_id)
    ON CONFLICT ON CONSTRAINT uniq_post_anon DO NOTHING;
    GET DIAGNOSTICS inserted = ROW_COUNT > 0;
  END IF;

  IF inserted THEN
    UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = p_post_id;
  END IF;

  RETURN (SELECT * FROM posts WHERE id = p_post_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated/anon as needed
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, uuid, text) TO anon;

COMMIT;
