// components/shared/products/productCard.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 800);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.slug}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasBadge =
    product.tags?.includes("new") || product.tags?.includes("best-seller");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-taupe/20"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-3/4 overflow-hidden bg-cream/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"
          />

          {/* Badges */}
          {hasBadge && (
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.tags?.includes("new") && (
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-3 py-1 bg-gold text-brand text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg"
                >
                  New
                </motion.span>
              )}
              {product.tags?.includes("best-seller") && (
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-3 py-1 bg-brand text-cream text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg"
                >
                  Best Seller
                </motion.span>
              )}
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-300 z-10"
          >
            <motion.div
              animate={{
                scale: isWishlisted ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={18}
                className={`transition-colors duration-300 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-charcoal/70 hover:text-brand"
                }`}
              />
            </motion.div>
          </motion.button>

          {/* Quick View Button - Shows on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
              >
                <button
                  onClick={handleQuickView}
                  className="flex items-center gap-2 bg-white/95 backdrop-blur-sm text-brand px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-all duration-300"
                >
                  <Eye size={16} />
                  Quick View
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category/Material */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">
              {product.subcategory || product.category}
            </span>
            {product.material && (
              <span className="text-[10px] text-charcoal/50">
                {product.material}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-heading text-lg text-brand line-clamp-1 group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>

          {/* Color Indicator */}
          {product.color && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/60">Color:</span>
              <span className="text-xs text-charcoal/80 font-medium capitalize">
                {product.color}
              </span>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <div className="text-xl font-bold text-brand">
                {formatPrice(product.price)}
              </div>
              {product.size?.length > 0 && (
                <div className="text-[10px] text-charcoal/50">
                  Sizes: {product.size.join(", ")}
                </div>
              )}
            </div>

            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-brand text-cream hover:bg-gold hover:text-brand"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    <span className="hidden sm:inline">Added</span>
                  </motion.div>
                ) : isAdding ? (
                  <motion.div
                    key="adding"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <ShoppingBag size={16} />
                    </motion.div>
                    <span className="hidden sm:inline">Adding</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span className="hidden sm:inline">Add</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
