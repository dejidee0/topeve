// app/products/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchBar from "@/components/shared/products/searchBar";
import { products as mockProducts } from "@/lib/mockProducts";
import { categories as CATEGORY_LIST } from "@/lib/constants";
import SortDropdown from "@/components/shared/products/sortDropdown";
import ActiveFilters from "@/components/shared/products/activeFilters";
import FilterSidebar from "@/components/shared/products/filterBar";
import EmptyState from "@/components/shared/products/emptyState";
import ProductGrid from "@/components/shared/products/productsGrid";
import { fuzzySearch } from "@/utils/searchUtils";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL query params
  const qCategory = searchParams.get("category") || null;
  const qSearch = searchParams.get("search") || "";
  const qSort = searchParams.get("sort") || "featured";
  const qColor = searchParams.get("color") || "";
  const qSize = searchParams.get("size") || "";

  const [filters, setFilters] = useState({
    category: qCategory,
    colors: qColor ? qColor.split(",") : [],
    sizes: qSize ? qSize.split(",") : [],
  });

  const [sort, setSort] = useState(qSort);
  const [query, setQuery] = useState(qSearch);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Update URL with new filters ---
  const pushFiltersToUrl = (nextFilters) => {
    const u = new URL(window.location.href);

    if (nextFilters.category)
      u.searchParams.set("category", nextFilters.category);
    else u.searchParams.delete("category");

    if (nextFilters.colors?.length)
      u.searchParams.set("color", nextFilters.colors.join(","));
    else u.searchParams.delete("color");

    if (nextFilters.sizes?.length)
      u.searchParams.set("size", nextFilters.sizes.join(","));
    else u.searchParams.delete("size");

    router.replace(u.toString());
  };

  // --- Update URL with sort ---
  const pushSortToUrl = (value) => {
    const u = new URL(window.location.href);
    if (value) u.searchParams.set("sort", value);
    else u.searchParams.delete("sort");
    router.replace(u.toString());
  };

  // --- Handle Filter + Sort Changes ---
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    pushFiltersToUrl(newFilters);
  };

  const handleSortChange = (value) => {
    setSort(value);
    pushSortToUrl(value);
  };

  // --- Filter + Search + Sort Products ---
  const filtered = useMemo(() => {
    let list = [...mockProducts];

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters.colors?.length) {
      list = list.filter((p) => filters.colors.includes(p.color));
    }

    if (filters.sizes?.length) {
      list = list.filter((p) => p.size?.some((s) => filters.sizes.includes(s)));
    }

    if (query.trim().length) {
      list = fuzzySearch(list, query);
    }

    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sort === "popular") {
      list.sort(
        (a, b) =>
          (b.tags.includes("best-seller") ? 1 : 0) -
          (a.tags.includes("best-seller") ? 1 : 0)
      );
    }

    return list;
  }, [filters, query, sort]);

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl">Shop</h1>
          <div className="text-sm text-charcoal/70 mt-1">
            {filtered.length} results
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:block">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <button
            className="lg:hidden border rounded-full px-4 py-2 text-sm flex items-center gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span>Filters</span>
            <span
              className={`transition-transform ${
                sidebarOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>

          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters filters={filters} onChange={handleFilterChange} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block border lg:border-none rounded-lg p-4 lg:p-0 bg-white shadow-sm lg:shadow-none`}
        >
          <FilterSidebar
            categories={CATEGORY_LIST}
            activeFilters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Product Section */}
        <div className="lg:col-span-3">
          <div className="block lg:hidden mb-4">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <div className="mb-6 relative rounded-xl overflow-hidden">
            <img
              alt="Editorial"
              src="https://images.unsplash.com/photo-1495121605193-b116b5b09f10?auto=format&fit=crop&w=1600&q=80"
              className="w-full h-44 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-cream">
                <div className="text-lg font-heading">New: Bridal Capsule</div>
                <div className="text-sm">Limited pieces — shop the edit</div>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            <ProductGrid products={filtered} />
          )}

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 rounded-full border text-sm">
              Load more
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
