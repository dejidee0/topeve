"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/shared/products/searchBar";
import { products as mockProducts } from "@/lib/mockProducts";
import { categories as CATEGORY_LIST } from "@/lib/constants";
import SortDropdown from "@/components/shared/products/sortDropdown";
import ActiveFilters from "@/components/shared/products/activeFilters";
import FilterSidebar from "@/components/shared/products/filterBar";
import EmptyState from "@/components/shared/products/emptyState";
import ProductGrid from "@/components/shared/products/productsGrid";
import { fuzzySearch } from "@/utils/searchUtils";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse URL params
  const qCategory = searchParams.get("category") || null;
  const qSubcategory = searchParams.get("subcategory") || null;
  const qSearch = searchParams.get("search") || "";
  const qSort = searchParams.get("sort") || "featured";
  const qColor = searchParams.get("color") || "";
  const qSize = searchParams.get("size") || "";
  const qPriceMin = searchParams.get("priceMin") || null;
  const qPriceMax = searchParams.get("priceMax") || null;

  const [filters, setFilters] = useState({
    category: qCategory,
    subcategory: qSubcategory,
    colors: qColor ? qColor.split(",").filter(Boolean) : [],
    sizes: qSize ? qSize.split(",").filter(Boolean) : [],
    priceRange:
      qPriceMin && qPriceMax
        ? { min: Number(qPriceMin), max: Number(qPriceMax) }
        : null,
  });

  const [sort, setSort] = useState(qSort);
  const [query, setQuery] = useState(qSearch);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync filters with URL
  const pushFiltersToUrl = (nextFilters) => {
    const params = new URLSearchParams(window.location.search);

    // Category
    if (nextFilters.category) {
      params.set("category", nextFilters.category);
    } else {
      params.delete("category");
    }

    // Subcategory
    if (nextFilters.subcategory) {
      params.set("subcategory", nextFilters.subcategory);
    } else {
      params.delete("subcategory");
    }

    // Colors
    if (nextFilters.colors?.length) {
      params.set("color", nextFilters.colors.join(","));
    } else {
      params.delete("color");
    }

    // Sizes
    if (nextFilters.sizes?.length) {
      params.set("size", nextFilters.sizes.join(","));
    } else {
      params.delete("size");
    }

    // Price Range
    if (nextFilters.priceRange) {
      params.set("priceMin", nextFilters.priceRange.min.toString());
      params.set("priceMax", nextFilters.priceRange.max.toString());
    } else {
      params.delete("priceMin");
      params.delete("priceMax");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const pushSortToUrl = (value) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    pushFiltersToUrl(newFilters);
  };

  const handleSortChange = (value) => {
    setSort(value);
    pushSortToUrl(value);
  };

  // Filter, Search, and Sort Products
  const filtered = useMemo(() => {
    let list = [...mockProducts];

    // Category filter
    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    // Subcategory filter (for ready-to-wear)
    if (filters.subcategory) {
      list = list.filter((p) => p.subcategory === filters.subcategory);
    }

    // Color filter
    if (filters.colors?.length > 0) {
      list = list.filter((p) => filters.colors.includes(p.color));
    }

    // Size filter
    if (filters.sizes?.length > 0) {
      list = list.filter((p) => p.size?.some((s) => filters.sizes.includes(s)));
    }

    // Price range filter
    if (filters.priceRange) {
      list = list.filter(
        (p) =>
          p.price >= filters.priceRange.min &&
          (filters.priceRange.max === Infinity ||
            p.price <= filters.priceRange.max)
      );
    }

    // Search filter
    if (query.trim().length > 0) {
      list = fuzzySearch(list, query);
    }

    // Sort
    if (sort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      list.sort(
        (a, b) =>
          (b.tags?.includes("new") ? 1 : 0) - (a.tags?.includes("new") ? 1 : 0)
      );
    } else if (sort === "popular") {
      list.sort(
        (a, b) =>
          (b.tags?.includes("best-seller") ? 1 : 0) -
          (a.tags?.includes("best-seller") ? 1 : 0)
      );
    }

    return list;
  }, [filters, query, sort]);

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.colors?.length > 0) count += filters.colors.length;
    if (filters.sizes?.length > 0) count += filters.sizes.length;
    if (filters.priceRange) count++;
    return count;
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-brand">
            Shop All Products
          </h1>
          <p className="text-sm text-charcoal/70 mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}{" "}
            found
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden md:block flex-1 md:flex-none md:w-80">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <button
            className="lg:hidden flex items-center gap-2 border border-taupe/30 rounded-full px-4 py-2 text-sm font-medium hover:bg-taupe/10 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-gold text-brand text-xs font-bold px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters filters={filters} onChange={handleFilterChange} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <FilterSidebar
            categories={CATEGORY_LIST}
            activeFilters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
              <FilterSidebar
                categories={CATEGORY_LIST}
                activeFilters={filters}
                onChange={handleFilterChange}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Mobile Search */}
          <div className="block md:hidden mb-6">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          {/* Promotional Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
          >
            <Link href="/ready-to-wear/bridal-shower" className="block">
              <div className="relative h-56 overflow-hidden">
                <Image
                  alt="Bridal Capsule Collection"
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block px-3 py-1 bg-gold/90 backdrop-blur-sm text-brand text-[10px] font-bold uppercase tracking-wider rounded-full mb-3"
                >
                  New Arrival
                </motion.div>

                <h3 className="font-heading text-2xl md:text-3xl text-cream mb-2 transform transition-transform duration-300 group-hover:scale-105">
                  Bridal Capsule
                </h3>

                <p className="text-cream/90 text-sm mb-4 max-w-[200px]">
                  Limited pieces — shop the edit
                </p>

                <div className="inline-flex items-center gap-2 text-cream text-xs font-semibold border border-cream/30 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Products Grid or Empty State */}
          {filtered.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            <>
              <ProductGrid products={filtered} />

              {/* Load More Button (placeholder) */}
              {filtered.length >= 12 && (
                <div className="mt-12 flex justify-center">
                  <button className="px-8 py-3 rounded-full border-2 border-brand text-brand font-medium hover:bg-brand hover:text-cream transition-all duration-300">
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
