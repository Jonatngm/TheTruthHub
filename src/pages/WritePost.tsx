import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/lib/postService';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRef } from 'react';

export function WritePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [seriesOrder, setSeriesOrder] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => postService.getCategories(),
  });

  const { data: allSeries } = useQuery({
    queryKey: ['userSeries', user?.id],
    queryFn: () => postService.getSeries(user?.id),
  });

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileName = `covers/${Date.now()}_${file.name}`;
      const url = await postService.uploadImage(file, fileName);
      setCoverImage(url);
      toast.success('Cover image uploaded');
    } catch (error: any) {
      console.error('Cover upload error:', error);
      toast.error(error.message || 'Failed to upload cover image');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);

    try {
      await postService.createPost(user.id, {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        published,
        featured,
        scheduled_at: scheduledAt || undefined,
        cover_image: coverImage || undefined,
        series_id: seriesId || undefined,
        series_order: seriesOrder ? parseInt(seriesOrder) : undefined,
        category_ids: selectedCategories,
        tag_names: tags,
      });

      toast.success(published ? 'Teaching published!' : 'Draft saved!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create teaching');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Write New Teaching</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter teaching title"
              className="text-lg"
            />
          </div>

          {/* Cover Image */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverImageInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Image
                </Button>
              )}
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageUpload}
              />
            </CardContent>
          </Card>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={loading}
              placeholder="Brief summary (optional)"
              rows={3}
            />
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={handleAddTag} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Series */}
          {allSeries && allSeries.length > 0 && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">Series</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="series">Select Series</Label>
                  <Select value={seriesId} onValueChange={setSeriesId}>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {allSeries.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {seriesId && (
                  <div className="space-y-2">
                    <Label htmlFor="seriesOrder">Part Number</Label>
                    <Input
                      id="seriesOrder"
                      type="number"
                      min="1"
                      value={seriesOrder}
                      onChange={(e) => setSeriesOrder(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Publishing Options */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Publish immediately</Label>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Mark as featured</Label>
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={setFeatured}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule for later (optional)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {published ? 'Publish' : 'Save Draft'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
