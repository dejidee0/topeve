"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bentoItems } from "@/lib/constants";
import { fade } from "@/utils/products";

const BentoGrid = () => {
  return (
    <section className="px-6 lg:px-16 py-20 bg-linear-to-b from-cream to-taupe/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fade}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-brand mb-4">
            Explore the Edit
          </h2>
          <p className="text-charcoal/70 max-w-2xl mx-auto">
            Curated collections designed for the modern wardrobe
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px]">
          {bentoItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`${item.span} group relative overflow-hidden rounded-3xl cursor-pointer`}
            >
              <Link
                href={`/products?category=${
                  item.slug || item.title.toLowerCase().replace(/\s+/g, "-")
                }`}
                className="block w-full h-full"
              >
                {/* Image with overlay */}
                <div className="absolute inset-0">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                  >
                    {/* Accent line */}
                    <motion.div className="w-12 h-1 bg-gold rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <h3 className="font-heading text-2xl md:text-3xl text-white mb-2 transform group-hover:translate-x-2 transition-transform duration-500">
                      {item.title}
                    </h3>

                    <p className="text-white/90 text-sm md:text-base mb-1 transform group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      {item.subtitle}
                    </p>

                    {/* Hidden description that appears on hover */}
                    <p className="text-white/70 text-xs md:text-sm max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 transform group-hover:translate-x-2 delay-100">
                      {item.description}
                    </p>

                    {/* Arrow icon */}
                    <div className="mt-4 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-2 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Animated border on hover */}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-gold/0 group-hover:ring-gold/50 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            View All Collections
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoGrid;
