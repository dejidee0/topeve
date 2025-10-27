// app/products/page.jsx
import { Suspense } from "react";
import ProductsPageContent from "./content";

export default async function ProductsPage() {
  // could fetch product data here via API if desired
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading products...</div>}
    >
      <ProductsPageContent />
    </Suspense>
  );
}
