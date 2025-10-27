"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // placeholder for Zustand later
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
    // placeholder for Zustand later
  };

  return (
    <div className="group relative border border-taupe/30 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? "fill-brand text-brand" : "text-charcoal"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-base font-heading text-brand mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-charcoal/70 line-clamp-2 mb-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="font-semibold text-brand">${product.price}</div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex items-center gap-2 text-sm bg-brand text-cream px-3 py-1.5 rounded-full hover:bg-gold transition disabled:opacity-70"
          >
            <ShoppingBag className="w-4 h-4" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
