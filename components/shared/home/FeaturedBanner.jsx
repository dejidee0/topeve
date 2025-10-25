"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedBanner() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      className="relative bg-neutral-50 py-4 border-y border-neutral-200/80"
      aria-label="Featured Collection Banner"
    >
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-5" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 py-3"
        >
          <div className="flex items-center gap-3 md:gap-5">
            <motion.span
              variants={childVariants}
              className="text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-neutral-700"
            >
              Limited Edition
            </motion.span>
            <motion.div
              variants={childVariants}
              className="h-5 w-px bg-neutral-300/70"
            />
            <motion.h2
              variants={childVariants}
              className="font-['Playfair_Display'] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900 relative"
            >
              Heritage Collection 2025
              <span className="absolute inset-0 text-neutral-900/10 translate-x-0.5 translate-y-0.5 pointer-events-none">
                Heritage Collection 2025
              </span>
            </motion.h2>
          </div>

          <motion.div variants={childVariants}>
            <Link
              href="/collections/heritage"
              className="group relative flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest font-medium text-neutral-900 bg-white/80 border border-neutral-300 rounded-sm hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 ease-in-out"
            >
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
              <span className="absolute inset-0 bg-gradient-to-r from-neutral-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300/50 to-transparent"
      />
    </section>
  );
}
