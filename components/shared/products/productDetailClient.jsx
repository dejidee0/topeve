"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ProductCard } from "@/components/common/ProductCard";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  X,
  ZoomIn,
} from "lucide-react";

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    details: false,
    shipping: false,
  });

  const reviewsRef = useRef(null);
  const relatedRef = useRef(null);
  const isReviewsInView = useInView(reviewsRef, {
    once: true,
    margin: "-100px",
  });
  const isRelatedInView = useInView(relatedRef, {
    once: true,
    margin: "-100px",
  });

  // Product images array
  const images = product.images || [product.image];

  // Handle image navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle quantity
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Toggle accordion sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: images[0],
    };

    // Add to cart logic (localStorage, context, or state management)
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color?.name === selectedColor?.name
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show success message or redirect
    alert("Added to cart!");
  };

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || product.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Add to favorites
  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorited) {
      const filtered = favorites.filter((id) => id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(filtered));
    } else {
      favorites.push(product.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    setIsFavorited(!isFavorited);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200/80 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1600px] py-4">
          <nav className="flex items-center gap-2 text-sm text-black/50">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-black transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-black transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-black font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1600px] py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
              >
                <ZoomIn className="h-5 w-5 text-black" />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5 text-black" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5 text-black" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-xs uppercase tracking-[0.2em] font-bold rounded-full">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-black ring-offset-2"
                        : "hover:ring-2 hover:ring-neutral-300 hover:ring-offset-2"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="space-y-6">
              {/* Header */}
              <div>
                {/* Category */}
                <Link
                  href={`/products?category=${product.category}`}
                  className="text-xs uppercase tracking-[0.2em] text-black/50 font-semibold hover:text-black transition-colors"
                >
                  {product.category}
                </Link>

                {/* Product Name */}
                <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-black mt-2 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                {product.rating && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-black stroke-black"
                              : "fill-neutral-200 stroke-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-black/60">
                      {product.rating} ({product.reviews || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-black/70 mt-4 leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                {product.originalPrice && (
                  <span className="text-xl text-black/40 line-through font-medium">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="font-['Playfair_Display'] text-4xl font-bold text-black">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-black uppercase tracking-wider">
                      Color
                    </label>
                    {selectedColor && (
                      <span className="text-sm text-black/60">
                        {selectedColor.name || selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full transition-all ${
                          selectedColor === color
                            ? "ring-2 ring-black ring-offset-2 scale-110"
                            : "hover:scale-105 ring-2 ring-neutral-200"
                        }`}
                        style={{ backgroundColor: color.hex || color }}
                        aria-label={`Select ${color.name || color} color`}
                      >
                        {selectedColor === color && (
                          <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-black uppercase tracking-wider">
                      Size
                    </label>
                    <button className="text-sm text-black/60 hover:text-black underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-sm font-medium rounded-xl border-2 transition-all ${
                          selectedSize === size
                            ? "bg-black text-white border-black shadow-md"
                            : "bg-white text-black border-neutral-200 hover:border-black"
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
                <label className="text-sm font-semibold text-black uppercase tracking-wider mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white border-2 border-neutral-200 rounded-xl">
                    <button
                      onClick={decrementQuantity}
                      className="p-3 hover:bg-neutral-50 transition-colors rounded-l-xl"
                    >
                      <Minus className="h-4 w-4 text-black" />
                    </button>
                    <span className="px-6 text-black font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-3 hover:bg-neutral-50 transition-colors rounded-r-xl"
                    >
                      <Plus className="h-4 w-4 text-black" />
                    </button>
                  </div>
                  {product.stockCount && (
                    <span className="text-sm text-black/60">
                      {product.stockCount} in stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-black/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Bag
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFavorite}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all flex items-center justify-center gap-2 ${
                      isFavorited
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-200 hover:border-black"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorited ? "fill-white" : ""}`}
                    />
                    Favorite
                  </button>
                  <button
                    onClick={handleShare}
                    className="py-3 rounded-xl text-sm font-medium border-2 bg-white text-black border-neutral-200 hover:border-black transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
                <div className="text-center space-y-2">
                  <div className="bg-neutral-50 rounded-full p-3 inline-flex">
                    <Truck className="h-5 w-5 text-black" />
                  </div>
                  <p className="text-xs font-medium text-black">
                    Free Shipping
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-neutral-50 rounded-full p-3 inline-flex">
                    <RotateCcw className="h-5 w-5 text-black" />
                  </div>
                  <p className="text-xs font-medium text-black">Easy Returns</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-neutral-50 rounded-full p-3 inline-flex">
                    <Shield className="h-5 w-5 text-black" />
                  </div>
                  <p className="text-xs font-medium text-black">
                    2 Year Warranty
                  </p>
                </div>
              </div>

              {/* Accordion Sections */}
              <div className="space-y-3 pt-6 border-t border-neutral-200">
                {/* Description */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60">
                  <button
                    onClick={() => toggleSection("description")}
                    className="w-full flex items-center justify-between p-5"
                  >
                    <span className="text-sm font-bold text-black uppercase tracking-wider">
                      Description
                    </span>
                    {expandedSections.description ? (
                      <ChevronUp className="h-5 w-5 text-black" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-black" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-black/70 leading-relaxed space-y-3">
                          <p>
                            {product.description || product.longDescription}
                          </p>
                          {product.features && (
                            <ul className="space-y-2 mt-4">
                              {product.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <Check className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Details */}
                {product.details && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60">
                    <button
                      onClick={() => toggleSection("details")}
                      className="w-full flex items-center justify-between p-5"
                    >
                      <span className="text-sm font-bold text-black uppercase tracking-wider">
                        Product Details
                      </span>
                      {expandedSections.details ? (
                        <ChevronUp className="h-5 w-5 text-black" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-black" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections.details && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-sm text-black/70">
                            <dl className="space-y-2">
                              {Object.entries(product.details).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between py-2 border-b border-neutral-100 last:border-0"
                                  >
                                    <dt className="font-medium text-black capitalize">
                                      {key}
                                    </dt>
                                    <dd className="text-right">{value}</dd>
                                  </div>
                                )
                              )}
                            </dl>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Shipping & Returns */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60">
                  <button
                    onClick={() => toggleSection("shipping")}
                    className="w-full flex items-center justify-between p-5"
                  >
                    <span className="text-sm font-bold text-black uppercase tracking-wider">
                      Shipping & Returns
                    </span>
                    {expandedSections.shipping ? (
                      <ChevronUp className="h-5 w-5 text-black" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-black" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.shipping && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-black/70 space-y-3">
                          <div>
                            <h4 className="font-semibold text-black mb-1">
                              Free Shipping
                            </h4>
                            <p>
                              Free standard shipping on orders over $50.
                              Delivery in 3-5 business days.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-black mb-1">
                              Easy Returns
                            </h4>
                            <p>
                              30-day return policy. Items must be unworn with
                              tags attached.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.customerReviews && product.customerReviews.length > 0 && (
          <div ref={reviewsRef} className="mt-16 lg:mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isReviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-black mb-8">
                Customer Reviews
              </h2>

              <div className="space-y-6">
                {/* Review Summary */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60 p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center md:border-r border-neutral-200">
                      <div className="text-6xl font-['Playfair_Display'] font-bold text-black mb-2">
                        {product.rating}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? "fill-black stroke-black"
                                : "fill-neutral-200 stroke-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-black/60">
                        Based on {product.reviews || 0} reviews
                      </p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = Math.floor(Math.random() * 60) + 20;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-black w-8">
                              {star}★
                            </span>
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-black transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-black/60 w-12 text-right">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {product.customerReviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60 p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-black">
                              {review.author}
                            </span>
                            {review.verified && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-black stroke-black"
                                    : "fill-neutral-200 stroke-neutral-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-black/60">
                          {review.date}
                        </span>
                      </div>
                      <h4 className="font-semibold text-black mb-2">
                        {review.title}
                      </h4>
                      <p className="text-sm text-black/70 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div ref={relatedRef} className="mt-16 lg:mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isRelatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-black mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
