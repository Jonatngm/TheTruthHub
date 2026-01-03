import { Badge } from '@/components/ui/badge';
import { Category, Tag } from '@/types';
import { Link } from 'react-router-dom';

interface CategoryTagsProps {
  categories?: Category[];
  tags?: Tag[];
  clickable?: boolean;
}

export function CategoryTags({ categories, tags, clickable = false }: CategoryTagsProps) {
  if ((!categories || categories.length === 0) && (!tags || tags.length === 0)) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories?.map((category) =>
        clickable ? (
          <Link key={category.id} to={`/?category=${category.slug}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
              {category.name}
            </Badge>
          </Link>
        ) : (
          <Badge key={category.id} variant="secondary">
            {category.name}
          </Badge>
        )
      )}
      {tags?.map((tag) =>
        clickable ? (
          <Link key={tag.id} to={`/?tag=${tag.slug}`}>
            <Badge variant="outline" className="cursor-pointer hover:border-primary">
              {tag.name}
            </Badge>
          </Link>
        ) : (
          <Badge key={tag.id} variant="outline">
            {tag.name}
          </Badge>
        )
      )}
    </div>
  );
}
