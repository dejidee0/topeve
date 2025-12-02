"use client";
import { Star } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { fade } from "@/utils/products";

const Testimonials = () => {
  return (
    <section className="px-6 lg:px-16 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fade}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl text-brand mb-4">
            Loved by Customers
          </h2>
          <p className="text-charcoal/70">Real reviews from our community</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "The fabric and fit are divine. Shipping and packaging felt premium.",
              name: "Aisha",
              rating: 5,
            },
            {
              quote:
                "Top tier customer service and the trench is a staple in my wardrobe.",
              name: "Chinedu",
              rating: 5,
            },
            {
              quote: "Beautifully packaged and great quality. Will reorder.",
              name: "Toni",
              rating: 5,
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-cream/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-taupe/20"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-charcoal/80 mb-6 leading-relaxed">
                &quot;{t.quote}&quot;
              </p>
              <cite className="block text-sm font-semibold text-brand not-italic">
                — {t.name}
              </cite>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
