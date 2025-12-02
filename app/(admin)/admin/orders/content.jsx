"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSearchLine,
  RiEyeLine,
  RiFilterLine,
  RiDownloadLine,
  RiUserLine,
  RiShoppingBag3Line,
  RiTruckLine,
  RiCheckDoubleLine,
  RiCloseLine,
} from "react-icons/ri";
import { ordersAPI } from "@/lib/orders";
import OrderDetailsModal from "@/components/shared/admin/orders/order-details-modal";

export default function OrdersPageContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    console.log("📋 Fetching orders...");
    setLoading(true);

    const filters = {};
    if (selectedStatus !== "all") {
      filters.status = selectedStatus;
    }

    const { data, error } = await ordersAPI.getAll(filters);

    if (error) {
      console.error("❌ Error fetching orders:", error);
    } else {
      setOrders(data || []);
      console.log(`✅ Loaded ${data?.length || 0} orders`);
    }

    setLoading(false);
  };

  const fetchStats = async () => {
    const { data } = await ordersAPI.getDashboardStats();
    if (data) {
      setStats(data);
    }
  };

  const handleViewOrder = async (order) => {
    // Fetch full order details with items
    const { data } = await ordersAPI.getById(order.id);
    if (data) {
      setSelectedOrder(data);
      setIsModalOpen(true);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    console.log(`📝 Updating order ${orderId} status to ${newStatus}`);
    const { error } = await ordersAPI.updateStatus(orderId, newStatus);

    if (error) {
      console.error("❌ Error updating status:", error);
      alert("Failed to update order status");
    } else {
      console.log("✅ Status updated successfully");
      fetchOrders();
      fetchStats();
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: RiShoppingBag3Line,
      processing: RiFilterLine,
      shipped: RiTruckLine,
      delivered: RiCheckDoubleLine,
      cancelled: RiCloseLine,
    };
    const Icon = icons[status] || RiShoppingBag3Line;
    return <Icon className="text-lg" />;
  };

  const statuses = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-charcoal-900">
            Orders
          </h1>
          <p className="text-taupe-600 mt-1">
            Track and manage customer orders
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-cream-300 text-charcoal-900 rounded-xl font-medium hover:bg-cream-50 transition-all duration-200">
          <RiDownloadLine className="text-xl" />
          Export Orders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
              <RiShoppingBag3Line className="text-xl text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Total Orders</p>
              <p className="text-2xl font-bold text-charcoal-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <RiFilterLine className="text-xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <RiTruckLine className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter((o) => o.status === "shipped").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <RiCheckDoubleLine className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-taupe-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500 text-xl" />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-lg font-medium text-charcoal-900 mb-2">
              No orders found
            </p>
            <p className="text-taupe-600">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Orders will appear here once customers start purchasing"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-cream-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-charcoal-900">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-taupe-600">
                          {order.order_items?.length || 0} items
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-gold-400 flex items-center justify-center text-white font-semibold">
                          {order.customer_name ? (
                            order.customer_name.charAt(0).toUpperCase()
                          ) : (
                            <RiUserLine className="text-lg" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal-900">
                            {order.customer_name || "Anonymous"}
                          </p>
                          <p className="text-sm text-taupe-600">
                            {order.customer_email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-charcoal-900">
                        {formatDate(order.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-charcoal-900">
                        {formatPrice(order.total)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === "paid"
                            ? "bg-green-50 text-green-700"
                            : order.payment_status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {order.payment_status.charAt(0).toUpperCase() +
                          order.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-taupe-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <RiEyeLine className="text-lg" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="px-3 py-1 text-sm border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
