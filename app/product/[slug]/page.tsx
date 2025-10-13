import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductGrid } from '@/components/product-grid';
import { Heart, Share2 } from 'lucide-react';

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  return data as Product | null;
}

async function getRelatedProducts(categoryId: string | null, currentId: string): Promise<Product[]> {
  if (!categoryId) return [];

  const { data } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'active')
    .neq('id', currentId)
    .limit(4);

  return (data || []) as Product[];
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);
  const primaryImage = product.images?.[0];
  const thumbnails = product.images || [];

  const hasDiscount = product.compare_at_cents && product.compare_at_cents > product.price_cents;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_cents! - product.price_cents) / product.compare_at_cents!) * 100)
    : 0;

  return (
    <div className="container py-12">
      <div className="grid lg:grid-cols-2 gap-12 mb-24">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-card overflow-hidden">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.title}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
            )}
            {product.preorder && (
              <Badge className="absolute top-4 left-4 bg-accent/90 text-bg hover:bg-accent uppercase tracking-caps">
                Pre-Order
              </Badge>
            )}
          </div>

          {thumbnails.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {thumbnails.slice(0, 4).map((image, idx) => (
                <div key={image.id} className="relative aspect-[4/5] bg-card overflow-hidden cursor-pointer">
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.title} view ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform"
                    sizes="12vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {product.brand && (
            <p className="text-sm text-muted uppercase tracking-caps">{product.brand.name}</p>
          )}

          <h1 className="font-display text-h2 lg:text-[44px] lg:leading-[52px] tracking-tightest">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium">
              {formatPrice(product.price_cents, product.currency)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.compare_at_cents!, product.currency)}
                </span>
                <Badge variant="secondary" className="text-danger">
                  Save {discountPercent}%
                </Badge>
              </>
            )}
          </div>

          {!product.in_stock && (
            <Badge variant="secondary" className="text-danger">
              Out of Stock
            </Badge>
          )}

          {product.description && (
            <p className="text-base leading-relaxed text-muted">{product.description}</p>
          )}

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps"
              disabled={!product.in_stock}
            >
              {product.preorder ? 'Pre-Order Now' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="outline" className="aspect-square p-0">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="aspect-square p-0">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-caps">
                Product Details
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Premium quality fabric</li>
                  <li>Expert craftsmanship</li>
                  <li>Available for custom fitting</li>
                  <li>Authentic African design</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-caps">
                Delivery & Returns
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted">
                <p className="mb-2">
                  Free delivery on orders above ₦50,000. Standard delivery takes 3-5 business days
                  within Lagos and 5-7 business days for other locations.
                </p>
                <p>
                  Returns accepted within 14 days of delivery. Items must be unworn and in original
                  condition with tags attached.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-caps">
                Care Instructions
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted">
                <ul className="list-disc list-inside space-y-1">
                  <li>Dry clean recommended</li>
                  <li>Hand wash in cold water if needed</li>
                  <li>Do not bleach</li>
                  <li>Iron on low heat</li>
                  <li>Store in cool, dry place</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-h2 uppercase tracking-caps mb-2">You May Also Like</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto"></div>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
