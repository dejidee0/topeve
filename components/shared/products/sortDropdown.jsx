// app/products/components/SortDropdown.jsx
"use client";

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm rounded-full border px-3 py-2 bg-white"
    >
      <option value="featured">Featured</option>
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="popular">Most Popular</option>
    </select>
  );
}
