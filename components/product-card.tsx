import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/database.types';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] mb-3 overflow-hidden bg-card">
        {primaryImage && (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1240px) 33vw, 25vw"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.alt || product.title}
                fill
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1240px) 33vw, 25vw"
              />
            )}
          </>
        )}
        {product.preorder && (
          <Badge className="absolute top-3 left-3 bg-accent/90 text-bg hover:bg-accent uppercase tracking-caps text-xs">
            Pre-Order
          </Badge>
        )}
        {!product.in_stock && (
          <Badge variant="secondary" className="absolute top-3 left-3 uppercase tracking-caps text-xs">
            Sold Out
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors">
          {product.title}
        </h3>
        {product.brand && (
          <p className="text-xs text-muted uppercase tracking-caps">
            {product.brand.name}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {formatPrice(product.price_cents, product.currency)}
          </span>
          {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.compare_at_cents, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
