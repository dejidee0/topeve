// app/products/components/SearchBar.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/utils/useDebounce";

export default function SearchBar({
  className = "",
  placeholder = "Search products...",
}) {
  const router = useRouter();
  const params = useSearchParams();
  const qParam = params.get("search") || "";
  const [value, setValue] = useState(qParam);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    // push to URL when debounced changes
    const search = debounced?.trim();
    const url = new URL(window.location.href);
    if (search) url.searchParams.set("search", search);
    else url.searchParams.delete("search");
    router.replace(url.toString());
  }, [debounced, router]);

  useEffect(() => {
    setValue(qParam);
  }, [qParam]);

  return (
    <div
      className={`flex items-center gap-3 bg-[rgb(var(--color-taupe)/0.06)] rounded-full px-3 py-2 ${className}`}
    >
      <Search size={16} className="text-charcoal/60" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-sm"
        aria-label="Search products"
      />
    </div>
  );
}
