import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { postService } from '@/lib/postService';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, Loader2, ArrowLeft, BookOpen, Eye } from 'lucide-react';
import { CategoryTags } from '@/components/CategoryTags';
import { Comments } from '@/components/Comments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatCount } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useRef } from 'react';
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

  // Increment view count when post is loaded
  useEffect(() => {
    if (post?.id) {
      postService.incrementViewCount(post.id);
    }
  }, [post?.id]);

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
    <div className="min-h-screen bg-gradient-to-b from-background to-[#EBE3DB]">
      {/* Cover image with enhanced presentation */}
      {post.cover_image && (
        <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[500px] mb-0 overflow-hidden shadow-lg">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Optional decorative element */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      <article ref={articleRef} className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 sm:mb-8 text-sm sm:text-base">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to teachings
          </Button>
        </Link>

        <header className="mb-8 sm:mb-10 md:mb-12">
          {post.series && (
            <div className="flex items-center gap-2 text-primary mb-3 sm:mb-4 text-sm sm:text-base">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">{post.series.title}</span>
              {post.series_order && (
                <span className="text-muted-foreground">• Part {post.series_order}</span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <time dateTime={post.created_at}>{formattedDate}</time>
                </div>
                {(post.categories || post.tags) && (
                  <div className="flex items-center gap-2">
                    {/* small categories/tags indicator (kept minimal) */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {(post.categories || post.tags) && (
            <div className="mt-3 sm:mt-4">
              <CategoryTags categories={post.categories} tags={post.tags} clickable />
            </div>
          )}
        </header>

        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none overflow-hidden">
          <div
            className="leading-relaxed overflow-hidden
              [&_p]:mb-3 [&_p]:sm:mb-4 [&_p]:min-h-[1.5em] [&_p]:text-sm [&_p]:sm:text-base [&_p]:break-words
              [&_h2]:mt-6 [&_h2]:sm:mt-8 [&_h2]:mb-3 [&_h2]:sm:mb-4 [&_h2]:font-bold [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:break-words
              [&_h3]:mt-4 [&_h3]:sm:mt-6 [&_h3]:mb-2 [&_h3]:sm:mb-3 [&_h3]:font-bold [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:break-words
              [&_ul]:mb-3 [&_ul]:sm:mb-4 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:sm:pl-8
              [&_ol]:mb-3 [&_ol]:sm:mb-4 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:sm:pl-8
              [&_li]:mb-2 [&_li]:text-sm [&_li]:sm:text-base [&_li]:break-words
              [&_ul_ul]:list-[circle] [&_ul_ul]:mt-2
              [&_ul_ul_ul]:list-[square]
              [&_blockquote]:mb-3 [&_blockquote]:sm:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:sm:pl-4 [&_blockquote]:italic [&_blockquote]:text-sm [&_blockquote]:sm:text-base [&_blockquote]:break-words
              [&_strong]:font-bold
              [&_em]:italic
              [&_u]:underline
              [&_s]:line-through
              [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_code]:break-all
              [&_pre]:overflow-x-auto [&_pre]:max-w-full
              [&_img]:max-w-full [&_img]:h-auto
              [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full
              [&_.text-left]:text-left
              [&_.text-center]:text-center
              [&_.text-right]:text-right
              [&_.text-justify]:text-justify"
            dangerouslySetInnerHTML={{ __html: contentWithLinks }}
          />
        </div>

        {/* Series Posts */}
        {seriesPosts && seriesPosts.length > 1 && (
          <div className="mt-12 sm:mt-14 md:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              More from this series
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {seriesPosts
                .filter((p) => p.id !== post.id)
                .map((p) => (
                  <Link key={p.id} to={`/post/${p.id}`}>
                    <Card className="hover:shadow-lg transition-shadow border-border/60">
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2 sm:gap-3">
                          {p.series_order && (
                            <span className="text-primary font-bold flex-shrink-0">
                              {p.series_order}.
                            </span>
                          )}
                          <span className="line-clamp-2">{p.title}</span>
                        </CardTitle>
                      </CardHeader>
                      {p.excerpt && (
                        <CardContent>
                          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
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

        {/* Comments Section - Temporarily hidden */}
        {/* <div className="mt-8 sm:mt-10 md:mt-12">
          <Comments postId={post.id} />
        </div> */}
      </article>
    </div>
  );
}
