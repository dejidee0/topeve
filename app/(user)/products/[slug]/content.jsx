// app/products/[slug]/content.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Share2,
  Check,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Ruler,
  ChevronRight,
  Star,
  Package,
  X,
} from "lucide-react";
import ProductImageGallery from "./gallery";
import ProductTabs from "./tabs";
import RelatedProducts from "./related";
import ReviewSection from "./review";
import { getRelatedProducts } from "@/utils/products";
import { formatPrice } from "@/utils/products";
import { useCartStore } from "@/lib/store";

export default function ProductPageContent({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Cart store
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Fetch related products
  useEffect(() => {
    async function fetchRelated() {
      const { data, error } = await getRelatedProducts(
        product.id,
        product.category,
        product.tags || [],
        4
      );

      if (!error && data) {
        setRelatedProducts(data);
        console.log("🔗 [ProductPageContent] Related products loaded:", {
          count: data.length,
          products: data.map((p) => p.name),
        });
      }
    }

    fetchRelated();
  }, [product.id, product.category, product.tags]);

  const handleAddToCart = () => {
    console.log("🛒 [ProductPageContent] Add to cart clicked:", {
      productId: product.id,
      selectedSize,
      quantity,
      needsSize: product.size?.length > 0,
    });

    // Validation: Check size selection
    if (product.size?.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    // Validation: Check stock
    if (!product.in_stock) {
      alert("This product is currently out of stock");
      return;
    }

    // Validation: Check stock quantity
    if (
      product.stock_quantity !== undefined &&
      quantity > product.stock_quantity
    ) {
      alert(`Only ${product.stock_quantity} items available in stock`);
      return;
    }

    setIsAdding(true);

    try {
      // Add to cart
      addItem(product, quantity, selectedSize, product.color || null);

      console.log("✅ [ProductPageContent] Added to cart successfully:", {
        name: product.name,
        quantity,
        size: selectedSize,
        color: product.color,
      });

      setTimeout(() => {
        setIsAdding(false);
        setIsAdded(true);

        // Open cart sidebar after short delay
        setTimeout(() => {
          openCart();
        }, 300);

        // Reset added state
        setTimeout(() => setIsAdded(false), 2000);
      }, 800);
    } catch (error) {
      console.error("❌ [ProductPageContent] Error adding to cart:", error);
      setIsAdding(false);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleShare = async () => {
    console.log("📤 [ProductPageContent] Share clicked");

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Topeve`,
          url: window.location.href,
        });
        console.log(
          "✅ [ProductPageContent] Shared successfully via Web Share API"
        );
      } catch (err) {
        console.log("⚠️ [ProductPageContent] Share cancelled or failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
      console.log("✅ [ProductPageContent] Link copied to clipboard");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log("❤️ [ProductPageContent] Wishlist toggled:", !isWishlisted);
    // TODO: Implement wishlist persistence
  };

  const breadcrumbs = [
    { name: "Home", href: "/" },
    {
      name: product.category.replace(/-/g, " "),
      href: `/products?category=${product.category}`,
    },
    ...(product.subcategory
      ? [
          {
            name: product.subcategory.replace(/-/g, " "),
            href: `/products?category=${product.category}&subcategory=${product.subcategory}`,
          },
        ]
      : []),
    { name: product.name, href: "#" },
  ];

  console.log(
    "🍞 [ProductPageContent] Breadcrumbs:",
    breadcrumbs.map((b) => b.name)
  );

  // Check stock status
  const isLowStock =
    product.stock_quantity !== undefined && product.stock_quantity <= 5;
  const stockMessage = !product.in_stock
    ? "Out of Stock"
    : isLowStock
    ? `Only ${product.stock_quantity} left in stock`
    : "In Stock - Ready to Ship";

  // Calculate max quantity based on stock
  const maxQuantity = product.stock_quantity || 10;

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-charcoal/60 mb-8">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.name} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight size={14} />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-brand font-medium capitalize">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-brand transition-colors capitalize"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Image Gallery */}
          <ProductImageGallery product={product} />

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.includes("new") && (
                  <span className="px-3 py-1 bg-gold/20 text-brand text-xs font-bold uppercase tracking-wider rounded-full">
                    New Arrival
                  </span>
                )}
                {product.tags.includes("best-seller") && (
                  <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider rounded-full">
                    Best Seller
                  </span>
                )}
                {product.tags.includes("exclusive") && (
                  <span className="px-3 py-1 bg-gold text-brand text-xs font-bold uppercase tracking-wider rounded-full">
                    Exclusive
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1 bg-brand text-cream text-xs font-bold uppercase tracking-wider rounded-full">
                    Featured
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="font-heading text-4xl md:text-5xl text-brand mb-3">
                {product.name}
              </h1>
              <p className="text-charcoal/70 text-lg capitalize">
                {product.subcategory || product.category} • {product.material}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 4
                        ? "fill-gold text-gold"
                        : "fill-taupe/30 text-taupe/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-charcoal/70">
                4.8 (127 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-taupe/20">
              <div className="text-4xl font-bold text-brand">
                {formatPrice(product.price, product.currency || "NGN")}
              </div>
              <p className="text-sm text-charcoal/60 mt-1">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Color */}
            {product.color && (
              <div>
                <h3 className="text-sm font-semibold text-charcoal/80 mb-3">
                  Color: <span className="capitalize">{product.color}</span>
                </h3>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-brand ring-2 ring-gold/30 ring-offset-2 flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        backgroundColor:
                          product.color === "mocha"
                            ? "#5B3A2E"
                            : product.color === "beige"
                            ? "#F5F5DC"
                            : product.color === "ivory"
                            ? "#FFFFF0"
                            : product.color === "dusty-rose"
                            ? "#DCAE96"
                            : product.color === "gold"
                            ? "#D4AF7F"
                            : product.color === "navy"
                            ? "#000080"
                            : product.color === "blue"
                            ? "#0000FF"
                            : product.color === "emerald"
                            ? "#50C878"
                            : product.color === "amber"
                            ? "#FFBF00"
                            : product.color === "nude"
                            ? "#E3BC9A"
                            : product.color === "mint"
                            ? "#98D8C8"
                            : product.color === "brown"
                            ? "#8B4513"
                            : product.color === "black"
                            ? "#222222"
                            : product.color === "white"
                            ? "#FFFFFF"
                            : product.color === "clear"
                            ? "#F0F0F0"
                            : product.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.size?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal/80">
                    Size: {selectedSize || "Select size"}
                  </h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-brand hover:text-gold transition-colors flex items-center gap-1"
                  >
                    <Ruler size={14} />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        console.log(
                          "👕 [ProductPageContent] Size selected:",
                          size
                        );
                      }}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-brand text-cream shadow-md"
                          : "bg-taupe/10 text-charcoal/70 hover:bg-taupe/20 hover:text-brand"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-charcoal/80 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-taupe/30 rounded-lg">
                  <button
                    onClick={() => {
                      const newQty = Math.max(1, quantity - 1);
                      setQuantity(newQty);
                      console.log(
                        "➖ [ProductPageContent] Quantity decreased:",
                        newQty
                      );
                    }}
                    className="p-3 hover:bg-taupe/10 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => {
                      const newQty = Math.min(maxQuantity, quantity + 1);
                      setQuantity(newQty);
                      console.log(
                        "➕ [ProductPageContent] Quantity increased:",
                        newQty
                      );
                    }}
                    className="p-3 hover:bg-taupe/10 transition-colors disabled:opacity-50"
                    disabled={quantity >= maxQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span
                  className={`text-sm font-medium ${
                    !product.in_stock
                      ? "text-red-500"
                      : isLowStock
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {stockMessage}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={handleAddToCart}
                disabled={isAdding || isAdded || !product.in_stock}
                whileHover={{ scale: product.in_stock ? 1.02 : 1 }}
                whileTap={{ scale: product.in_stock ? 0.98 : 1 }}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  !product.in_stock
                    ? "bg-charcoal/20 text-charcoal/50 cursor-not-allowed"
                    : isAdded
                    ? "bg-green-500 text-white"
                    : "bg-brand text-cream hover:bg-gold hover:text-brand"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <AnimatePresence mode="wait">
                  {!product.in_stock ? (
                    <span>Out of Stock</span>
                  ) : isAdded ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={20} />
                      <span>Added to Cart</span>
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
                        <ShoppingCart size={20} />
                      </motion.div>
                      <span>Adding...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      <span>Add to Cart</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={handleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-full border-2 border-brand hover:bg-brand hover:text-cream transition-all duration-300"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-current" : ""}
                />
              </motion.button>

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-full border-2 border-brand hover:bg-brand hover:text-cream transition-all duration-300"
                aria-label="Share product"
              >
                <Share2 size={20} />
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-taupe/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <Truck size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand">
                    Free Shipping
                  </div>
                  <div className="text-xs text-charcoal/60">
                    On orders over ₦50,000
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand">
                    Easy Returns
                  </div>
                  <div className="text-xs text-charcoal/60">
                    30-day return policy
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand">
                    Authenticity
                  </div>
                  <div className="text-xs text-charcoal/60">
                    100% genuine products
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm text-charcoal/70">
              <div className="flex items-center gap-2">
                <Package size={16} />
                <span>SKU: {product.sku || product.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span>{stockMessage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductTabs product={product} />

        {/* Reviews */}
        {/* <ReviewSection /> */}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

// Size Guide Modal Component
function SizeGuideModal({ onClose }) {
  console.log("📏 [SizeGuideModal] Opened");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-brand">Size Guide</h2>
          <button
            onClick={onClose}
            className="text-charcoal/60 hover:text-brand transition-colors"
            aria-label="Close size guide"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-charcoal/70">
            Our garments are designed to fit true to size. For the best fit,
            please refer to the measurements below.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-taupe/20">
                  <th className="text-left py-3 font-semibold">Size</th>
                  <th className="text-left py-3 font-semibold">Bust (cm)</th>
                  <th className="text-left py-3 font-semibold">Waist (cm)</th>
                  <th className="text-left py-3 font-semibold">Hips (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: "XS", bust: "81-84", waist: "63-66", hips: "89-92" },
                  { size: "S", bust: "86-89", waist: "68-71", hips: "94-97" },
                  { size: "M", bust: "91-94", waist: "73-76", hips: "99-102" },
                  { size: "L", bust: "96-99", waist: "78-81", hips: "104-107" },
                  {
                    size: "XL",
                    bust: "101-104",
                    waist: "83-86",
                    hips: "109-112",
                  },
                  {
                    size: "2XL",
                    bust: "106-109",
                    waist: "88-91",
                    hips: "114-117",
                  },
                ].map((row) => (
                  <tr key={row.size} className="border-b border-taupe/10">
                    <td className="py-3 font-semibold">{row.size}</td>
                    <td className="py-3 text-charcoal/70">{row.bust}</td>
                    <td className="py-3 text-charcoal/70">{row.waist}</td>
                    <td className="py-3 text-charcoal/70">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-taupe/10 rounded-xl p-4">
            <h3 className="font-semibold text-brand mb-2">How to Measure</h3>
            <ul className="space-y-1 text-sm text-charcoal/70">
              <li>• Bust: Measure around the fullest part of your chest</li>
              <li>• Waist: Measure around the narrowest part of your waist</li>
              <li>• Hips: Measure around the fullest part of your hips</li>
            </ul>
          </div>

          <div className="bg-gold/10 rounded-xl p-4">
            <h3 className="font-semibold text-brand mb-2">💡 Fit Tips</h3>
            <ul className="space-y-1 text-sm text-charcoal/70">
              <li>• All measurements are in centimeters</li>
              <li>• Between sizes? We recommend sizing up</li>
              <li>• For a relaxed fit, choose one size larger</li>
              <li>• Contact us if you need personalized sizing advice</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
