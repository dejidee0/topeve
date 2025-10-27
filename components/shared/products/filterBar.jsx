"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

const COLORS = [
  { name: "Black", value: "black", hex: "#222222" },
  { name: "White", value: "white", hex: "#FFFFFF" },
  { name: "Beige", value: "beige", hex: "#F5F5DC" },
  { name: "Brown", value: "brown", hex: "#8B4513" },
  { name: "Navy", value: "navy", hex: "#000080" },
  { name: "Olive", value: "olive", hex: "#808000" },
  { name: "Burgundy", value: "burgundy", hex: "#800020" },
  { name: "Ivory", value: "ivory", hex: "#FFFFF0" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

const PRICE_RANGES = [
  { label: "Under ₦20,000", min: 0, max: 20000 },
  { label: "₦20,000 - ₦50,000", min: 20000, max: 50000 },
  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { label: "₦100,000 - ₦200,000", min: 100000, max: 200000 },
  { label: "Over ₦200,000", min: 200000, max: Infinity },
];

export default function FilterSidebar({
  categories,
  activeFilters,
  onChange,
  onClose,
}) {
  const [selected, setSelected] = useState(activeFilters);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    colors: true,
    sizes: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (category) => {
    const next = {
      ...selected,
      category: selected.category?.slug === category.slug ? null : category,
    };
    setSelected(next);
    onChange(next);
  };

  const toggleColor = (color) => {
    const nextColors = selected.colors?.includes(color)
      ? selected.colors.filter((c) => c !== color)
      : [...(selected.colors || []), color];
    const next = { ...selected, colors: nextColors };
    setSelected(next);
    onChange(next);
  };

  const toggleSize = (size) => {
    const nextSizes = selected.sizes?.includes(size)
      ? selected.sizes.filter((s) => s !== size)
      : [...(selected.sizes || []), size];
    const next = { ...selected, sizes: nextSizes };
    setSelected(next);
    onChange(next);
  };

  const togglePriceRange = (range) => {
    const isSameRange =
      selected.priceRange?.min === range.min &&
      selected.priceRange?.max === range.max;
    const next = {
      ...selected,
      priceRange: isSameRange ? null : range,
    };
    setSelected(next);
    onChange(next);
  };

  const clearAllFilters = () => {
    const cleared = {
      category: null,
      colors: [],
      sizes: [],
      priceRange: null,
    };
    setSelected(cleared);
    onChange(cleared);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selected.category) count++;
    if (selected.colors?.length > 0) count += selected.colors.length;
    if (selected.sizes?.length > 0) count += selected.sizes.length;
    if (selected.priceRange) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-taupe/20 p-6 space-y-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-taupe/20">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-brand" />
          <h2 className="font-heading text-xl text-brand">Filters</h2>
          {activeCount > 0 && (
            <span className="bg-gold text-brand text-xs font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-charcoal/60 hover:text-brand transition-colors"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Clear All Button */}
      {activeCount > 0 && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearAllFilters}
          className="w-full text-sm font-medium text-brand hover:text-gold transition-colors py-2 px-4 border border-brand/20 rounded-full hover:bg-brand/5"
        >
          Clear All Filters
        </motion.button>
      )}

      {/* Categories */}
      <FilterSection
        title="Categories"
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection("categories")}
      >
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <motion.li
              key={cat.slug}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => toggleCategory(cat)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  selected.category?.slug === cat.slug
                    ? "bg-brand text-cream shadow-sm"
                    : "text-charcoal/80 hover:bg-taupe/10 hover:text-brand"
                }`}
              >
                {cat.name}
              </button>
            </motion.li>
          ))}
        </ul>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <ul className="space-y-2">
          {PRICE_RANGES.map((range, idx) => {
            const isActive =
              selected.priceRange?.min === range.min &&
              selected.priceRange?.max === range.max;
            return (
              <motion.li
                key={idx}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => togglePriceRange(range)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-gold/20 text-brand font-semibold"
                      : "text-charcoal/70 hover:bg-taupe/10 hover:text-brand"
                  }`}
                >
                  {range.label}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </FilterSection>

      {/* Colors */}
      <FilterSection
        title="Colors"
        isExpanded={expandedSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((color) => {
            const isSelected = selected.colors?.includes(color.value);
            return (
              <motion.button
                key={color.value}
                onClick={() => toggleColor(color.value)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex flex-col items-center gap-1.5"
                title={color.name}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-brand ring-2 ring-gold/30 ring-offset-2"
                      : "border-taupe/30 group-hover:border-brand/50"
                  }`}
                  style={{
                    backgroundColor: color.hex,
                    boxShadow:
                      color.value === "white"
                        ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                        : "none",
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand shadow-lg" />
                    </motion.div>
                  )}
                </div>
                <span className="text-[10px] text-charcoal/60 group-hover:text-brand transition-colors">
                  {color.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection
        title="Sizes"
        isExpanded={expandedSections.sizes}
        onToggle={() => toggleSection("sizes")}
      >
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => {
            const isSelected = selected.sizes?.includes(size);
            return (
              <motion.button
                key={size}
                onClick={() => toggleSize(size)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-brand text-cream shadow-sm"
                    : "bg-taupe/10 text-charcoal/70 hover:bg-taupe/20 hover:text-brand"
                }`}
              >
                {size}
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* Active Filters Summary */}
      {activeCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-4 border-t border-taupe/20"
        >
          <h4 className="text-xs font-semibold text-charcoal/60 uppercase mb-3">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {selected.category && (
              <FilterBadge
                label={selected.category.name}
                onRemove={() => toggleCategory(selected.category)}
              />
            )}
            {selected.colors?.map((color) => (
              <FilterBadge
                key={color}
                label={color}
                onRemove={() => toggleColor(color)}
              />
            ))}
            {selected.sizes?.map((size) => (
              <FilterBadge
                key={size}
                label={size}
                onRemove={() => toggleSize(size)}
              />
            ))}
            {selected.priceRange && (
              <FilterBadge
                label={
                  PRICE_RANGES.find(
                    (r) =>
                      r.min === selected.priceRange.min &&
                      r.max === selected.priceRange.max
                  )?.label
                }
                onRemove={() => togglePriceRange(selected.priceRange)}
              />
            )}
          </div>
        </motion.div>
      )}
    </aside>
  );
}

// Filter Section Component with Collapse
function FilterSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b border-taupe/10 pb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h3 className="font-semibold text-sm uppercase tracking-wide text-charcoal/80 group-hover:text-brand transition-colors">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown
            size={18}
            className="text-charcoal/60 group-hover:text-brand transition-colors"
          />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter Badge Component
function FilterBadge({ label, onRemove }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="inline-flex items-center gap-1.5 bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium"
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-brand/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}
