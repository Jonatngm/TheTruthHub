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
    <Link to={`/post/${post.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/60 overflow-hidden">
        {post.cover_image && (
          <div className="w-full h-36 sm:h-40 md:h-48 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="p-3 sm:p-4 md:p-6">
          {post.series && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary mb-1.5 sm:mb-2">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{post.series.title}</span>
              {post.series_order && <span className="whitespace-nowrap">• Part {post.series_order}</span>}
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground leading-tight line-clamp-2">
              {post.title}
            </CardTitle>

            {typeof post.views !== 'undefined' && (
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-primary/6 text-primary px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full shadow-sm border border-primary/10">
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs sm:text-sm font-semibold">{formatCount(post.views)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground pt-1.5 sm:pt-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">{formattedDate}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
          </p>
          
          <CategoryTags categories={post.categories} tags={post.tags} />
        </CardContent>
      </Card>
    </Link>
  );
}

