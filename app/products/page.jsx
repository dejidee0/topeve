import ProductsClient from "@/components/shared/products/product-client";
import { PRODUCTS } from "@/lib/constants";

// Enable ISR with revalidation
export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  // Fetch data server-side (replace with Supabase query)
  const products = PRODUCTS;

  return <ProductsClient PRODUCTS={products} />;
}
