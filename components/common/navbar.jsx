"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [1, 0.95]);

  const categories = [
    "Ready to Wear",
    "Men",
    "Women",
    "Kids",
    "Bridal Shower",
    "Beauty & Hair",
    "Accessories",
    "Jewelry",
    "Cosmetics",
  ];

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [sidebarOpen]);

  return (
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
          <div className="relative w-full max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/60"
            />
            <input
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
              placeholder="Search luxury fashion..."
              className={`transition-all duration-300 bg-taupe/10 rounded-full pl-10 pr-4 py-2 w-full outline-none focus:ring-1 focus:ring-gold/40 ${
                searchActive ? "bg-taupe/20" : ""
              }`}
            />
          </div>
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
      <div className="hidden md:flex justify-center gap-10 py-3 border-t border-taupe/10 text-sm font-medium tracking-wide">
        {categories.map((cat) => (
          <motion.div key={cat} whileHover={{ y: -2 }}>
            <Link
              href={`/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative group"
            >
              <span className="text-charcoal/80 group-hover:text-brand transition-colors">
                {cat}
              </span>
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-px bg-gold transition-all duration-300"></span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
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
              className="fixed left-0 top-0 bottom-0 w-72 bg-cream shadow-2xl z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading text-xl text-brand">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={22} className="text-brand" />
                </button>
              </div>

              {/* Search on mobile */}
              <div className="flex items-center bg-taupe/10 rounded-full px-3 py-2 mb-6">
                <Search size={18} className="text-charcoal/60 mr-2" />
                <input
                  placeholder="Search..."
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {categories.map((cat) => (
                  <motion.div key={cat} whileHover={{ x: 5 }}>
                    <Link
                      href={`/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between py-2 text-brand hover:text-gold transition-colors border-b border-taupe/10"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {cat}
                      <ChevronRight size={16} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 border-t border-taupe/20 pt-4 space-y-3">
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-brand hover:text-gold transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <User size={18} /> My Account
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-brand hover:text-gold transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ShoppingCart size={18} /> My Cart
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
