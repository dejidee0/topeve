"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
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
      aria-label="Testimonials Section"
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
            Testimonials
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-neutral-900 relative"
          >
            What Our Customers Say
            <span className="absolute inset-0 text-neutral-900/10 translate-x-0.5 translate-y-0.5 pointer-events-none">
              What Our Customers Say
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group bg-white/80 rounded-sm shadow-sm p-6 sm:p-8"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-neutral-900 text-neutral-900 group-hover:scale-110 transition-transform duration-300"
                  />
                ))}
              </div>

              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-neutral-300 group-hover:ring-neutral-900 transition-all duration-300">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
                    sizes="48px"
                    loading={index < 3 ? "eager" : "lazy"}
                    quality={85}
                  />
                </div>
                <div>
                  <div className="font-['Playfair_Display'] text-base sm:text-lg font-semibold text-neutral-900">
                    {testimonial.name}
                    <span className="block h-0.5 w-0 group-hover:w-8 bg-neutral-300 mt-1 transition-all duration-300" />
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
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
