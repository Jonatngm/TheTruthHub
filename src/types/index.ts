export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  series_id: string | null;
  series_order: number | null;
  featured: boolean;
  scheduled_at: string | null;
  cover_image: string | null;
  views?: number | null;
  categories?: Category[];
  tags?: Tag[];
  series?: Series;
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  scheduled_at: string;
  cover_image: string;
  series_id: string;
  series_order: number;
  category_ids: string[];
  tag_names: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  user_id: string;
  created_at: string;
}
