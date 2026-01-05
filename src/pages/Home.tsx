import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { postService } from '@/lib/postService';
import { Hero } from '@/components/Hero';
import { PostCard } from '@/components/PostCard';
import { SearchBar } from '@/components/SearchBar';
import { Loader2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');
  const seriesSlug = searchParams.get('series');

  const { data: featuredPosts, isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: () => postService.getPublishedPosts({ featured: true }),
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', categorySlug, tagSlug, seriesSlug, searchQuery],
    queryFn: () => postService.getPublishedPosts({
      categorySlug: categorySlug || undefined,
      tagSlug: tagSlug || undefined,
      seriesSlug: seriesSlug || undefined,
      searchQuery: searchQuery || undefined,
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => postService.getCategories(),
  });

  const { data: series } = useQuery({
    queryKey: ['series'],
    queryFn: () => postService.getSeries(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Clear filters when searching
    setSearchParams({});
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const activeFilters = categorySlug || tagSlug || seriesSlug || searchQuery;

  return (
    <div className="min-h-screen bg-[#EBE3DB]">
      <Hero />

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Search Bar */}
        <div className="mb-16 flex flex-col items-center gap-4">
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {activeFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Featured Posts */}
        {!activeFilters && featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                Featured Teachings
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Categories Filter */}
        {!activeFilters && categories && categories.length > 0 && (
          <section className="mb-16">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">Browse by Category</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchParams({ category: category.slug })}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Series Filter */}
        {!activeFilters && series && series.length > 0 && (
          <section className="mb-16">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">Teaching Series</h3>
            <div className="flex flex-wrap gap-3">
              {series.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchParams({ series: s.slug })}
                >
                  {s.title}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {categorySlug && 'Category: ' + categorySlug.replace(/-/g, ' ')}
              {tagSlug && 'Tag: ' + tagSlug.replace(/-/g, ' ')}
              {seriesSlug && 'Series: ' + seriesSlug.replace(/-/g, ' ')}
              {searchQuery && `Search results for "${searchQuery}"`}
              {!activeFilters && 'Recent Teachings'}
            </h2>
          </div>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="border-border/60">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No teachings found matching your search.' : 'No teachings available yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
