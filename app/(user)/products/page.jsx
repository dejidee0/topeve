// app/products/page.jsx
import { Suspense } from "react";
import { getAllProducts } from "@/utils/products";
import ProductsPageContent from "./content";
import ProductsLoadingSkeleton from "./skeleton";

export const revalidate = 3600; // Revalidate every hour (ISR)

export const metadata = {
  title: "Shop All Products | Topeve",
  description:
    "Discover our curated collection of luxury fashion, beauty products, accessories, and jewelry. Premium quality for the discerning Nigerian shopper.",
  openGraph: {
    type: "website",
    title: "Shop All Products | Topeve",
    description:
      "Discover our curated collection of luxury fashion, beauty products, accessories, and jewelry.",
  },
};

export default async function ProductsPage() {
  // Fetch all products server-side with optimized query
  const {
    data: products,
    error,
    count,
  } = await getAllProducts({
    limit: null, // Get all products initially
    orderBy: "created_at",
    ascending: false,
  });

  // Handle errors gracefully
  if (error) {
    console.error("❌ Error loading products:", error);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-brand mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-charcoal/70 mb-4">
            We couldn&#39;t load the products. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-brand text-cream rounded-full hover:bg-brand/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsPageContent products={products || []} totalCount={count} />
    </Suspense>
  );
}
