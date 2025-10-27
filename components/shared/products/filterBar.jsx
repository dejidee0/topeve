"use client";

import { useState } from "react";

export default function FilterSidebar({ categories, activeFilters, onChange }) {
  const [selected, setSelected] = useState(activeFilters);

  const toggleCategory = (category) => {
    const next = {
      ...selected,
      category: selected.category?.slug === category.slug ? null : category,
    };
    setSelected(next);
    onChange(next);
  };

  const toggleColor = (color) => {
    const nextColors = selected.colors.includes(color)
      ? selected.colors.filter((c) => c !== color)
      : [...selected.colors, color];
    const next = { ...selected, colors: nextColors };
    setSelected(next);
    onChange(next);
  };

  const toggleSize = (size) => {
    const nextSizes = selected.sizes.includes(size)
      ? selected.sizes.filter((s) => s !== size)
      : [...selected.sizes, size];
    const next = { ...selected, sizes: nextSizes };
    setSelected(next);
    onChange(next);
  };

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-2 text-sm uppercase text-charcoal/80">
          Categories
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => toggleCategory(cat)}
                className={`w-full text-left px-2 py-1 rounded-md text-sm ${
                  selected.category?.slug === cat.slug
                    ? "bg-brand text-white"
                    : "hover:bg-taupe/10"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-2 text-sm uppercase text-charcoal/80">
          Colors
        </h3>
        <div className="flex flex-wrap gap-2">
          {["red", "blue", "black", "white", "beige", "green"].map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`w-6 h-6 rounded-full border ${
                selected.colors.includes(color)
                  ? "ring-2 ring-brand ring-offset-1"
                  : "hover:opacity-80"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-semibold mb-2 text-sm uppercase text-charcoal/80">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 rounded-full border text-xs font-medium ${
                selected.sizes.includes(size)
                  ? "bg-brand text-white"
                  : "hover:bg-taupe/10"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
