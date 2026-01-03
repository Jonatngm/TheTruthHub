import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postService } from '@/lib/postService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare, Loader2, Eye, EyeOff } from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => postService.getAllPosts(),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <Button onClick={() => navigate('/admin/write')}>
            <PenSquare className="w-4 h-4 mr-2" />
            New Teaching
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-border/60">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          {post.published ? (
                            <>
                              <Eye className="w-4 h-4" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Draft
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/edit/${post.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                {post.excerpt && (
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/60">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No teachings yet</p>
              <Button onClick={() => navigate('/admin/write')}>
                <PenSquare className="w-4 h-4 mr-2" />
                Write Your First Teaching
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
