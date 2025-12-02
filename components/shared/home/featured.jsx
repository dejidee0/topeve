// components/shared/home/featured.jsx
"use client";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/products";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Featured = ({ products = [] }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  console.log("✨ [Featured] Rendering with products:", products.length);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if product is in stock
    if (!product.in_stock) {
      console.warn("⚠️ Product out of stock:", product.name);
      return;
    }

    // Check if product requires size selection
    if (product.size?.length > 0) {
      console.log("📏 Size selection required, redirecting to product page");
      router.push(`/products/${product.slug}`);
      return;
    }

    // Add to cart
    try {
      addItem(product, 1, null, product.color || null);
      console.log("✅ Added to cart from featured:", product.name);

      // Open cart after a short delay
      setTimeout(() => {
        openCart();
      }, 300);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  // If no products from database, show message
  if (products.length === 0) {
    return (
      <section className="px-6 lg:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl text-brand mb-4">
              Featured Products
            </h2>
            <p className="text-charcoal/70">
              Check back soon for our handpicked essentials
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 lg:px-16 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl text-brand mb-4">
            Featured Products
          </h2>
          <p className="text-charcoal/70">
            Handpicked essentials for your wardrobe
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.slice(0, 8).map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              whileHover={{ y: -8 }}
              className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-cream/50"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative overflow-hidden">
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={product.image}
                      alt={`${product.name} - ${product.category} from Topeve luxury collection`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      quality={85}
                    />

                    {/* Badges */}
                    {product.tags?.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.tags.includes("new") && (
                          <span className="inline-block px-3 py-1 bg-gold text-brand text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                            New
                          </span>
                        )}
                        {product.tags.includes("best-seller") && (
                          <span className="inline-block px-3 py-1 bg-brand text-cream text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                            Best Seller
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.in_stock}
                    aria-label={
                      !product.in_stock
                        ? "Product out of stock"
                        : product.size?.length > 0
                        ? "Select size on product page"
                        : `Add ${product.name} to cart`
                    }
                    className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md transition-all duration-300 z-10 ${
                      product.in_stock
                        ? "hover:bg-white hover:scale-110"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag
                      size={18}
                      className={
                        product.in_stock ? "text-brand" : "text-charcoal/50"
                      }
                    />
                  </button>

                  {/* Quick view on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="block text-center text-white text-sm font-medium">
                      Quick View
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">
                      {product.subcategory || product.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-brand mb-2 line-clamp-1 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-charcoal">
                      {formatPrice(product.price, product.currency || "NGN")}
                    </span>
                    <span className="text-sm text-gold group-hover:text-brand transition-colors font-medium flex items-center gap-1">
                      Shop
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand text-brand rounded-full hover:bg-brand hover:text-cream transition-all duration-300 font-medium"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
