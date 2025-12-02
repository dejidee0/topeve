"use client";

import ProductCard from "./productCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-charcoal/70">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {products.map((p) => (
        <div key={p.id || p.slug}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
