"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useAuth, useCart } from "@/store";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  hasMegaMenu?: boolean;
  highlight?: boolean;
}

interface MegaMenuItem {
  name: string;
  href: string;
}

interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuContent {
  sections: MegaMenuSection[];
}

const megaMenuItems: Record<string, MegaMenuContent> = {
  "Ready to Wear": {
    sections: [
      {
        title: "Women's Collection",
        items: [
          { name: "Dresses", href: "/shop?category=dresses" },
          { name: "Two Piece Sets", href: "/shop?category=two-piece" },
          { name: "Tops & Blouses", href: "/shop?category=tops" },
          { name: "Bottoms", href: "/shop?category=bottoms" },
          { name: "Jumpsuits", href: "/shop?category=jumpsuits" },
        ],
      },
      {
        title: "Men's Collection",
        items: [
          { name: "Agbadas", href: "/shop?category=agbadas" },
          { name: "Shirts", href: "/shop?category=mens-shirts" },
          { name: "Trousers", href: "/shop?category=mens-trousers" },
        ],
      },
      {
        title: "Special Occasions",
        items: [
          { name: "Bridal Shower", href: "/ready-to-wear/bridal-shower" },
          { name: "Traditional Wear", href: "/shop?category=traditional" },
          { name: "Kids Collection", href: "/ready-to-wear/kids" },
        ],
      },
    ],
  },
};

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const cartItemsCount = getTotalItems();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const mainNavItems: NavItem[] = [
    { name: "New Arrivals", href: "/shop?sort=newest" },
    { name: "Ready to Wear", href: "#", hasMegaMenu: true },
    { name: "Beauty & Hair", href: "/beauty-hair" },
    { name: "Accessories", href: "/accessories" },
    { name: "Jewelry", href: "/jewelry" },
    { name: "Cosmetics", href: "/cosmetics" },
    { name: "Sale", href: "/sale", highlight: true },
  ];

  const popularSearchTerms: string[] = [
    "Ankara",
    "Dresses",
    "Agbada",
    "Wedding",
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white border-b border-gray-200"
        }`}
      >
        {/* Top Bar - Desktop Only */}
        <div className="hidden lg:block bg-black text-white py-2">
          <div className="container">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider">
              <div className="flex items-center gap-6">
                <span>Free Shipping on Orders Over $100</span>
                <span className="text-gray-400">|</span>
                <span>Premium African Fashion</span>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href="/track-order"
                  className="hover:text-gray-300 transition-colors"
                >
                  Track Order
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  href="/help"
                  className="hover:text-gray-300 transition-colors"
                >
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              TopeveCreation
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {mainNavItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasMegaMenu && setActiveMegaMenu(item.name)
                  }
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  {item.hasMegaMenu ? (
                    <button
                      className={`text-sm font-medium uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        item.highlight
                          ? "text-red-600 hover:text-red-700"
                          : "hover:text-gray-600"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                        item.highlight
                          ? "text-red-600 hover:text-red-700"
                          : "hover:text-gray-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href={isAuthenticated ? "/account" : "/sign-in"}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu - Desktop */}
        <AnimatePresence>
          {activeMegaMenu === "Ready to Wear" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl"
              onMouseEnter={() => setActiveMegaMenu("Ready to Wear")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="container py-12">
                <div className="grid grid-cols-3 gap-12">
                  {megaMenuItems["Ready to Wear"].sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="font-['Playfair_Display'] text-lg font-bold mb-4 pb-2 border-b border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="text-gray-600 hover:text-black transition-colors text-sm"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 bg-white overflow-hidden"
            >
              <div className="container py-6">
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      }
                      placeholder="Search for products, categories, or brands..."
                      className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-full focus:outline-none focus:border-black transition-colors text-base"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Popular:</span>
                    {popularSearchTerms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          window.location.href = `/shop?search=${encodeURIComponent(
                            term
                          )}`;
                        }}
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-['Playfair_Display'] text-2xl font-bold">
                    Menu
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/sign-in"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-black text-white hover:bg-gray-800">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      My Account
                    </Button>
                  </Link>
                )}
              </div>

              <nav className="p-6">
                <ul className="space-y-1">
                  {mainNavItems.map((item) => (
                    <li key={item.name}>
                      {item.hasMegaMenu ? (
                        <div>
                          <button
                            onClick={() =>
                              setActiveMegaMenu(
                                activeMegaMenu === item.name ? null : item.name
                              )
                            }
                            className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                activeMegaMenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeMegaMenu === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-4">
                                  {megaMenuItems["Ready to Wear"].sections.map(
                                    (section) => (
                                      <div key={section.title}>
                                        <h4 className="font-semibold text-sm mb-2 px-4">
                                          {section.title}
                                        </h4>
                                        <ul className="space-y-1">
                                          {section.items.map((subItem) => (
                                            <li key={subItem.name}>
                                              <Link
                                                href={subItem.href}
                                                className="block py-2 px-4 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                                onClick={() =>
                                                  setMobileMenuOpen(false)
                                                }
                                              >
                                                {subItem.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors font-medium ${
                            item.highlight ? "text-red-600" : ""
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-6 border-t border-gray-200 space-y-4">
                <Link
                  href="/track-order"
                  className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  href="/help"
                  className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help & Support
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 lg:h-[88px]" />
    </>
  );
}
