"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { fade } from "@/utils/products";

const Brand = () => {
  return (
    <section className="px-6 lg:px-16 py-20 bg-sand/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fade}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial"
              width={1200}
              height={900}
              className="object-cover w-full h-[500px]"
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fade}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-2 bg-gold/20 rounded-full text-sm font-medium text-brand mb-4">
            Our Philosophy
          </div>
          <h3 className="font-heading text-4xl md:text-5xl text-brand leading-tight">
            Craft, Consciousness & Care
          </h3>
          <p className="text-lg text-charcoal/80 leading-relaxed">
            Topeve selects pieces for quality, sustainability and timelessness.
            We partner with ateliers and makers who value craft and ethical
            production. Each drop is curated to be worn, treasured and passed
            on.
          </p>

          <div className="flex gap-4 pt-4">
            <Link
              href="/about"
              className="px-6 py-3 border-2 border-brand text-brand rounded-full font-medium hover:bg-brand hover:text-cream transition-all duration-300"
            >
              Learn More
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-brand text-cream rounded-full font-medium hover:bg-gold hover:text-brand transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Brand;
