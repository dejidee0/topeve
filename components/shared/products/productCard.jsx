// components/shared/products/productCard.jsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/products";
import { useCartStore } from "@/lib/store";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Cart store
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist persistence
    console.log("💝 Wishlist toggled:", product.name, !isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if product is in stock
    if (!product.in_stock) {
      console.warn("⚠️ Product out of stock:", product.name);
      return;
    }

    // Check if product requires size selection
    if (product.size?.length > 0) {
      // Redirect to product page for size selection
      console.log("📏 Size selection required, redirecting to product page");
      router.push(`/products/${product.slug}`);
      return;
    }

    setIsAdding(true);

    // Add to cart
    try {
      addItem(
        product,
        1, // quantity
        null, // size (not selected from card)
        product.color || null // color
      );

      console.log("✅ Added to cart:", product.name);

      setTimeout(() => {
        setIsAdding(false);
        setIsAdded(true);

        // Open cart sidebar after a short delay
        setTimeout(() => {
          openCart();
        }, 300);

        // Reset added state
        setTimeout(() => setIsAdded(false), 2000);
      }, 800);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      setIsAdding(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.slug}`);
  };

  const hasBadge =
    product.tags?.includes("new") || product.tags?.includes("best-seller");

  // Determine button text
  const getButtonText = () => {
    if (!product.in_stock) return "Out of Stock";
    if (product.size?.length > 0) return "Select Size";
    return "Add";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-taupe/20 h-full flex flex-col"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block flex-1 flex flex-col"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            quality={85}
          />

          {/* Gradient Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"
          />

          {/* Badges */}
          {hasBadge && (
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
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

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300 z-10"
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-charcoal/70 hover:text-brand"
              }`}
            />
          </button>

          {/* Quick View Button - Shows on Hover */}
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
                  onClick={handleQuickView}
                  aria-label={`Quick view ${product.name}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-brand px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-all duration-300"
                >
                  <Eye size={16} />
                  <span>Quick View</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category/Material */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">
              {product.subcategory || product.category}
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

          {/* Color & Sizes Info */}
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
              <div className="text-xl md:text-2xl font-bold text-brand">
                {formatPrice(product.price, product.currency || "NGN")}
              </div>
              {product.stock_quantity !== undefined &&
                product.stock_quantity <= 5 &&
                product.stock_quantity > 0 && (
                  <div className="text-[10px] text-red-500 font-medium mt-0.5">
                    Only {product.stock_quantity} left
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
                  : "Add to cart"
              }
              className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
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
      </Link>
    </div>
  );
}
