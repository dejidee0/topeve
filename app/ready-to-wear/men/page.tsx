import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';
import { ProductGrid } from '@/components/product-grid';

async function getMenProducts(): Promise<Product[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'men')
    .maybeSingle();

  if (!category) return [];

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*)
    `)
    .eq('category_id', (category as any).id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (products || []) as Product[];
}

export default async function MenPage() {
  const products = await getMenProducts();

  return (
    <div>
      <section className="relative h-[50vh] mb-12">
        <Image
          src="https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Men's Collection"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="font-display text-5xl lg:text-6xl text-white font-bold tracking-tightest uppercase">
            Men
          </h1>
        </div>
      </section>

      <div className="container pb-24">
        <div className="text-center mb-12">
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Explore sophisticated menswear that blends traditional African elegance with contemporary style.
            From agbadas to modern suits, find your perfect look.
          </p>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
