// app/page.jsx
"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { bentoItems, featuredProducts } from "@/lib/constants";
import Hero from "@/components/shared/home/hero";

export default function HomePage() {
  const fade = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <Hero />

      {/* BENTO GRID - REDESIGNED */}
      <section className="px-6 lg:px-16 py-20 bg-gradient-to-b from-cream to-taupe/20">
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
                  href={`/collections/${item.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
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
                      <motion.div
                        className={`w-12 h-1 bg-${item.accent} rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        style={{
                          backgroundColor: `var(--color-${item.accent})`,
                        }}
                      />

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
              href="/collections"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-cream rounded-full hover:bg-gold transition-colors duration-300 font-medium"
            >
              View All Collections
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
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
              Featured Products
            </h2>
            <p className="text-charcoal/70">
              Handpicked essentials for your wardrobe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-cream/50"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    width={400}
                    height={500}
                    className="object-cover w-full h-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110">
                    <ShoppingBag size={18} className="text-brand" />
                  </button>

                  {/* Quick view on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Link
                      href={`/product/${p.id}`}
                      className="block text-center text-white text-sm font-medium"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-medium text-brand mb-2">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-charcoal">
                      {p.price}
                    </span>
                    <Link
                      href={`/product/${p.id}`}
                      className="text-sm text-gold hover:text-brand transition-colors font-medium flex items-center gap-1"
                    >
                      Shop
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL / BRAND STORY */}
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
              Topeve selects pieces for quality, sustainability and
              timelessness. We partner with ateliers and makers who value craft
              and ethical production. Each drop is curated to be worn, treasured
              and passed on.
            </p>

            <div className="flex gap-4 pt-4">
              <Link href="/about" className="btn-ghost">
                Learn More
              </Link>
              <Link href="/shop" className="btn-primary">
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
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

      {/* NEWSLETTER / CTA */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 sm:py-20 bg-gradient-to-br from-brand to-brand/90">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-5 sm:space-y-6"
          >
            {/* Icon */}
            <Sparkles size={38} className="text-gold mx-auto mb-2 sm:mb-0" />

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
    </main>
  );
}
