"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiShoppingBag3Line,
  RiFileList3Line,
  RiGroupLine,
  RiBarChartBoxLine,
  RiSettings4Line,
  RiPaletteLine,
  RiImageLine,
  RiCoupon3Line,
  RiNotification3Line,
} from "react-icons/ri";

const menuItems = [
  {
    title: "Dashboard",
    icon: RiDashboardLine,
    href: "/admin",
    badge: null,
  },
  {
    title: "Products",
    icon: RiShoppingBag3Line,
    href: "/admin/products",
    badge: null,
  },
  {
    title: "Orders",
    icon: RiFileList3Line,
    href: "/admin/orders",
    badge: "12",
  },
  {
    title: "Customers",
    icon: RiGroupLine,
    href: "/admin/customers",
    badge: null,
  },
  {
    title: "Analytics",
    icon: RiBarChartBoxLine,
    href: "/admin/analytics",
    badge: null,
  },
  {
    title: "Collections",
    icon: RiPaletteLine,
    href: "/admin/collections",
    badge: null,
  },
  {
    title: "Media",
    icon: RiImageLine,
    href: "/admin/media",
    badge: null,
  },
  {
    title: "Promotions",
    icon: RiCoupon3Line,
    href: "/admin/promotions",
    badge: null,
  },
  {
    title: "Notifications",
    icon: RiNotification3Line,
    href: "/admin/notifications",
    badge: "3",
  },
  {
    title: "Settings",
    icon: RiSettings4Line,
    href: "/admin/settings",
    badge: null,
  },
];

export default function AdminSidebar({
  desktopOpen,
  mobileOpen,
  onCloseMobile,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar - Always rendered, hidden on mobile */}
      <motion.aside
        animate={desktopOpen ? "open" : "closed"}
        variants={{
          open: { width: "256px" },
          closed: { width: "80px" },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block fixed top-0 left-0 h-screen bg-white border-r border-cream-200 overflow-hidden z-40"
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center justify-center border-b border-cream-200 px-4">
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-gold-500 flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-playfair font-bold text-xl">
                  T
                </span>
              </motion.div>
              {desktopOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col"
                >
                  <span className="font-playfair font-bold text-xl text-charcoal-900">
                    Topeve
                  </span>
                  <span className="text-xs text-taupe-600">Admin Panel</span>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-cream-300 scrollbar-track-transparent">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-to-r from-brand-50 to-gold-50 text-brand-700"
                          : "text-taupe-700 hover:bg-cream-100 hover:text-charcoal-900"
                      }`}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabDesktop"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-600 to-gold-500 rounded-r-full"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      <Icon
                        className={`text-2xl flex-shrink-0 transition-transform duration-200 ${
                          isActive
                            ? "text-brand-600"
                            : "text-taupe-500 group-hover:text-brand-600 group-hover:scale-110"
                        }`}
                      />

                      {desktopOpen && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span
                            className={`font-medium text-sm truncate ${
                              isActive ? "text-brand-700" : ""
                            }`}
                          >
                            {item.title}
                          </span>

                          {item.badge && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-600 text-white"
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </div>
                      )}

                      {!desktopOpen && item.badge && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        </div>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-cream-200 p-4">
            <div
              className={`flex items-center gap-3 ${
                desktopOpen ? "" : "justify-center"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center text-white font-semibold shadow-md">
                AD
              </div>
              {desktopOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-charcoal-900 truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-taupe-600 truncate">
                    admin@topeve.com
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar - Only rendered when open */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed top-0 left-0 h-screen w-72 bg-white border-r border-cream-200 overflow-hidden z-[110]"
          >
            <div className="flex flex-col h-full">
              {/* Logo Area */}
              <div className="h-20 flex items-center justify-center border-b border-cream-200 px-4">
                <Link href="/" className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-gold-500 flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white font-playfair font-bold text-xl">
                      T
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col"
                  >
                    <span className="font-playfair font-bold text-xl text-charcoal-900">
                      Topeve
                    </span>
                    <span className="text-xs text-taupe-600">Admin Panel</span>
                  </motion.div>
                </Link>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-cream-300 scrollbar-track-transparent">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                            isActive
                              ? "bg-gradient-to-r from-brand-50 to-gold-50 text-brand-700"
                              : "text-taupe-700 hover:bg-cream-100 hover:text-charcoal-900"
                          }`}
                        >
                          {/* Active Indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTabMobile"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-600 to-gold-500 rounded-r-full"
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}

                          <Icon
                            className={`text-2xl flex-shrink-0 transition-transform duration-200 ${
                              isActive
                                ? "text-brand-600"
                                : "text-taupe-500 group-hover:text-brand-600 group-hover:scale-110"
                            }`}
                          />

                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <span
                              className={`font-medium text-sm truncate ${
                                isActive ? "text-brand-700" : ""
                              }`}
                            >
                              {item.title}
                            </span>

                            {item.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-600 text-white"
                              >
                                {item.badge}
                              </motion.span>
                            )}
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* User Profile Section */}
              <div className="border-t border-cream-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center text-white font-semibold shadow-md">
                    AD
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-semibold text-charcoal-900 truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-taupe-600 truncate">
                      admin@topeve.com
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
