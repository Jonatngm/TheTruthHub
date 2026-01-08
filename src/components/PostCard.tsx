import { Link } from 'react-router-dom';
import { Calendar, BookOpen } from 'lucide-react';
import { Post } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryTags } from './CategoryTags';
import { Eye } from 'lucide-react';

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
          <div className="w-full h-48 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          {post.series && (
            <div className="flex items-center gap-2 text-sm text-primary mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{post.series.title}</span>
              {post.series_order && <span>• Part {post.series_order}</span>}
            </div>
          )}
          <CardTitle className="text-2xl font-semibold text-foreground leading-tight line-clamp-2">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
          </p>
          {typeof post.views !== 'undefined' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
          )}
          <CategoryTags categories={post.categories} tags={post.tags} />
        </CardContent>
      </Card>
    </Link>
  );
}
