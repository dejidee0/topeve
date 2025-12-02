"use client";
import { UserPlus } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 bg-linear-to-br from-brand to-brand/90">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-5 sm:space-y-6"
        >
          {/* Icon */}
          <UserPlus size={38} className="text-gold mx-auto mb-2 sm:mb-0" />

          {/* Title */}
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-cream leading-tight">
            Join the Topeve Edit
          </h3>

          {/* Description */}
          <p className="text-cream/90 text-base sm:text-lg max-w-2xl mx-auto px-2">
            Sign up for exclusive drops, styling edits, and early access to
            sales.
          </p>

          {/* Form */}
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full px-5 sm:px-6 py-3 sm:py-4 border-2 border-cream/20 bg-white/10 backdrop-blur-sm 
          text-cream placeholder:text-cream/60 outline-none focus:border-gold transition-colors w-full text-sm sm:text-base"
            />
            <button
              type="submit"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gold text-brand rounded-full font-medium hover:bg-cream transition-colors duration-300 text-sm sm:text-base"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
