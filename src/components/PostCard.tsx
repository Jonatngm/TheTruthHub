import { Link } from 'react-router-dom';
import { Calendar, BookOpen } from 'lucide-react';
import { Post } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryTags } from './CategoryTags';
import { Eye } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatCount } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/post/${post.id}`} className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-all duration-200">
      <Card className="h-full transition-all duration-300 ease-out border-border/60 overflow-hidden hover:shadow-lg hover:border-primary/30 group-focus-visible:shadow-lg">
        {post.cover_image && (
          <div className="relative w-full h-40 sm:h-48 md:h-56 overflow-hidden bg-muted">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 ease-out"
              loading="lazy"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <CardHeader className="p-4 sm:p-5 md:p-6 space-y-3">
          {post.series && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-primary font-medium">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">{post.series.title}</span>
              {post.series_order && <span className="whitespace-nowrap opacity-70">• Part {post.series_order}</span>}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {post.title}
            </CardTitle>

            {typeof post.views !== 'undefined' && (
              <div className="flex-shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary/8 text-primary px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm border border-primary/15 transition-all duration-200 hover:bg-primary/12 hover:shadow-md cursor-default">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-semibold">{formatCount(post.views)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{post.views} views</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <time className="truncate" dateTime={post.created_at}>{formattedDate}</time>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-5 md:p-6 pt-0">
          <p className="text-sm sm:text-base text-muted-foreground/90 line-clamp-3 leading-relaxed">
            {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
          </p>
          
          <CategoryTags categories={post.categories} tags={post.tags} />
        </CardContent>
      </Card>
    </Link>
  );
}

