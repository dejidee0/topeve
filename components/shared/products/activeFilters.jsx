"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

const READY_TO_WEAR_SUBCATEGORIES = [
  { name: "Women", slug: "women" },
  { name: "Men", slug: "men" },
  { name: "Kids", slug: "kids" },
  { name: "Bridal Shower", slug: "bridal-shower" },
];

export default function ActiveFilters({ filters, onChange }) {
  const hasFilters =
    filters.category ||
    filters.subcategory ||
    (filters.colors?.length ?? 0) > 0 ||
    (filters.sizes?.length ?? 0) > 0 ||
    filters.priceRange;

  if (!hasFilters) return null;

  const handleRemove = (type, value) => {
    const next = { ...filters };

    if (type === "category") {
      next.category = null;
      next.subcategory = null; // Clear subcategory when removing category
    }
    if (type === "subcategory") next.subcategory = null;
    if (type === "color") next.colors = next.colors.filter((c) => c !== value);
    if (type === "size") next.sizes = next.sizes.filter((s) => s !== value);
    if (type === "priceRange") next.priceRange = null;

    onChange(next);
  };

  const handleClearAll = () => {
    onChange({
      category: null,
      subcategory: null,
      colors: [],
      sizes: [],
      priceRange: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-taupe/5 rounded-xl border border-taupe/20"
    >
      <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wide mr-2">
        Active:
      </span>

      {/* Category */}
      {filters.category && (
        <FilterChip
          label={filters.category}
          onRemove={() => handleRemove("category")}
        />
      )}

      {/* Subcategory */}
      {filters.subcategory && (
        <FilterChip
          label={
            READY_TO_WEAR_SUBCATEGORIES.find(
              (s) => s.slug === filters.subcategory
            )?.name || filters.subcategory
          }
          onRemove={() => handleRemove("subcategory")}
        />
      )}

      {/* Color Chips */}
      {filters.colors?.map((color) => (
        <FilterChip
          key={color}
          label={color}
          onRemove={() => handleRemove("color", color)}
        />
      ))}

      {/* Size Tags */}
      {filters.sizes?.map((size) => (
        <FilterChip
          key={size}
          label={size}
          onRemove={() => handleRemove("size", size)}
        />
      ))}

      {/* Price Range */}
      {filters.priceRange && (
        <FilterChip
          label={`₦${filters.priceRange.min.toLocaleString()} - ${
            filters.priceRange.max === Infinity
              ? "∞"
              : `₦${filters.priceRange.max.toLocaleString()}`
          }`}
          onRemove={() => handleRemove("priceRange")}
        />
      )}

      {/* Clear All */}
      <button
        onClick={handleClearAll}
        className="ml-2 text-xs font-medium text-brand/70 underline hover:text-brand transition-colors"
      >
        Clear all
      </button>
    </motion.div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="flex items-center gap-1.5 bg-brand/10 text-brand px-3 py-1.5 rounded-full text-xs font-medium capitalize"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-brand/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
