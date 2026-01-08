import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { postService } from '@/lib/postService';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminReaders() {
  const { data: posts, isLoading } = useQuery({ queryKey: ['allPosts'], queryFn: () => postService.getAllPosts() });
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!posts) return;
    let mounted = true;
    (async () => {
      const result: Record<string, number> = {};
      await Promise.all(posts.map(async (p: any) => {
        const { error, count } = await supabase.from('post_views').select('id', { count: 'exact', head: true }).eq('post_id', p.id);
        if (!error && mounted) result[p.id] = count ?? 0;
      }));
      if (mounted) setCounts(result);
    })();
    return () => { mounted = false; };
  }, [posts]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Readers Report</h1>
        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((p: any) => (
              <Card key={p.id} className="border-border/60">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{p.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold">{counts[p.id] ?? 0}</div>
                      <div className="text-sm text-muted-foreground">unique readers</div>
                    </div>
                  </div>
                </CardHeader>
                {p.excerpt && (
                  <CardContent>
                    <p className="text-muted-foreground">{p.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/60">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No posts available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
