"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import { Button } from "@/components/common/ui/button";
import {
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProductsClient({ PRODUCTS }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Accordion states for mobile
  const [openAccordions, setOpenAccordions] = useState({
    categories: true,
    price: true,
    sizes: true,
    colors: true,
  });

  // Extract unique values with useMemo for performance
  const categories = useMemo(
    () => ["All", ...new Set(PRODUCTS.map((p) => p.category))],
    [PRODUCTS]
  );

  const sizes = useMemo(
    () => [...new Set(PRODUCTS.flatMap((p) => p.sizes || []))].sort(),
    [PRODUCTS]
  );

  const colors = useMemo(
    () => [...new Set(PRODUCTS.flatMap((p) => p.colors || []))],
    [PRODUCTS]
  );

  const maxPrice = useMemo(
    () => Math.max(...PRODUCTS.map((p) => p.price)),
    [PRODUCTS]
  );

  // Advanced filtering and sorting with useMemo
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSize =
        selectedSizes.length === 0 ||
        (product.sizes &&
          product.sizes.some((size) => selectedSizes.includes(size)));
      const matchesColor =
        selectedColors.length === 0 ||
        (product.colors &&
          product.colors.some((color) => selectedColors.includes(color)));

      return matchesCategory && matchesPrice && matchesSize && matchesColor;
    }).sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      if (sortOrder === "price-desc") return b.price - a.price;
      if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
      if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });
  }, [
    PRODUCTS,
    categoryFilter,
    priceRange,
    selectedSizes,
    selectedColors,
    sortOrder,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [categoryFilter, priceRange, selectedSizes, selectedColors, sortOrder]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Scroll to top on page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle handlers
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, maxPrice]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (categoryFilter !== "all" ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-neutral-50 via-white to-neutral-50 min-h-screen"
      aria-label="Products Section"
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1600px] py-4">
          <nav className="flex items-center gap-2 text-sm text-black/50">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-black font-medium">Products</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1600px] py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* SIDEBAR FILTERS - Desktop Sticky */}
          <aside className="hidden lg:block lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-4 scrollbar-thin">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 p-6 shadow-sm space-y-8">
              {/* Active Filters Count */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                  <span className="text-sm font-semibold text-black">
                    {activeFiltersCount}{" "}
                    {activeFiltersCount === 1 ? "Filter" : "Filters"} Active
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-black/60 hover:text-black underline underline-offset-2 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-[0.15em]">
                  Categories
                </h3>
                <div className="space-y-1.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category.toLowerCase())}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                        categoryFilter === category.toLowerCase()
                          ? "bg-black text-white font-medium shadow-sm"
                          : "text-black/70 hover:bg-neutral-50 hover:text-black"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-6 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-[0.15em]">
                  Price
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm bg-neutral-50 rounded-lg px-3 py-2">
                    <span className="text-black/60">${priceRange[0]}</span>
                    <span className="text-black font-semibold">
                      ${priceRange[1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-black 
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="pt-6 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-[0.15em]">
                    Size
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                          selectedSizes.includes(size)
                            ? "bg-black text-white border-black shadow-sm scale-105"
                            : "bg-white text-black border-neutral-200 hover:border-black/40 hover:bg-neutral-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div className="pt-6 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-[0.15em]">
                    Color
                  </h3>
                  <div className="space-y-1.5">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                          selectedColors.includes(color)
                            ? "bg-black text-white font-medium shadow-sm"
                            : "text-black/70 hover:bg-neutral-50 hover:text-black"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {/* Header & Sort Bar */}
            <div className="mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60 p-6 lg:p-8 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 leading-tight">
                      All Products
                    </h1>
                    <p className="text-sm text-black/50">
                      Showing {indexOfFirstProduct + 1}-
                      {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "Result" : "Results"}
                    </p>
                  </div>

                  {/* Sort & Items Per Page */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Items Per Page */}
                    <div className="relative">
                      <select
                        value={productsPerPage}
                        onChange={(e) => {
                          setProductsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-auto appearance-none px-4 py-3 pr-10 bg-white border-2 border-neutral-200 text-black text-sm font-medium rounded-xl cursor-pointer hover:border-black/40 transition-colors focus:outline-none focus:border-black shadow-sm"
                      >
                        <option value="12">12 per page</option>
                        <option value="24">24 per page</option>
                        <option value="36">36 per page</option>
                        <option value="48">48 per page</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-black/60" />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full sm:w-[220px] appearance-none px-4 py-3 pr-10 bg-white border-2 border-neutral-200 text-black text-sm font-medium rounded-xl cursor-pointer hover:border-black/40 transition-colors focus:outline-none focus:border-black shadow-sm"
                      >
                        <option value="default">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                        <option value="name-desc">Name: Z-A</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-black/60" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Filters Toggle */}
              <div className="lg:hidden mb-6">
                <MobileFilters
                  categories={categories}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  maxPrice={maxPrice}
                  sizes={sizes}
                  selectedSizes={selectedSizes}
                  toggleSize={toggleSize}
                  colors={colors}
                  selectedColors={selectedColors}
                  toggleColor={toggleColor}
                  activeFiltersCount={activeFiltersCount}
                  clearAllFilters={clearAllFilters}
                  openAccordions={openAccordions}
                  toggleAccordion={toggleAccordion}
                  filteredProducts={filteredProducts}
                />
              </div>
            </div>

            {/* Product Grid */}
            {currentProducts.length > 0 ? (
              <>
                <motion.div
                  key={currentPage}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 mb-12"
                >
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="group"
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                          currentPage === 1
                            ? "bg-neutral-100 text-black/30 cursor-not-allowed"
                            : "bg-white border-2 border-neutral-200 text-black hover:border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-2">
                        {getPageNumbers().map((pageNum, idx) =>
                          pageNum === "..." ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-2 text-black/40"
                            >
                              •••
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
                                currentPage === pageNum
                                  ? "bg-black text-white shadow-md"
                                  : "bg-white border-2 border-neutral-200 text-black hover:border-black/40 hover:bg-neutral-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        )}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                          currentPage === totalPages
                            ? "bg-neutral-100 text-black/30 cursor-not-allowed"
                            : "bg-white border-2 border-neutral-200 text-black hover:border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Page Info */}
                    <div className="text-center mt-4 text-sm text-black/50">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200/60 p-16 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="h-8 w-8 text-black/30" />
                  </div>
                  <h2 className="font-['Playfair_Display'] text-3xl font-bold text-black/40 mb-3">
                    No Products Found
                  </h2>
                  <p className="text-black/50 mb-6 leading-relaxed">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-black text-white text-sm font-medium uppercase tracking-wider rounded-full hover:bg-black/90 transition-colors shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </section>
  );
}

// Mobile Filters Component (same as before)
function MobileFilters({
  categories,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  maxPrice,
  sizes,
  selectedSizes,
  toggleSize,
  colors,
  selectedColors,
  toggleColor,
  activeFiltersCount,
  clearAllFilters,
  openAccordions,
  toggleAccordion,
  filteredProducts,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-black/80 text-black text-sm font-semibold uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        <span>Filter & Sort</span>
        {activeFiltersCount > 0 && (
          <span className="bg-black text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-sm">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-gradient-to-b from-neutral-50 to-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-lg font-bold text-black uppercase tracking-[0.15em]">
                  Filters
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Categories */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 p-5 shadow-sm">
                  <button
                    onClick={() => toggleAccordion("categories")}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="text-sm font-bold text-black uppercase tracking-[0.15em]">
                      Categories
                    </h3>
                    {openAccordions.categories ? (
                      <ChevronUp className="h-5 w-5 text-black/60" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-black/60" />
                    )}
                  </button>
                  {openAccordions.categories && (
                    <div className="space-y-1.5">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() =>
                            setCategoryFilter(category.toLowerCase())
                          }
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                            categoryFilter === category.toLowerCase()
                              ? "bg-black text-white font-medium shadow-sm"
                              : "text-black/70 hover:bg-neutral-50 hover:text-black"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 p-5 shadow-sm">
                  <button
                    onClick={() => toggleAccordion("price")}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <h3 className="text-sm font-bold text-black uppercase tracking-[0.15em]">
                      Price
                    </h3>
                    {openAccordions.price ? (
                      <ChevronUp className="h-5 w-5 text-black/60" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-black/60" />
                    )}
                  </button>
                  {openAccordions.price && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm bg-neutral-50 rounded-lg px-3 py-2">
                        <span className="text-black/60">${priceRange[0]}</span>
                        <span className="text-black font-semibold">
                          ${priceRange[1]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Sizes */}
                {sizes.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 p-5 shadow-sm">
                    <button
                      onClick={() => toggleAccordion("sizes")}
                      className="w-full flex items-center justify-between mb-4"
                    >
                      <h3 className="text-sm font-bold text-black uppercase tracking-[0.15em]">
                        Size
                      </h3>
                      {openAccordions.sizes ? (
                        <ChevronUp className="h-5 w-5 text-black/60" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-black/60" />
                      )}
                    </button>
                    {openAccordions.sizes && (
                      <div className="grid grid-cols-3 gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                              selectedSizes.includes(size)
                                ? "bg-black text-white border-black shadow-sm"
                                : "bg-white text-black border-neutral-200 hover:border-black/40"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Colors */}
                {colors.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 p-5 shadow-sm">
                    <button
                      onClick={() => toggleAccordion("colors")}
                      className="w-full flex items-center justify-between mb-4"
                    >
                      <h3 className="text-sm font-bold text-black uppercase tracking-[0.15em]">
                        Color
                      </h3>
                      {openAccordions.colors ? (
                        <ChevronUp className="h-5 w-5 text-black/60" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-black/60" />
                      )}
                    </button>
                    {openAccordions.colors && (
                      <div className="space-y-1.5">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => toggleColor(color)}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              selectedColors.includes(color)
                                ? "bg-black text-white font-medium shadow-sm"
                                : "text-black/70 hover:bg-neutral-50 hover:text-black"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-6 space-y-3 shadow-lg">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-3 text-sm font-medium text-black/60 hover:text-black transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-black text-white text-sm font-semibold uppercase tracking-wider rounded-xl hover:bg-black/90 transition-colors shadow-md"
                >
                  View Results ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
