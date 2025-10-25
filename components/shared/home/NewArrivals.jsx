"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ProductCard } from "@/components/common/ProductCard";
import { PRODUCTS } from "@/lib/constants";
import { Button } from "@/components/common/ui/button";
import { ArrowRight } from "lucide-react";

export function NewArrivals() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      ref={ref}
      className="relative bg-neutral-50 py-12 lg:py-16"
      aria-label="New Arrivals Section"
    >
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-10 lg:mb-12"
        >
          <motion.span
            variants={childVariants}
            className="text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-neutral-700 mb-3 inline-block"
          >
            Latest Drops
          </motion.span>
          <motion.h2
            variants={childVariants}
            className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 mb-3 relative"
          >
            New Arrivals
            <span className="absolute inset-0 text-neutral-900/10 translate-x-0.5 translate-y-0.5 pointer-events-none">
              New Arrivals
            </span>
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto"
          >
            Discover the latest additions to our exclusive collection
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              variants={childVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-10 lg:mt-12"
        >
          <Button
            asChild
            size="lg"
            className="relative bg-white text-neutral-900 border-2 border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 font-medium uppercase tracking-widest px-8 py-4 text-sm rounded-sm transition-all duration-300 group"
          >
            <Link href="/products" className="inline-flex items-center gap-2">
              <span className="relative z-10">View All Products</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
              <span className="absolute inset-0 bg-gradient-to-r from-neutral-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300/50 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300/50 to-transparent"
        />
      </div>
    </section>
  );
}
