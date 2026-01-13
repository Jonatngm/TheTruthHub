-- Complete setup for views tracking functionality
-- Run these scripts in your Supabase SQL Editor in order

-- ============================================
-- STEP 1: Ensure posts table has views column
-- ============================================
-- This should already exist from schema.sql, but just in case:
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- ============================================
-- STEP 2: Create post_views table for unique tracking
-- ============================================
-- This table tracks unique views per user/anonymous visitor
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NULL,
  anon_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create unique indexes to prevent duplicate views
CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_user ON public.post_views(post_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_anon ON public.post_views(post_id, anon_id) WHERE anon_id IS NOT NULL;

-- ============================================
-- STEP 3: Create the increment_unique_view RPC function
-- ============================================
-- This function ensures atomic view counting with deduplication
CREATE OR REPLACE FUNCTION public.increment_unique_view(p_post_id uuid, p_user_id uuid DEFAULT NULL, p_anon_id text DEFAULT NULL)
RETURNS posts AS $$
DECLARE
  inserted boolean := false;
BEGIN
  -- Try to insert a unique view record
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

  -- Only increment the counter if a new view was recorded
  IF inserted THEN
    UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = p_post_id;
  END IF;

  -- Return the updated post
  RETURN (SELECT * FROM posts WHERE id = p_post_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 4: Grant permissions
-- ============================================
-- Allow authenticated and anonymous users to call the function
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, uuid, text) TO anon;

-- ============================================
-- STEP 5: Enable RLS on post_views table
-- ============================================
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Allow public to read view counts
CREATE POLICY "Public can view post_views" ON post_views
  FOR SELECT USING (true);

-- Allow the function to insert (SECURITY DEFINER handles this)
-- No additional policies needed for insert since function has SECURITY DEFINER

-- ============================================
-- Verification queries
-- ============================================
-- Run these to verify everything is set up correctly:

-- Check if posts table has views column
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'posts' AND column_name = 'views';

-- Check if post_views table exists
-- SELECT * FROM post_views LIMIT 1;

-- Check if function exists
-- SELECT proname, prosrc FROM pg_proc WHERE proname = 'increment_unique_view';
