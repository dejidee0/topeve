// components/common/navbar.jsx
"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [readyToWearOpen, setReadyToWearOpen] = useState(false);
  const router = useRouter();

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [1, 0.95]);

  // Main navigation structure
  const mainCategories = [
    {
      name: "Ready to Wear",
      slug: "ready-to-wear",
      hasSubmenu: true,
      subcategories: [
        { name: "Women", slug: "women" },
        { name: "Men", slug: "men" },
        { name: "Kids", slug: "kids" },
        { name: "Bridal Shower", slug: "bridal-shower" },
      ],
    },
    { name: "Beauty & Hair", slug: "beauty-hair" },
    { name: "Accessories", slug: "accessories" },
    { name: "Jewelry", slug: "jewelry" },
    { name: "Cosmetics", slug: "cosmetics" },
  ];

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [sidebarOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchActive(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/products?category=${categorySlug}`);
    setSidebarOpen(false);
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    router.push(
      `/products?category=${categorySlug}&subcategory=${subcategorySlug}`
    );
    setSidebarOpen(false);
    setReadyToWearOpen(false);
  };

  return (
    <>
      <motion.nav
        style={{
          backgroundColor: `rgba(var(--color-cream-rgb), ${bgOpacity})`,
        }}
        className="fixed top-0 w-full z-50 border-b border-taupe/20 backdrop-blur-lg"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between max-w-[1400px] mx-auto px-6 py-4">
          {/* Left - Search (Desktop only) */}
          <div className="flex-1 hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/60 pointer-events-none"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchActive(true)}
                onBlur={() => setSearchActive(false)}
                placeholder="Search luxury fashion..."
                className={`transition-all duration-300 bg-taupe/10 rounded-full pl-10 pr-4 py-2 w-full outline-none focus:ring-1 focus:ring-gold/40 ${
                  searchActive ? "bg-taupe/20" : ""
                }`}
              />
            </form>
          </div>

          {/* Mobile Menu Button (Left on mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-brand hover:text-gold transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Center - Brand */}
          <Link
            href="/"
            className="font-heading text-2xl text-brand tracking-tight hover:text-gold transition-colors"
          >
            Topeve
          </Link>

          {/* Right - Icons */}
          <div className="flex justify-end items-center gap-4 md:flex-1">
            <Link
              href="/cart"
              className="text-brand hover:text-gold transition-colors relative"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-gold text-cream text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </Link>

            <Link
              href="/account"
              className="hidden md:block text-brand hover:text-gold transition-colors"
            >
              <User size={22} />
            </Link>
          </div>
        </div>

        {/* Bottom Categories (Desktop only) */}
        <div className="hidden md:flex justify-center gap-8 py-3 border-t border-taupe/10 text-sm font-medium tracking-wide">
          {mainCategories.map((cat) => (
            <div key={cat.slug} className="relative group">
              {cat.hasSubmenu ? (
                <>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="flex items-center gap-1 text-charcoal/80 hover:text-brand transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown size={14} className="mt-0.5" />
                  </button>
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-px bg-gold transition-all duration-300"></span>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-lg border border-taupe/20 p-2 min-w-[180px]">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() =>
                            handleSubcategoryClick(cat.slug, sub.slug)
                          }
                          className="w-full text-left px-4 py-2.5 text-sm text-charcoal/80 hover:bg-taupe/10 hover:text-brand rounded-lg transition-colors"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="text-charcoal/80 hover:text-brand transition-colors"
                  >
                    {cat.name}
                  </button>
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-px bg-gold transition-all duration-300"></span>
                </>
              )}
            </div>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Sidebar - MOVED OUTSIDE NAV */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-cream shadow-2xl z-[110] overflow-hidden"
            >
              {/* Sidebar Content with Scroll */}
              <div className="h-full flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading text-2xl text-brand">Menu</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-taupe/10 rounded-full transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={22} className="text-brand" />
                  </button>
                </div>

                {/* Search on mobile */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-white border border-taupe/20 rounded-full px-4 py-3 mb-6 shadow-sm"
                >
                  <Search
                    size={18}
                    className="text-charcoal/60 mr-2 flex-shrink-0"
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent w-full outline-none text-sm placeholder:text-charcoal/50"
                  />
                </form>

                {/* Categories - Scrollable */}
                <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-1">
                  {mainCategories.map((cat) => (
                    <div key={cat.slug}>
                      {cat.hasSubmenu ? (
                        <>
                          <button
                            onClick={() => setReadyToWearOpen(!readyToWearOpen)}
                            className="w-full flex items-center justify-between py-3 px-4 text-brand hover:bg-taupe/10 rounded-lg transition-colors"
                          >
                            <span className="font-medium">{cat.name}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-300 ${
                                readyToWearOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Subcategories */}
                          <AnimatePresence>
                            {readyToWearOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden pl-4 space-y-1 mb-2"
                              >
                                {cat.subcategories.map((sub) => (
                                  <button
                                    key={sub.slug}
                                    onClick={() =>
                                      handleSubcategoryClick(cat.slug, sub.slug)
                                    }
                                    className="w-full text-left py-2.5 px-4 text-sm text-charcoal/80 hover:text-brand hover:bg-taupe/10 rounded-lg transition-colors flex items-center gap-2"
                                  >
                                    <ChevronRight size={14} />
                                    {sub.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <button
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="w-full flex items-center justify-between py-3 px-4 text-brand hover:bg-taupe/10 rounded-lg transition-colors"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Links */}
                <div className="mt-6 border-t border-taupe/20 pt-4 space-y-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 py-3 px-4 text-brand hover:bg-taupe/10 rounded-lg transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <User size={18} />
                    <span className="font-medium">My Account</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 py-3 px-4 text-brand hover:bg-taupe/10 rounded-lg transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ShoppingCart size={18} />
                    <span className="font-medium">My Cart</span>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
