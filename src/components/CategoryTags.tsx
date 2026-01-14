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
          <Link key={category.id} to={`/?category=${category.slug}`} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-full">
            <Badge 
              variant="secondary" 
              className="cursor-pointer transition-all duration-200 hover:bg-primary/15 hover:shadow-sm hover:scale-105 text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 font-medium border border-transparent group-hover:border-primary/20"
            >
              {category.name}
            </Badge>
          </Link>
        ) : (
          <Badge 
            key={category.id} 
            variant="secondary" 
            className="text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 font-medium shadow-sm"
          >
            {category.name}
          </Badge>
        )
      )}
      {tags?.map((tag) =>
        clickable ? (
          <Link key={tag.id} to={`/?tag=${tag.slug}`} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-full">
            <Badge 
              variant="outline" 
              className="cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-sm hover:scale-105 text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 font-medium"
            >
              {tag.name}
            </Badge>
          </Link>
        ) : (
          <Badge 
            key={tag.id} 
            variant="outline" 
            className="text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 font-medium"
          >
            {tag.name}
          </Badge>
        )
      )}
    </div>
  );
}
