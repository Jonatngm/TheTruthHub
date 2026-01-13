-- TheTruthHub Database Schema
-- Run this in your Supabase SQL Editor to create all required tables

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Series table
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-Category junction table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Post-Tag junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Post-Series relationship
ALTER TABLE posts ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES series(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS series_order INTEGER;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_series ON posts(series_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_post ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category ON post_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);

-- Row Level Security (RLS) Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

-- Authenticated users can view all posts (for admin)
CREATE POLICY "Authenticated can view all posts" ON posts
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can insert/update/delete posts
CREATE POLICY "Authenticated can insert posts" ON posts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update posts" ON posts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete posts" ON posts
  FOR DELETE TO authenticated USING (true);

-- Public read access for categories, tags, series
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view series" ON series
  FOR SELECT USING (true);

-- Authenticated users can manage categories, tags, series
CREATE POLICY "Authenticated can manage categories" ON categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can manage tags" ON tags
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can manage series" ON series
  FOR ALL TO authenticated USING (true);

-- Public read access for junction tables
CREATE POLICY "Public can view post_categories" ON post_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view post_tags" ON post_tags
  FOR SELECT USING (true);

-- Authenticated users can manage junction tables
CREATE POLICY "Authenticated can manage post_categories" ON post_categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can manage post_tags" ON post_tags
  FOR ALL TO authenticated USING (true);

COMMIT;
