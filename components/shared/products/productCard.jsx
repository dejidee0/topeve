"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Eye, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/products";
import { useCartStore } from "@/lib/store";

// Format hyphenated slugs → readable label ("ready-to-wear" → "Ready to Wear")
const formatLabel = (str) =>
  str
    ? str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const mountedRef = useRef(true);

  // Cart store
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Track mount state to prevent setState after unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Guard: render nothing if product data is missing
  if (!product || !product.slug) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock || isAdding || isAdded) return;

    // Redirect to product page for size selection
    if (product.size?.length > 0) {
      router.push(`/products/${product.slug}`);
      return;
    }

    setIsAdding(true);

    try {
      addItem(product, 1, null, product.color || null);

      setTimeout(() => {
        if (!mountedRef.current) return;
        setIsAdding(false);
        setIsAdded(true);

        setTimeout(() => {
          if (mountedRef.current) openCart();
        }, 300);

        setTimeout(() => {
          if (mountedRef.current) setIsAdded(false);
        }, 2000);
      }, 800);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      if (mountedRef.current) setIsAdding(false);
    }
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("a[href]") ||
      e.defaultPrevented
    ) {
      return;
    }
    router.push(`/products/${product.slug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/products/${product.slug}`);
    }
  };

  const getButtonText = () => {
    if (!product.in_stock) return "Out of Stock";
    if (product.size?.length > 0) return "Select Size";
    return "Add";
  };

  const displayCategory = formatLabel(product.subcategory || product.category);
  const price = product.price ?? 0;
  const stockQty = product.stock_quantity ?? null;
  const isLowStock = stockQty != null && stockQty <= 5 && stockQty > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`View ${product.name}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-taupe/20 h-full flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream/30">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl bg-cream/60">
            📦
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"
        />

        {/* Out of Stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="px-4 py-1.5 bg-white/90 text-brand text-xs font-bold uppercase tracking-widest rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges */}
        {(product.tags?.includes("new") ||
          product.tags?.includes("best-seller") ||
          product.featured) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.featured && (
              <span className="inline-block px-3 py-1 bg-gold text-brand text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                Featured
              </span>
            )}
            {product.tags?.includes("new") && (
              <span className="inline-block px-3 py-1 bg-gold text-brand text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                New
              </span>
            )}
            {product.tags?.includes("best-seller") && (
              <span className="inline-block px-3 py-1 bg-brand text-cream text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                Best Seller
              </span>
            )}
          </div>
        )}

        {/* Quick View Button — shows on hover, hidden when out of stock */}
        {product.in_stock && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products/${product.slug}`);
                  }}
                  aria-label={`Quick view ${product.name}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-brand px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-all duration-300"
                >
                  <Eye size={16} />
                  <span>Quick View</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category / Material */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">
            {displayCategory}
          </span>
          {product.material && (
            <span className="text-[10px] text-charcoal/50 capitalize">
              {product.material}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-heading text-base md:text-lg text-brand line-clamp-2 mb-2 min-h-[3rem] group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>

        {/* Color & Sizes */}
        <div className="space-y-1 mb-3 flex-1">
          {product.color && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/60">Color:</span>
              <span className="text-xs text-charcoal/80 font-medium capitalize">
                {product.color}
              </span>
            </div>
          )}
          {product.size?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/60">Sizes:</span>
              <span className="text-xs text-charcoal/80 font-medium">
                {product.size.slice(0, 3).join(", ")}
                {product.size.length > 3 && ` +${product.size.length - 3}`}
              </span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-taupe/20 mt-auto">
          <div>
            <div className="text-base text-wrap md:text-2xl font-bold text-brand">
              {formatPrice(price)}
            </div>
            {isLowStock && (
              <div className="text-[10px] text-red-500 font-medium mt-0.5">
                Only {stockQty} left
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || !product.in_stock}
            aria-label={
              !product.in_stock
                ? "Product out of stock"
                : product.size?.length > 0
                ? "Select size on product page"
                : `Add ${product.name} to cart`
            }
            className={`relative z-10 flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
              !product.in_stock
                ? "bg-charcoal/20 text-charcoal/50 cursor-not-allowed"
                : isAdded
                ? "bg-green-500 text-white"
                : "bg-brand text-cream hover:bg-gold hover:text-brand hover:scale-105 active:scale-95"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="added"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="flex items-center gap-1.5"
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
                  className="flex items-center gap-1.5"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag size={16} />
                  <span className="hidden sm:inline">{getButtonText()}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}
