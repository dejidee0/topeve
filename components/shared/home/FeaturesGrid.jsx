"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Sparkles, Clock, Package } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description:
      "Handcrafted with the finest fabrics and meticulous attention to detail",
  },
  {
    icon: TrendingUp,
    title: "Authentic Designs",
    description: "Traditional patterns reimagined for the modern wardrobe",
  },
  {
    icon: Clock,
    title: "Fast Shipping",
    description: "Express delivery to your doorstep within 3-5 business days",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    description: "Your items arrive in pristine condition, every time",
  },
];

export default function FeaturesGrid() {
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
      className="relative bg-neutral-50 py-12 lg:py-16"
      aria-label="Features Grid Section"
    >
      {/* Subtle Background Texture */}
      {/* <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven-light.png')] opacity-5" /> */}

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
            Why Choose Us
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 relative"
          >
            The Excellence Promise
            <span className="absolute inset-0 text-neutral-900/10 translate-x-0.5 translate-y-0.5 pointer-events-none">
              The Excellence Promise
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="text-center bg-white/80 rounded-sm shadow-sm p-6 sm:p-8"
            >
              <div className="relative inline-flex items-center justify-center mb-5">
                <feature.icon
                  className="h-10 w-10 text-neutral-900"
                  strokeWidth={1.5}
                />
                <span className="absolute inset-0 bg-neutral-200/20 rounded-full scale-150 group-hover:scale-160 transition-transform duration-300" />
              </div>
              <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold mb-2 text-neutral-900">
                {feature.title}
                <span className="block h-0.5 w-0 group-hover:w-10 bg-neutral-300 mt-2 mx-auto transition-all duration-300" />
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
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
