-- Add view_count column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create a function to increment view count atomically
CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Grant execute permission on the function to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_post_views(uuid) TO authenticated, anon;
