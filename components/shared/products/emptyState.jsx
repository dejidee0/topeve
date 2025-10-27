// app/products/components/EmptyState.jsx
"use client";

export default function EmptyState({ query }) {
  return (
    <div className="col-span-full text-center py-20">
      <h3 className="text-lg font-heading text-brand mb-2">No results</h3>
      <p className="text-sm text-charcoal/70">
        We couldn&apos;t find any products for &ldquo;{query}&rdquo;. Try
        adjusting filters or search terms.
      </p>
    </div>
  );
}
