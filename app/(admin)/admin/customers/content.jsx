"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSearchLine,
  RiEyeLine,
  RiFilterLine,
  RiDownloadLine,
  RiUserLine,
  RiMapPinLine,
  RiShoppingBag3Line,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiMailLine,
  RiPhoneLine,
} from "react-icons/ri";
import { customersAPI } from "@/lib/customers";
import CustomerDetailsModal from "@/components/shared/admin/customers/customer-details-modal";

export default function CustomersPageContent() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchCustomers = async () => {
    console.log("👥 Fetching customers...");
    setLoading(true);

    const { data, error } = await customersAPI.getAll();

    if (error) {
      console.error("❌ Error fetching customers:", error);
    } else {
      setCustomers(data || []);
      console.log(`✅ Loaded ${data?.length || 0} customers`);
    }

    setLoading(false);
  };

  const fetchStats = async () => {
    const { data } = await customersAPI.getStats();
    if (data) {
      setStats(data);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [customersResult, statsResult] = await Promise.all([
          customersAPI.getAll(),
          customersAPI.getStats(),
        ]);

        // Handle customers
        if (customersResult.error) {
          console.error("Error fetching customers:", customersResult.error);
        } else {
          setCustomers(customersResult.data || []);
        }

        // Handle stats
        if (statsResult.data) {
          setStats(statsResult.data);
        }
      } catch (err) {
        console.error("Unexpected error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewCustomer = async (customer) => {
    console.log("👁️ Viewing customer:", customer.id);
    const { data } = await customersAPI.getById(customer.id);
    if (data) {
      setSelectedCustomer(data);
      setIsModalOpen(true);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${customer.first_name || ""} ${
      customer.last_name || ""
    }`.toLowerCase();
    const email = customer.email?.toLowerCase() || "";

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      customer.phone?.includes(searchQuery)
    );
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCustomerInitials = (customer) => {
    const firstInitial = customer.first_name?.charAt(0) || "";
    const lastInitial = customer.last_name?.charAt(0) || "";
    return (firstInitial + lastInitial).toUpperCase() || "??";
  };

  const getCustomerName = (customer) => {
    const firstName = customer.first_name || "";
    const lastName = customer.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "No Name";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-charcoal-900">
            Registered Customers
          </h1>
          <p className="text-taupe-600 mt-1">
            Manage customer information and track activity
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-cream-300 text-charcoal-900 rounded-xl font-medium hover:bg-cream-50 transition-all duration-200">
          <RiDownloadLine className="text-xl" />
          Export Customers
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
              <RiUserLine className="text-xl text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Total Customers</p>
              <p className="text-2xl font-bold text-charcoal-900">
                {stats?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <RiUserLine className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">New (30 Days)</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.new || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <RiShoppingBag3Line className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Active Customers</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.active || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <RiUserLine className="text-xl text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Inactive</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.inactive || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500 text-xl" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl border transition-all ${
              showFilters
                ? "bg-brand-50 border-brand-300 text-brand-700"
                : "border-cream-200 text-taupe-700 hover:bg-cream-50"
            }`}
          >
            <RiFilterLine className="text-xl" />
          </button>
        </div>

        {/* Advanced Filters (Collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-cream-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Customer Status
                  </label>
                  <select className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400">
                    <option value="all">All Customers</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Location
                  </label>
                  <select className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400">
                    <option value="all">All Locations</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="port-harcourt">Port Harcourt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most-orders">Most Orders</option>
                    <option value="highest-spending">Highest Spending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-lg font-medium text-charcoal-900 mb-2">
              No customers found
            </p>
            <p className="text-taupe-600">
              {searchQuery
                ? "Try adjusting your search"
                : "Customers will appear here once they make purchases"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Last Order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredCustomers.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-cream-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-gold-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {getCustomerInitials(customer)}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal-900">
                            {getCustomerName(customer)}
                          </p>
                          <p className="text-sm text-taupe-600">
                            Joined {formatDate(customer.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-charcoal-900 flex items-center gap-2">
                          <RiMailLine className="text-taupe-500" />
                          {customer.email || "No email"}
                        </p>
                        {customer.phone && (
                          <p className="text-sm text-taupe-600 flex items-center gap-2">
                            <RiPhoneLine className="text-taupe-500" />
                            {customer.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <RiMapPinLine className="text-taupe-500 mt-0.5 flex-shrink-0" />
                        <div>
                          {customer.city && customer.state ? (
                            <>
                              <p className="text-sm text-charcoal-900">
                                {customer.city}
                              </p>
                              <p className="text-sm text-taupe-600">
                                {customer.state}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-taupe-600">
                              No location
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RiShoppingBag3Line className="text-taupe-500" />
                        <span className="text-sm font-semibold text-charcoal-900">
                          {customer.total_orders}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RiMoneyDollarCircleLine className="text-brand-500" />
                        <span className="text-sm font-semibold text-charcoal-900">
                          {formatPrice(customer.total_spent)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RiCalendarLine className="text-taupe-500" />
                        <span className="text-sm text-charcoal-900">
                          {formatDate(customer.last_order)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}
