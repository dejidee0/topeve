import { notFound } from "next/navigation";

import { PRODUCTS } from "@/lib/constants";
import ProductDetailClient from "@/components/shared/products/productDetailClient";

// Generate static params for all products (optional but recommended for performance)
export async function generateStaticParams() {
  // If using static data
  return PRODUCTS.map((product) => ({
    id: product.id.toString(),
  }));

  // If fetching from Supabase, uncomment below:
  /*
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id');
  
  return products?.map((product) => ({
    id: product.id.toString(),
  })) || [];
  */
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;

  // Find product from constants or fetch from Supabase
  const product = PRODUCTS.find((p) => p.id.toString() === id);

  // If fetching from Supabase:
  /*
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  */

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Your Store Name`,
    description: product.description || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.description || product.shortDescription,
      images: [
        {
          url: product.image || product.images?.[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || product.shortDescription,
      images: [product.image || product.images?.[0]],
    },
  };
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

export default async function ProductPage({ params }) {
  const { id } = await params;

  // Fetch product data (from constants or Supabase)
  const product = PRODUCTS.find((p) => p.id.toString() === id);

  // If using Supabase, uncomment:
  /*
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      reviews:product_reviews(*)
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }
  */

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // If using Supabase:
  /*
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', id)
    .limit(4);
  */

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
