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
  Search as SearchIcon,
  ShoppingCart,
  User,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Package,
  UserCircle2,
  Users,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import SearchBar from "./search-bar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [readyToWearOpen, setReadyToWearOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = getTotalItems();

  const { user, isAuthenticated, signOut } = useAuthStore();
  const isUserAuthenticated = isAuthenticated();

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [1, 0.95]);

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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (sidebarOpen || mobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [sidebarOpen, mobileSearchOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (accountMenuOpen) setAccountMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [accountMenuOpen]);

  const handleCategoryClick = (categorySlug) => {
    router.replace(`/products?category=${categorySlug}`);
    setSidebarOpen(false);
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    router.push(
      `/products?category=${categorySlug}&subcategory=${subcategorySlug}`,
    );
    setSidebarOpen(false);
    setReadyToWearOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setAccountMenuOpen(false);
    router.push("/");
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    const firstName = user.user_metadata?.first_name;
    if (firstName) return firstName;
    const email = user.email || "";
    return email.split("@")[0];
  };

  return (
    <>
      <motion.nav
        style={{
          backgroundColor: `rgba(var(--color-cream-rgb), ${bgOpacity})`,
        }}
        className="fixed top-0 w-full z-50 border-b border-taupe/20 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between max-w-[1400px] mx-auto px-6 py-4">
          {/* Left - Search (Desktop only) */}
          <div className="flex-1 hidden md:flex items-center">
            <SearchBar className="w-full max-w-md" />
          </div>

          {/* Mobile Menu & Search Buttons */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-brand hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="text-brand hover:text-gold transition-colors"
              aria-label="Search"
            >
              <SearchIcon size={22} />
            </button>
          </div>

          {/* Center - Brand */}
          <Link
            href="/"
            className="font-heading text-2xl text-brand tracking-tight hover:text-gold transition-colors"
          >
            TopeveKreation
          </Link>

          {/* Right - Icons */}
          <div className="flex justify-end items-center gap-4 md:flex-1">
            <button
              onClick={openCart}
              className="relative text-brand hover:text-gold transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingCart size={22} />
              {isClient && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-brand text-cream text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </button>

            {isClient && isUserAuthenticated ? (
              <div className="hidden md:block relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAccountMenuOpen(!accountMenuOpen);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 hover:bg-brand/15 transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-brand text-cream flex items-center justify-center text-sm font-semibold">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-brand max-w-[100px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-brand transition-transform ${
                      accountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-cream rounded-xl shadow-lg border border-taupe/20 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-taupe/20 bg-taupe/10">
                        <div className="text-xs text-charcoal/60 mb-1">
                          Signed in as
                        </div>
                        <div className="text-sm font-semibold text-brand truncate">
                          {user?.email}
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/my-account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal/80 hover:bg-taupe/10 hover:text-brand transition-colors"
                        >
                          <UserCircle2 size={18} />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/my-account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal/80 hover:bg-taupe/10 hover:text-brand transition-colors"
                        >
                          <Package size={18} />
                          <span>My Orders</span>
                        </Link>
                      </div>

                      <div className="border-t border-taupe/20 py-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-cream hover:bg-gold hover:text-brand transition-colors text-sm font-semibold"
              >
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Categories (Desktop only) */}
        <div className="hidden md:flex justify-center gap-8 py-3 border-t border-taupe/10 text-sm font-medium">
          <div className="relative group">
            <Link
              href="/products"
              className="text-charcoal/70 hover:text-brand transition-colors font-semibold"
            >
              Shop All
            </Link>
            <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-px bg-gold transition-all duration-300"></span>
          </div>
          {mainCategories.map((cat) => (
            <div key={cat.slug} className="relative group">
              {cat.hasSubmenu ? (
                <>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="flex items-center gap-1 text-charcoal/70 hover:text-brand transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown size={14} className="mt-0.5" />
                  </button>
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-px bg-gold transition-all duration-300"></span>

                  <div className="absolute top-full left-0 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                    <div className="bg-cream rounded-xl shadow-lg border border-taupe/20 p-2 min-w-[180px]">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() =>
                            handleSubcategoryClick(cat.slug, sub.slug)
                          }
                          className="w-full text-left px-4 py-2.5 text-sm text-charcoal/70 hover:bg-taupe/10 hover:text-brand rounded-lg transition-colors"
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
                    className="text-charcoal/70 hover:text-brand transition-colors"
                  >
                    {cat.name}
                  </button>
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-px bg-gold transition-all duration-300"></span>
                </>
              )}
            </div>
          ))}
          <Link href="/about-us">
            <span className="text-charcoal/70 hover:text-brand transition-colors">
              About Us
            </span>
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSearchOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 bg-cream shadow-lg z-[110] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="text-charcoal/60 hover:text-brand transition-colors"
                >
                  <X size={24} />
                </button>
                <span className="font-medium text-brand">Search</span>
              </div>
              <SearchBar onClose={() => setMobileSearchOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-cream shadow-2xl z-[110] overflow-hidden"
            >
              <div className="h-full flex flex-col p-6">
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

                {isClient && isUserAuthenticated && (
                  <div className="mb-6 p-4 bg-white rounded-xl border border-taupe/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-brand text-cream flex items-center justify-center text-lg font-semibold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-brand truncate">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-charcoal/60 truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/my-account"
                      onClick={() => setSidebarOpen(false)}
                      className="block w-full py-2 text-center text-sm font-medium text-brand hover:text-gold transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-1">
                  <Link
                    href="/products"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full flex items-center justify-between py-3 px-4 text-brand bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors"
                  >
                    <span className="font-semibold">Shop All</span>
                    <ChevronRight size={16} />
                  </Link>
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
                                    className="w-full text-left py-2.5 px-4 text-sm text-charcoal/70 hover:text-brand hover:bg-taupe/10 rounded-lg transition-colors flex items-center gap-2"
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

                <div className="mt-6 border-t border-taupe/20 pt-4 space-y-2">
                  {isClient && !isUserAuthenticated && (
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-brand text-cream rounded-lg hover:bg-gold hover:text-brand transition-colors font-semibold"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <User size={18} />
                      <span>Sign In</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      openCart();
                    }}
                    className="w-full flex items-center justify-between py-3 px-4 text-brand hover:bg-taupe/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={18} />
                      <span className="font-medium">My Cart</span>
                    </div>
                    {isClient && totalItems > 0 && (
                      <span className="bg-brand text-cream text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {totalItems > 9 ? "9+" : totalItems}
                      </span>
                    )}
                  </button>

                  <Link href="/about-us">
                    <button className="w-full flex items-center justify-between py-3 px-4 text-brand hover:bg-taupe/10 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Users size={18} />
                        <span className="font-medium">About Us</span>
                      </div>
                    </button>
                  </Link>

                  {isClient && isUserAuthenticated && (
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
