// app/account/content.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ordersAPI } from "@/lib/orders";
import { formatPrice } from "@/utils/products";

export default function AccountPageContent() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    signOut,
    loading: authLoading,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Nigeria",
    gender: "",
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      console.log(
        "⚠️ [Account] User not authenticated, redirecting to sign in"
      );
      router.push("/auth/signin?redirect=/account");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch customer data and orders
  useEffect(() => {
    if (user?.id) {
      fetchCustomerData();
      fetchOrders();
    }
  }, [user?.id]);

  const fetchCustomerData = async () => {
    try {
      console.log("📋 [Account] Fetching customer data...");
      const { createClient } = await import("@/supabase/client");
      const supabase = createClient();

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("❌ [Account] Error fetching customer:", error);
        return;
      }

      setCustomerData(data);
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || user.email,
        phone: data.phone || "",
        address_line1: data.address_line1 || "",
        address_line2: data.address_line2 || "",
        city: data.city || "",
        state: data.state || "",
        postal_code: data.postal_code || "",
        country: data.country || "Nigeria",
        gender: data.gender || "",
      });

      console.log("✅ [Account] Customer data loaded");
    } catch (error) {
      console.error("❌ [Account] Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log("📦 [Account] Fetching orders...");
      const { data, error } = await ordersAPI.getAll({
        // Filter by customer_id if using auth
        // For now, filter by email since orders might not have customer_id
        search: user.email,
        sortBy: "created_at",
        sortOrder: "desc",
        limit: 10,
      });

      if (error) {
        console.error("❌ [Account] Error fetching orders:", error);
        return;
      }

      setOrders(data || []);
      console.log("✅ [Account] Orders loaded:", data?.length || 0);
    } catch (error) {
      console.error("❌ [Account] Error:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("💾 [Account] Saving customer data...");

      const { createClient } = await import("@/supabase/client");
      const supabase = createClient();

      const { error } = await supabase
        .from("customers")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          gender: formData.gender,
        })
        .eq("id", user.id);

      if (error) {
        console.error("❌ [Account] Error saving:", error);
        alert("Failed to save changes. Please try again.");
        return;
      }

      console.log("✅ [Account] Changes saved successfully");
      setIsEditing(false);
      fetchCustomerData();
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("❌ [Account] Error:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut();
      router.push("/");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal/70">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "address", label: "Address", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl text-brand mb-2">My Account</h1>
          <p className="text-charcoal/60">
            Welcome back, {formData.first_name || user.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-brand text-cream"
                        : "text-charcoal/70 hover:bg-taupe/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-taupe/20">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Shop Banner */}
            <div className="mt-6 bg-gradient-to-br from-gold/20 to-brand/20 rounded-2xl p-6 text-center">
              <ShoppingBag size={48} className="mx-auto text-brand mb-4" />
              <h3 className="font-heading text-xl text-brand mb-2">
                Discover More
              </h3>
              <p className="text-sm text-charcoal/70 mb-4">
                Explore our latest collection of luxury fashion
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold text-sm"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-brand">
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-brand hover:bg-brand/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchCustomerData();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-charcoal/70 hover:bg-charcoal/10 rounded-lg transition-colors"
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-cream hover:bg-gold hover:text-brand rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save size={18} />
                        <span>{saving ? "Saving..." : "Save"}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal/80 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            first_name: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal/80 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            last_name: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-taupe/30 rounded-lg bg-taupe/10 cursor-not-allowed text-charcoal/60"
                      />
                    </div>
                    <p className="text-xs text-charcoal/50 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                        placeholder="08012345678"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  {/* Account Info */}
                  <div className="pt-6 border-t border-taupe/20">
                    <h3 className="font-medium text-brand mb-4">
                      Account Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-charcoal/70">
                        <Calendar size={16} />
                        <span>
                          Member since{" "}
                          {new Date(
                            customerData?.created_at
                          ).toLocaleDateString("en-NG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {customerData?.last_order_at && (
                        <div className="flex items-center gap-2 text-charcoal/70">
                          <Package size={16} />
                          <span>
                            Last order on{" "}
                            {new Date(
                              customerData.last_order_at
                            ).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-heading text-2xl text-brand mb-6">
                  Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package
                      size={64}
                      className="mx-auto text-charcoal/30 mb-4"
                    />
                    <h3 className="font-heading text-xl text-brand mb-2">
                      No orders yet
                    </h3>
                    <p className="text-charcoal/60 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold"
                    >
                      Browse Products
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-taupe/20 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-mono text-sm font-bold text-brand">
                              {order.order_number}
                            </div>
                            <div className="text-xs text-charcoal/60 mt-1">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-NG",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-brand text-lg">
                              {formatPrice(order.total, order.currency)}
                            </div>
                            <div
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "processing"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-700"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status === "processing" &&
                                "Paid & Confirmed"}
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex items-center gap-2 mb-4">
                          <Package size={16} className="text-charcoal/60" />
                          <span className="text-sm text-charcoal/70">
                            {order.order_items?.length || 0} item(s)
                          </span>
                        </div>

                        <Link
                          href={`/order-confirmation?reference=${order.order_number}`}
                          className="inline-flex items-center gap-2 text-sm text-brand hover:text-gold transition-colors font-medium"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-brand">
                    Shipping Address
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-brand hover:bg-brand/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchCustomerData();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-charcoal/70 hover:bg-charcoal/10 rounded-lg transition-colors"
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-cream hover:bg-gold hover:text-brand rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save size={18} />
                        <span>{saving ? "Saving..." : "Save"}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address_line1}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address_line1: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                      placeholder="123 Main Street"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.address_line2}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address_line2: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                      placeholder="Apt 4B"
                    />
                  </div>

                  {/* City, State, Postal */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal/80 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal/80 mb-2">
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                      >
                        <option value="">Select State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="FCT">FCT (Abuja)</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Oyo">Oyo</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal/80 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            postal_code: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-not-allowed"
                        placeholder="100001"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      disabled
                      className="w-full px-4 py-3 border border-taupe/30 rounded-lg bg-taupe/10 cursor-not-allowed text-charcoal/60"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
