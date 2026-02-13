// components/common/search-bar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, X, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useProductSearch,
  saveRecentSearch,
  getRecentSearches,
  clearRecentSearches,
} from "@/hooks/use-product-search";
import { formatPrice } from "@/utils/products";

export default function SearchBar({ className = "", onClose = null }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const router = useRouter();

  const { data: suggestions = [], isLoading } = useProductSearch(
    query,
    isFocused && query.length >= 2,
  );

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    saveRecentSearch(trimmedQuery);
    setRecentSearches(getRecentSearches());
    setQuery("");
    setIsFocused(false);

    if (onClose) onClose();

    // Route to products page with search query parameter
    router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleRecentSearchClick = (search) => {
    setQuery(search);
    handleSearch(search);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleProductClick = (product) => {
    saveRecentSearch(product.name);
    setRecentSearches(getRecentSearches());
    setQuery("");
    setIsFocused(false);

    if (onClose) onClose();

    // Route to specific product page using slug
    router.push(`/products/${product.slug}`);
  };

  const showDropdown =
    isFocused && (query.length >= 2 || recentSearches.length > 0);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search luxury fashion..."
          className="w-full pl-10 pr-10 py-2.5 bg-taupe/10 border border-taupe/20 rounded-full outline-none focus:border-brand focus:bg-cream transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/60 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cream rounded-2xl shadow-xl border border-taupe/20 overflow-hidden z-50 max-h-[500px] overflow-y-auto"
          >
            {/* Recent Searches */}
            {query.length < 2 && recentSearches.length > 0 && (
              <div className="p-4 border-b border-taupe/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-charcoal/60">
                    <Clock size={16} />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-charcoal/40 hover:text-charcoal/60 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-charcoal/80 hover:bg-taupe/10 rounded-lg transition-colors group"
                    >
                      <span>{search}</span>
                      <ArrowRight
                        size={14}
                        className="text-charcoal/30 group-hover:text-gold group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {query.length >= 2 && isLoading && (
              <div className="p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-taupe/30 border-t-gold rounded-full animate-spin" />
                <p className="text-sm text-charcoal/60 mt-2">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {query.length >= 2 && !isLoading && suggestions.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal/50 uppercase tracking-wide">
                  <TrendingUp size={14} />
                  <span>Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-taupe/10 rounded-xl transition-colors group"
                    >
                      {/* Product Image */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-taupe/10 flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                            <Search size={20} />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium text-brand line-clamp-1 group-hover:text-gold">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-charcoal/50 capitalize">
                            {product.subcategory || product.category}
                          </span>
                          <span className="text-xs font-semibold text-brand">
                            {formatPrice(product.price, product.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        size={16}
                        className="text-charcoal/20 group-hover:text-gold group-hover:translate-x-1 transition-all flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>

                {/* View All Results */}
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full mt-2 py-3 text-sm font-medium text-charcoal/70 hover:text-brand hover:bg-taupe/10 rounded-xl transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}

            {/* No Results */}
            {query.length >= 2 && !isLoading && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-taupe/10 flex items-center justify-center">
                  <Search size={24} className="text-charcoal/30" />
                </div>
                <p className="text-sm text-charcoal/60 mb-1">
                  No products found
                </p>
                <p className="text-xs text-charcoal/40">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
