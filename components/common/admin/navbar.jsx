"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  RiMenuLine,
  RiSearchLine,
  RiUser3Line,
  RiLogoutBoxLine,
  RiSettings4Line,
  RiArrowDownSLine,
} from "react-icons/ri";

export default function AdminHeader({
  sidebarOpen,
  toggleSidebar,
  toggleMobileSidebar,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 h-20 bg-white/80 backdrop-blur-xl border-b border-cream-200 z-50 transition-all duration-300">
      <div
        className={`h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2.5 rounded-xl hover:bg-cream-100 active:scale-95 transition-all"
            aria-label="Toggle mobile menu"
          >
            <RiMenuLine className="text-2xl text-charcoal-900" />
          </button>

          {/* Topeve Logo - Visible on Mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-gold-500 flex items-center justify-center shadow-md">
              <span className="text-white font-playfair font-bold text-lg">
                T
              </span>
            </div>
            <span className="font-playfair font-bold text-xl text-charcoal-900">
              Topeve
            </span>
          </Link>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2.5 rounded-xl hover:bg-cream-100 active:scale-95 transition-all"
            aria-label="Toggle sidebar"
          >
            <RiMenuLine className="text-2xl text-charcoal-900" />
          </button>

          {/* Search Bar */}
          <motion.div
            animate={{
              width: searchFocused ? "100%" : "auto",
            }}
            className="relative hidden sm:block max-w-md"
          >
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500 text-xl pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-12 pr-4 py-2.5 rounded-xl border transition-all duration-200 ${
                searchFocused
                  ? "border-brand-400 shadow-lg shadow-brand-100 bg-white"
                  : "border-cream-200 bg-cream-50 hover:bg-white"
              } focus:outline-none text-sm placeholder:text-taupe-400`}
            />
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button className="sm:hidden p-2.5 rounded-xl hover:bg-cream-100 active:scale-95 transition-all">
            <RiSearchLine className="text-xl text-charcoal-900" />
          </button>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 sm:gap-3 p-1.5 sm:pl-2 sm:pr-3 rounded-xl hover:bg-cream-100 active:scale-95 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-charcoal-900">
                  Admin User
                </p>
                <p className="text-xs text-taupe-600">Administrator</p>
              </div>
              <RiArrowDownSLine
                className={`hidden sm:block text-taupe-500 transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-cream-50 transition-colors text-left">
                        <RiUser3Line className="text-xl text-taupe-600" />
                        <span className="text-sm font-medium text-charcoal-900">
                          Profile
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-cream-50 transition-colors text-left">
                        <RiSettings4Line className="text-xl text-taupe-600" />
                        <span className="text-sm font-medium text-charcoal-900">
                          Settings
                        </span>
                      </button>
                      <div className="my-2 h-px bg-cream-200"></div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600">
                        <RiLogoutBoxLine className="text-xl" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
