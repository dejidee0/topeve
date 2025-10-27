// app/product/[slug]/RelatedProducts.jsx
"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shared/products/productCard";

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-3xl text-brand">You May Also Like</h2>
        <button className="text-sm font-medium text-brand hover:text-gold transition-colors">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
