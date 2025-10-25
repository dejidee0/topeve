"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";

export function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use multiple images if available, otherwise use single image
  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <div className="relative">
        {/* Image Container */}
        <Link
          href={`/product/${product.id}`}
          className="block relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImageIndex(0);
          }}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl">
            {/* Main Image */}
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
            />

            {/* Hover Overlay with Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: isHovered ? 0 : 20,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic
                    }}
                    className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
                    aria-label="Add to bag"
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Quick view logic
                    }}
                    className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
                    aria-label="Quick view"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Badge */}
            {product.badge && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full shadow-lg"
              >
                {product.badge}
              </motion.div>
            )}

            {/* Discount Badge */}
            {product.discount && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 text-xs font-bold rounded-full shadow-lg"
              >
                -{product.discount}%
              </motion.div>
            )}

            {/* Color Dots for Image Switching */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Favorite Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-md hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Add to favorites"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-300 ${
              isFavorited
                ? "fill-black stroke-black"
                : "stroke-black/70 hover:stroke-black"
            }`}
          />
        </motion.button>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 flex gap-2 z-10"
          >
            {product.colors.slice(0, 4).map((color, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  // Color selection logic
                }}
                className="w-6 h-6 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: color.hex || color }}
                aria-label={`Select ${color.name || color} color`}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Product Info */}
      <Link href={`/product/${product.id}`} className="block mt-4">
        <div className="space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/50 font-semibold">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-black leading-tight group-hover:text-black/70 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? "fill-black"
                        : "fill-neutral-200"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-black/50">
                ({product.reviews || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            {product.originalPrice && (
              <span className="text-sm text-black/40 line-through font-medium">
                ${product.originalPrice}
              </span>
            )}
            <span className="font-['Playfair_Display'] text-black text-lg font-bold">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-bold text-green-600">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Sizes Available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-black/50 uppercase tracking-wider">
                Available:
              </span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 4).map((size, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-black/60 px-1.5 py-0.5 bg-neutral-100 rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-[10px] font-medium text-black/60">
                    +{product.sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {product.inStock === false && (
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              Out of Stock
            </p>
          )}
          {product.lowStock && (
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
              Only {product.stockCount} left
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
