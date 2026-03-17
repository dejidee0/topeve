"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiShoppingBag3Line,
  RiFileList3Line,
  RiGroupLine,
  RiLogoutBoxLine,
  RiShieldUserLine,
} from "react-icons/ri";

const menuItems = [
  { title: "Dashboard", icon: RiDashboardLine, href: "/admin" },
  { title: "Products", icon: RiShoppingBag3Line, href: "/admin/products" },
  {
    title: "Orders",
    icon: RiFileList3Line,
    href: "/admin/orders",
    badge: "12",
  },
  { title: "Customers", icon: RiGroupLine, href: "/admin/customers" },
];

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

function NavMenu({ items, pathname, onCloseMobile, showLabels }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Link
              href={item.href}
              onClick={onCloseMobile}
              title={!showLabels ? item.title : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? "bg-gradient-to-r from-brand-50 to-gold-50 text-brand-700"
                  : "text-taupe-600 hover:bg-cream-100 hover:text-charcoal-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId={`activeTab-${onCloseMobile ? "mobile" : "desktop"}`}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-brand-600 to-gold-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative flex-shrink-0">
                <Icon
                  className={`text-xl transition-all duration-200 ${
                    isActive
                      ? "text-brand-600"
                      : "text-taupe-400 group-hover:text-brand-500 group-hover:scale-110"
                  }`}
                />
                {!showLabels && item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-brand-600 rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white leading-none">
                      {item.badge}
                    </span>
                  </span>
                )}
              </div>

              {showLabels && (
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
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-600 text-white"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
              )}
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}

function UserProfile({ user, onSignOut, showLabels, router }) {
  const initials = getInitials(user);
  const displayName = getDisplayName(user);
  const email = user?.email || "";

  const handleSignOut = async () => {
    await onSignOut?.();
    router.push("/login");
  };

  return (
    <div className="border-t border-cream-200 p-3 space-y-1">
      {/* Profile row */}
      <div
        className={`flex items-center gap-3 px-2 py-2 rounded-xl ${
          showLabels ? "" : "justify-center"
        }`}
      >
        {showLabels && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-w-0"
          >
            <p className="text-sm font-semibold text-charcoal-900 truncate leading-tight">
              {displayName}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <RiShieldUserLine className="text-brand-500 text-xs flex-shrink-0" />
              <p className="text-xs text-brand-600 font-medium truncate">
                {email}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sign out button */}
      <button
        onClick={handleSignOut}
        title={!showLabels ? "Sign out" : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-red-500 group ${
          !showLabels ? "justify-center" : ""
        }`}
      >
        <RiLogoutBoxLine className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform" />
        {showLabels && <span className="text-sm font-medium">Sign out</span>}
      </button>
    </div>
  );
}

export default function AdminSidebar({
  desktopOpen,
  mobileOpen,
  onCloseMobile,
  user,
  onSignOut,
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={desktopOpen ? "open" : "closed"}
        variants={{
          open: { width: "256px" },
          closed: { width: "72px" },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex fixed top-0 left-0 h-screen bg-white border-r border-cream-200 overflow-hidden z-40 flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-cream-200 px-4 flex-shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-3 ${!desktopOpen ? "justify-center w-full" : ""}`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-gold-500 flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-playfair font-bold text-lg">
                T
              </span>
            </div>
            {desktopOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-playfair font-bold text-lg text-charcoal-900 leading-tight">
                  Topevekreation
                </span>
                <span className="text-xs text-taupe-500">Admin Panel</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 scrollbar-thin scrollbar-thumb-cream-300 scrollbar-track-transparent">
          <NavMenu
            items={menuItems}
            pathname={pathname}
            showLabels={desktopOpen}
          />
        </nav>

        {/* User profile + logout */}
        <UserProfile
          user={user}
          onSignOut={onSignOut}
          showLabels={desktopOpen}
          router={router}
        />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden fixed top-0 left-0 h-screen w-68 bg-white border-r border-cream-200 z-[110] flex flex-col"
          >
            {/* Logo */}
            <div className="h-16 flex items-center border-b border-cream-200 px-4 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-gold-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-playfair font-bold text-lg">
                    T
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-playfair font-bold text-lg text-charcoal-900 leading-tight">
                    Topevekreation
                  </span>
                  <span className="text-xs text-taupe-500">Admin Panel</span>
                </div>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2.5 scrollbar-thin scrollbar-thumb-cream-300 scrollbar-track-transparent">
              <NavMenu
                items={menuItems}
                pathname={pathname}
                onCloseMobile={onCloseMobile}
                showLabels={true}
              />
            </nav>

            {/* User profile + logout */}
            <UserProfile
              user={user}
              onSignOut={onSignOut}
              showLabels={true}
              router={router}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
