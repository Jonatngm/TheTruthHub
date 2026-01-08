import { supabase } from './supabase';
import { Post, PostFormData } from '@/types';

class PostService {
  async getPublishedPosts(options?: {
    categorySlug?: string;
    tagSlug?: string;
    seriesSlug?: string;
    searchQuery?: string;
    featured?: boolean;
  }) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*)),
        series(*)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (options?.featured) {
      query = query.eq('featured', true);
    }

    if (options?.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%,excerpt.ilike.%${options.searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to flatten categories and tags
    const posts = (data || []).map(post => ({
      ...post,
      categories: post.categories?.map((pc: any) => pc.category) || [],
      tags: post.tags?.map((pt: any) => pt.tag) || [],
    }));

    // Filter by category if provided
    if (options?.categorySlug) {
      return posts.filter(post => 
        post.categories.some((cat: any) => cat.slug === options.categorySlug)
      );
    }

    // Filter by tag if provided
    if (options?.tagSlug) {
      return posts.filter(post => 
        post.tags.some((tag: any) => tag.slug === options.tagSlug)
      );
    }

    // Filter by series if provided
    if (options?.seriesSlug) {
      return posts.filter(post => post.series?.slug === options.seriesSlug);
    }

    return posts;
  }

  async getPostById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*)),
        series(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      categories: data.categories?.map((pc: any) => pc.category) || [],
      tags: data.tags?.map((pt: any) => pt.tag) || [],
    };
  }

  async incrementViews(id: string, opts?: { userId?: string | null; anonId?: string | null }) {
    // Prefer DB-side RPC for atomic unique view insertion.
    const userId = opts?.userId ?? null;
    const anonId = opts?.anonId ?? null;

    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('increment_unique_view', { p_post_id: id, p_user_id: userId, p_anon_id: anonId });
      if (!rpcError && rpcData) {
        if (Array.isArray(rpcData) && rpcData.length) return rpcData[0] as Post;
        return rpcData as Post;
      }
    } catch (e) {
      // ignore rpc errors and fallback
    }

    // Fallback: avoid counting duplicates on client; do best-effort increment
    const { data: current, error: selectError } = await supabase
      .from<Post>('posts')
      .select('views')
      .eq('id', id)
      .single();

    if (selectError || !current) return null;

    const newViews = (current.views || 0) + 1;

    const { data: updated, error: updateError } = await supabase
      .from<Post>('posts')
      .update({ views: newViews })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updated) return null;
    return updated as Post;
  }

  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*)),
        series(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(post => ({
      ...post,
      categories: post.categories?.map((pc: any) => pc.category) || [],
      tags: post.tags?.map((pt: any) => pt.tag) || [],
    }));
  }

  async createPost(userId: string, postData: Partial<PostFormData>) {
    const { category_ids, tag_names, ...postFields } = postData;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        ...postFields,
      })
      .select()
      .single();

    if (error) throw error;

    // Add categories
    if (category_ids && category_ids.length > 0) {
      await this.updatePostCategories(data.id, category_ids);
    }

    // Add tags
    if (tag_names && tag_names.length > 0) {
      await this.updatePostTags(data.id, tag_names);
    }

    return data;
  }

  async updatePost(id: string, postData: Partial<PostFormData>) {
    const { category_ids, tag_names, ...postFields } = postData;

    const { data, error } = await supabase
      .from('posts')
      .update({
        ...postFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update categories if provided
    if (category_ids !== undefined) {
      await this.updatePostCategories(id, category_ids);
    }

    // Update tags if provided
    if (tag_names !== undefined) {
      await this.updatePostTags(id, tag_names);
    }

    return data;
  }

  async deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  }

  async updatePostCategories(postId: string, categoryIds: string[]) {
    // Delete existing categories
    await supabase.from('post_categories').delete().eq('post_id', postId);

    // Add new categories
    if (categoryIds.length > 0) {
      const { error } = await supabase.from('post_categories').insert(
        categoryIds.map(categoryId => ({
          post_id: postId,
          category_id: categoryId,
        }))
      );
      if (error) throw error;
    }
  }

  async updatePostTags(postId: string, tagNames: string[]) {
    // Delete existing tags
    await supabase.from('post_tags').delete().eq('post_id', postId);

    if (tagNames.length === 0) return;

    // Get or create tags
    const tagIds: string[] = [];
    for (const tagName of tagNames) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');
      
      // Try to find existing tag
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        // Create new tag
        const { data: newTag, error } = await supabase
          .from('tags')
          .insert({ name: tagName, slug })
          .select('id')
          .single();
        
        if (error) throw error;
        tagIds.push(newTag.id);
      }
    }

    // Add new tags
    const { error } = await supabase.from('post_tags').insert(
      tagIds.map(tagId => ({
        post_id: postId,
        tag_id: tagId,
      }))
    );
    if (error) throw error;
  }

  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(data.path);

    return publicUrl;
  }

  // Category methods
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createCategory(name: string, description?: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Tag methods
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Series methods
  async getSeries(userId?: string) {
    let query = supabase.from('series').select('*').order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createSeries(userId: string, title: string, description?: string) {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('series')
      .insert({ user_id: userId, title, slug, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSeriesBySlug(slug: string) {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async getPostsBySeries(seriesId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*)),
        series(*)
      `)
      .eq('series_id', seriesId)
      .eq('published', true)
      .order('series_order', { ascending: true });

    if (error) throw error;

    return (data || []).map(post => ({
      ...post,
      categories: post.categories?.map((pc: any) => pc.category) || [],
      tags: post.tags?.map((pt: any) => pt.tag) || [],
    }));
  }
}

export const postService = new PostService();
