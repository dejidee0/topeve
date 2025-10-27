"use client";

import { X } from "lucide-react";

export default function ActiveFilters({ filters, onChange }) {
  const hasFilters =
    filters.category ||
    (filters.colors?.length ?? 0) > 0 ||
    (filters.sizes?.length ?? 0) > 0;

  if (!hasFilters) return null;

  const handleRemove = (type, value) => {
    const next = { ...filters };

    if (type === "category") next.category = null;
    if (type === "color") next.colors = next.colors.filter((c) => c !== value);
    if (type === "size") next.sizes = next.sizes.filter((s) => s !== value);

    onChange(next);
  };

  const handleClearAll = () => {
    onChange({ category: null, colors: [], sizes: [] });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {filters.category && typeof filters.category === "object" ? (
        <FilterChip
          key={filters.category.slug}
          label={filters.category.name}
          onRemove={() => handleRemove("category")}
        />
      ) : (
        filters.category && (
          <FilterChip
            label={filters.category}
            onRemove={() => handleRemove("category")}
          />
        )
      )}

      {/* Color Chips */}
      {filters.colors.map((color) => (
        <ColorChip
          key={color}
          color={color}
          onRemove={() => handleRemove("color", color)}
        />
      ))}

      {/* Size Tags */}
      {filters.sizes.map((size) => (
        <SizeChip
          key={size}
          size={size}
          onRemove={() => handleRemove("size", size)}
        />
      ))}

      <button
        onClick={handleClearAll}
        className="text-xs text-brand/70 underline ml-2 hover:text-brand transition"
      >
        Clear all
      </button>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-1 bg-taupe/20 text-sm text-brand px-3 py-1 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-gold transition-colors"
        aria-label={`Remove ${label}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ColorChip({ color, onRemove }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm">
      <span
        className="w-4 h-4 rounded-full border"
        style={{ backgroundColor: color }}
      ></span>
      <span className="capitalize">{color}</span>
      <button onClick={onRemove} className="hover:text-red-500 transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function SizeChip({ size, onRemove }) {
  return (
    <div className="flex items-center gap-1 bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full">
      {size.toUpperCase()}
      <button onClick={onRemove} className="hover:text-red-500 transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
