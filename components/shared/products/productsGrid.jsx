// app/products/components/ProductGrid.jsx
"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-charcoal/70">
        No products found.
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((p) => (
        <motion.div key={p.id} variants={item}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
