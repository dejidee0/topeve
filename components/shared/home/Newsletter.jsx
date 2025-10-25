"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/common/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ShopCTA() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="relative bg-neutral-900 text-white py-12 lg:py-16"
      aria-label="Shop CTA Section"
    >
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven-light.png')] opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-neutral-200 mb-3 inline-block"
          >
            Start Your Journey
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white relative mb-5"
          >
            Shop the Finest Fashion
            <span className="absolute inset-0 text-white/10 translate-x-0.5 translate-y-0.5 pointer-events-none">
              Shop the Finest Fashion
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-neutral-300 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Discover our exclusive collections, crafted with heritage and modern
            elegance. Elevate your style today.
          </motion.p>

          <motion.div variants={itemVariants} className="group inline-flex">
            <Button
              asChild
              size="lg"
              className="relative bg-white text-neutral-900 hover:bg-neutral-200 border-2 border-transparent hover:border-neutral-300 font-medium uppercase tracking-widest px-8 py-4 text-sm rounded-sm transition-all duration-300"
            >
              <Link href="/products" className="inline-flex items-center gap-2">
                <span className="relative z-10">Shop Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform relative z-10" />
                <span className="absolute inset-0 bg-gradient-to-r from-neutral-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-400/50 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-400/50 to-transparent"
      />
    </section>
  );
}
