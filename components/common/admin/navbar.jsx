"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RiMenuLine,
  RiSearchLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiShieldUserLine,
  RiUserLine,
} from "react-icons/ri";

function getInitials(user) {
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return user?.email?.slice(0, 2).toUpperCase() || "AD";
}

function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Admin"
  );
}

export default function AdminHeader({
  sidebarOpen,
  toggleSidebar,
  toggleMobileSidebar,
  user,
  onSignOut,
}) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = getDisplayName(user);
  const email = user?.email || "";

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await onSignOut?.();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white/90 backdrop-blur-xl border-b border-cream-200 z-50 shadow-sm transition-all duration-300">
      <div
        className={`h-full px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-cream-100 active:scale-95 transition-all"
            aria-label="Toggle mobile menu"
          >
            <RiMenuLine className="text-xl text-charcoal-900" />
          </button>

          <Link href="/" className="lg:hidden flex items-center gap-2">
            <span className="font-playfair font-bold text-lg text-charcoal-900">
              Topevekreation
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-cream-100 active:scale-95 transition-all"
            aria-label="Toggle sidebar"
          >
            <RiMenuLine className="text-xl text-charcoal-900" />
          </button>

          {/* Search */}
          <div className="relative hidden sm:block">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe-400 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, orders..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-64 pl-10 pr-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
                searchFocused
                  ? "border-brand-400 shadow-md shadow-brand-100/50 bg-white w-80"
                  : "border-cream-200 bg-cream-50 hover:bg-white"
              } focus:outline-none placeholder:text-taupe-400`}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="sm:hidden p-2 rounded-lg hover:bg-cream-100 active:scale-95 transition-all">
            <RiSearchLine className="text-lg text-charcoal-900" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-xl hover:bg-cream-100 active:scale-95 transition-all"
            >
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-charcoal-900 leading-tight max-w-[120px] truncate">
                  {displayName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <RiShieldUserLine className="text-brand-600 text-xs" />
                  <p className="text-xs text-brand-600 font-medium">
                    Administrator
                  </p>
                </div>
              </div>
              <RiArrowDownSLine
                className={`hidden sm:block text-taupe-400 text-base transition-transform duration-200 ${
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
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden z-50"
                  >
                    {/* User info header */}
                    <div className="px-4 py-4 bg-gradient-to-br from-brand-50 to-gold-50 border-b border-cream-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                          <RiUserLine className="text-lg" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-taupe-500 truncate">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600 group"
                      >
                        <RiLogoutBoxLine className="text-lg group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Sign out</span>
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
