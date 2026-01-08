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
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(id!),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const { user } = useAuth();
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!id || !post) return;

    let didView = false;
    const key = `viewed:${id}:${user?.id || 'anon'}`;

    // If already recorded in localStorage, don't count again
    if (localStorage.getItem(key)) didView = true;

    const anonKey = 'anonId';
    let anonId = localStorage.getItem(anonKey);
    if (!anonId) {
      try {
        anonId = (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2);
        localStorage.setItem(anonKey, anonId);
      } catch (_) {
        anonId = Math.random().toString(36).slice(2);
        try { localStorage.setItem(anonKey, anonId); } catch (_) {}
      }
    }

    const markRead = async () => {
      if (didView) return;
      didView = true;
      try {
        const updated = await postService.incrementViews(id, { userId: user?.id ?? null, anonId: user?.id ? null : anonId });
        // update post cache
        queryClient.setQueryData(['post', id], (old: any) => ({ ...(old || {}), ...(updated || {}) }));
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        localStorage.setItem(key, '1');
      } catch (e) {
        // ignore errors; don't retry aggressively
      }
    };

    // Click inside article
    const onClick = (e: Event) => {
      const target = e.target as Node;
      if (!articleRef.current) return;
      if (articleRef.current.contains(target)) markRead();
    };

    window.addEventListener('pointerdown', onClick, { passive: true });

    // Scroll/read threshold: when 50% of article visible
    let observer: IntersectionObserver | null = null;
    if (articleRef.current) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            markRead();
            if (observer) {
              observer.disconnect();
              observer = null;
            }
            break;
          }
        }
      }, { threshold: [0.5] });
      observer.observe(articleRef.current);
    }

    // Fallback: time on page (15s)
    const timeout = window.setTimeout(() => markRead(), 15000);

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
      window.removeEventListener('pointerdown', onClick);
      if (observer) observer.disconnect();
      clearTimeout(timeout);
      try { channel.unsubscribe(); } catch (_) {}
    };
  }, [id, post, user]);

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
  return (
    <div className="min-h-screen">
      {/* Cover image */}
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

          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <time dateTime={post.created_at}>{formattedDate}</time>
                </div>
                {(post.categories || post.tags) && (
                  <div className="flex items-center gap-2">
                    {/* small categories/tags indicator (kept minimal) */}
                  </div>
                )}
              </div>
            </div>

            {typeof post.views !== 'undefined' && (
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-3 bg-primary/6 text-primary px-4 py-2 rounded-full shadow-sm border border-primary/10">
                  <Eye className="w-5 h-5" />
                  <div className="text-lg md:text-xl font-semibold">{formatCount(post.views)}</div>
                  <div className="text-xs text-muted-foreground">readers</div>
                </div>
              </div>
            )}
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
