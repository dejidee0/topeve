"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  query,
  setQuery,
  className = "",
  placeholder = "Search products...",
}) {
  return (
    <div
      className={`flex items-center gap-3 bg-taupe/10 rounded-full px-4 py-2.5 ${className}`}
    >
      <Search size={16} className="text-charcoal/60" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-sm"
        aria-label="Search products"
      />
    </div>
  );
}
