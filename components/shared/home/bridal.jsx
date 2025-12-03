// components/shared/home/bridal.jsx
"use client";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const BridalShower = () => {
  return (
    <section className="relative px-6 lg:px-16 py-32 overflow-hidden bg-gradient-to-br from-cream via-white to-taupe/10">
      {/* Decorative Elements - Optimized */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gold/20 backdrop-blur-sm rounded-full">
              <Heart size={16} className="text-brand fill-brand" />
              <span className="text-sm font-bold text-brand uppercase tracking-wider">
                Exclusive Collection
              </span>
            </div>

            {/* Title */}
            <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-brand leading-tight">
              Bridal Shower
              <span className="block text-gold mt-2">Elegance</span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed max-w-xl">
              Celebrate your special moments in exquisite style. Our bridal
              collection features handcrafted gowns and ensembles designed to
              make every bride feel extraordinary.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Hand-embroidered", value: "Lace Details" },
                { label: "Premium", value: "Silk & Satin" },
                { label: "Custom", value: "Alterations" },
                { label: "Limited", value: "Edition Pieces" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-taupe/20"
                >
                  <div className="text-xs text-charcoal/60 uppercase tracking-wider mb-1">
                    {feature.label}
                  </div>
                  <div className="text-base font-semibold text-brand">
                    {feature.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/products?category=ready-to-wear&subcategory=bridal-shower"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand text-cream rounded-full font-semibold text-lg hover:bg-gold hover:text-brand transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <span>Shop Bridal Collection</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </Link>
            </div>
          </motion.div>

          {/* Right: Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Image - Optimized */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                  alt="Bridal Shower Collection - Handcrafted gowns for your special day"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                  loading="lazy"
                  quality={85}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-transparent" />
              </div>
            </div>

            {/* Secondary Image - Small overlay */}
            <div className="absolute -bottom-8 -left-8 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1645827042168-4fb0cdd0bf7e?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Bridal detail shot"
                fill
                sizes="192px"
                className="object-cover"
                loading="lazy"
                quality={75}
              />
            </div>

            {/* Decorative floating hearts - Reduced animation complexity */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-4 -right-4 text-gold/20 pointer-events-none"
            >
              <Heart size={64} className="fill-current" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-20 -right-8 text-gold/20 pointer-events-none"
            >
              <Heart size={48} className="fill-current" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BridalShower;
