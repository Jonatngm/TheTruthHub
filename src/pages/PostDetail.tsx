import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/lib/postService';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, Loader2, ArrowLeft, BookOpen, Eye } from 'lucide-react';
import { CategoryTags } from '@/components/CategoryTags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatCount } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(id!),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  // Optimistic increment + persist, and subscribe to realtime updates for this post
  useEffect(() => {
    if (!id || !post) return;

    let isMounted = true;
    const previous = queryClient.getQueryData(['post', id]);

    (async () => {
      // optimistic update
      queryClient.setQueryData(['post', id], (old: any) => ({ ...(old || {}), views: ((old?.views as number) || 0) + 1 }));
      try {
        const updated = await postService.incrementViews(id);
        if (isMounted && updated) {
          queryClient.setQueryData(['post', id], (old: any) => ({ ...(old || {}), ...(updated || {}) }));
        }
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } catch (e) {
        // rollback on error
        if (isMounted) queryClient.setQueryData(['post', id], previous);
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    })();

    // realtime subscription to keep counts in sync
    const channel = supabase
      .channel(`public:posts:id=eq.${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts', filter: `id=eq.${id}` },
        (payload) => {
          if (payload?.new) queryClient.setQueryData(['post', id], (old: any) => ({ ...(old || {}), ...(payload.new) }));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      try {
        channel.unsubscribe();
      } catch (_) {}
    };
  }, [id, post]);

  const { data: seriesPosts } = useQuery({
    queryKey: ['seriesPosts', post?.series_id],
    queryFn: () => postService.getPostsBySeries(post!.series_id!),
    enabled: !!post?.series_id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/" replace />;
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convert scripture references to links
  const linkScriptures = (text: string) => {
    // Simple regex for basic scripture references like "John 3:16" or "Romans 8:28-30"
    const scriptureRegex = /\b(\d?\s?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s(\d+):(\d+(?:-\d+)?)\b/g;
    
    return text.replace(scriptureRegex, (match, book, chapter, verse) => {
      const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(match)}&version=ESV`;
      return `<a href="${bibleGatewayUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">${match}</a>`;
    });
  };

  const contentWithLinks = linkScriptures(post.content);
  // Cover image
  {post.cover_image && (
    <div className="w-full h-72 md:h-96 mb-8 overflow-hidden">
      <img
        src={post.cover_image}
        alt={post.title}
        className="w-full h-full object-cover"
      />
    </div>
  )}

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to teachings
          </Button>
        </Link>

        <header className="mb-12">
          {post.series && (
            <div className="flex items-center gap-2 text-primary mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">{post.series.title}</span>
              {post.series_order && (
                <span className="text-muted-foreground">• Part {post.series_order}</span>
              )}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.created_at}>{formattedDate}</time>
            </div>
            {typeof post.views !== 'undefined' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">{formatCount(post.views)}</span>
              </div>
            )}
            </div>
          </div>

          {(post.categories || post.tags) && (
            <CategoryTags categories={post.categories} tags={post.tags} clickable />
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: contentWithLinks }}
          />
        </div>

        {/* Series Posts */}
        {seriesPosts && seriesPosts.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              More from this series
            </h2>
            <div className="space-y-4">
              {seriesPosts
                .filter((p) => p.id !== post.id)
                .map((p) => (
                  <Link key={p.id} to={`/post/${p.id}`}>
                    <Card className="hover:shadow-lg transition-shadow border-border/60">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-3">
                          {p.series_order && (
                            <span className="text-primary font-bold">
                              {p.series_order}.
                            </span>
                          )}
                          {p.title}
                        </CardTitle>
                      </CardHeader>
                      {p.excerpt && (
                        <CardContent>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {p.excerpt}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
