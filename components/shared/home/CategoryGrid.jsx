"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="relative bg-neutral-50 py-12 lg:py-16"
      aria-label="Category Grid Section"
    >
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven-light.png')] opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-10 lg:mb-12"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-neutral-700 mb-3 inline-block"
          >
            Shop By Category
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 relative"
          >
            Explore Our Range
            <span className="absolute inset-0 text-neutral-900/10 translate-x-0.5 translate-y-0.5 pointer-events-none">
              Explore Our Range
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group"
            >
              <Link href={category.href} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm shadow-sm">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:brightness-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading={index < 3 ? "eager" : "lazy"}
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                    <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                      {category.name}
                      <span className="block h-0.5 w-0 group-hover:w-12 bg-white/80 mt-2 transition-all duration-300" />
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

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
    </section>
  );
}
