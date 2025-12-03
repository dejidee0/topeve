"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Home, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import AdminSidebar from "@/components/common/admin/sidebar";
import AdminHeader from "@/components/common/admin/navbar";

export default function AdminLayoutClient({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication and fetch customer profile
  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Redirect to login if not authenticated
      if (!isAuthenticated()) {
        console.log("⚠️ [Admin] User not authenticated, redirecting to login");
        router.push("/login?redirect=/admin");
        return;
      }

      // Fetch customer profile to check role
      try {
        console.log("🔐 [Admin] Checking admin access for user:", user.id);
        const { createClient } = await import("@/supabase/client");
        const supabase = createClient();

        const { data, error } = await supabase
          .from("customers")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("❌ [Admin] Error fetching customer:", error);
          setLoading(false);
          return;
        }

        setCustomerData(data);

        // Check if user has admin role
        if (data?.role === "admin") {
          console.log("✅ [Admin] Admin access granted");
          setIsAdmin(true);
        } else {
          console.log(
            "⛔ [Admin] Access denied - user role:",
            data?.role || "none"
          );
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("❌ [Admin] Error checking admin access:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [authLoading, isAuthenticated, user, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal/70 font-medium">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // Unauthorized access - not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-taupe/20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-6"
            >
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </motion.div>

            {/* Heading */}
            <h1 className="font-heading text-3xl md:text-4xl text-brand mb-4">
              Access Denied
            </h1>

            {/* Description */}
            <p className="text-charcoal/70 text-lg mb-2">
              You don't have permission to access the admin panel.
            </p>
            <p className="text-charcoal/60 mb-8">
              This area is restricted to administrators only.
            </p>

            {/* Info Box */}
            <div className="bg-taupe/10 border border-taupe/30 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3 text-left">
                <Lock className="w-5 h-5 text-brand mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brand mb-2">
                    Why am I seeing this?
                  </h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    The admin dashboard is reserved for store administrators who
                    manage products, orders, and customer data. If you believe
                    you should have admin access, please contact your system
                    administrator.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-taupe/20 text-brand rounded-full hover:bg-taupe/30 transition-all duration-300 font-semibold"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold"
              >
                <Home size={18} />
                Return Home
              </Link>
            </div>

            {/* User Info */}
            {user?.email && (
              <p className="text-xs text-charcoal/50 mt-8">
                Logged in as: {user.email}
              </p>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </div>
    );
  }

  // Authorized - render admin layout
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
