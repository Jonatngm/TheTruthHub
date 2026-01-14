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

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        {/* Search Bar with enhanced styling */}
        <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {activeFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="text-sm hover:bg-primary/10 hover:text-primary transition-all duration-200 shadow-sm"
            >
              Clear all filters
            </Button>
          )}
        </div>

        {/* Featured Posts with enhanced section styling */}
        {!activeFilters && featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-16 sm:mb-20 md:mb-24 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
              <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
              <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3 sm:gap-4">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                Featured Teachings
              </h2>
            </div>
            <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <div key={post.id} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Filter with refined buttons */}
        {!activeFilters && categories && categories.length > 0 && (
          <section className="mb-12 sm:mb-16 md:mb-20 animate-in slide-in-from-bottom-6 duration-700 delay-200">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 flex items-center gap-3">
              <div className="h-1 w-8 bg-primary rounded-full" />
              Browse by Category
            </h3>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-105 transition-all duration-200 border-border/60 font-medium"
                  onClick={() => setSearchParams({ category: category.slug })}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Series Filter with refined buttons */}
        {!activeFilters && series && series.length > 0 && (
          <section className="mb-16 sm:mb-20 md:mb-24 animate-in slide-in-from-bottom-6 duration-700 delay-300">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 flex items-center gap-3">
              <div className="h-1 w-8 bg-primary rounded-full" />
              Teaching Series
            </h3>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {series.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:scale-105 transition-all duration-200 border-border/60 font-medium"
                  onClick={() => setSearchParams({ series: s.slug })}
                >
                  {s.title}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="animate-in slide-in-from-bottom-8 duration-700 delay-400">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground capitalize">
              {categorySlug && 'Category: ' + categorySlug.replace(/-/g, ' ')}
              {tagSlug && 'Tag: ' + tagSlug.replace(/-/g, ' ')}
              {seriesSlug && 'Series: ' + seriesSlug.replace(/-/g, ' ')}
              {searchQuery && `Search results for "${searchQuery}"`}
              {!activeFilters && 'Recent Teachings'}
            </h2>
          </div>

          {postsLoading ? (
            <div className="flex justify-center py-16 sm:py-20 md:py-24">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading teachings...</p>
              </div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <div key={post.id} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-border/60 shadow-md">
              <CardContent className="py-12 sm:py-16 md:py-20 text-center px-6">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <p className="text-base sm:text-lg text-muted-foreground font-medium">
                    {searchQuery ? 'No teachings found matching your search.' : 'No teachings available yet.'}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => { setSearchQuery(''); setSearchParams({}); }} className="mt-4">
                      Clear search
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
