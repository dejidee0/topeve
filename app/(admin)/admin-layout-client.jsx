"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/common/admin/sidebar";
import AdminHeader from "@/components/common/admin/navbar";

export default function AdminLayoutClient({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Changed to false

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Single Responsive Sidebar */}
      <AdminSidebar
        desktopOpen={sidebarOpen}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        {/* Page Content */}
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
