"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiUserLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
} from "react-icons/ri";
import Image from "next/image";

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onStatusUpdate,
}) {
  if (!order) return null;

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
      month: "long",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50">
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-charcoal-900">
                      Order Details
                    </h2>
                    <p className="text-sm text-taupe-600 mt-1">
                      {order.order_number}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
                  >
                    <RiCloseLine className="text-2xl text-charcoal-900" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Order Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status */}
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-sm text-taupe-600 mb-2">
                        Order Status
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-sm text-taupe-600 mb-2">
                        Payment Status
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
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
                    </div>

                    {/* Order Date */}
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-sm text-taupe-600 mb-2">Order Date</p>
                      <p className="text-sm font-medium text-charcoal-900">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="border border-cream-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                      <RiUserLine className="text-brand-600" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-taupe-600 mb-1">Name</p>
                        <p className="font-medium text-charcoal-900">
                          {order.customer_name || "Anonymous"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-taupe-600 mb-1 flex items-center gap-1">
                          <RiMailLine /> Email
                        </p>
                        <p className="font-medium text-charcoal-900">
                          {order.customer_email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-taupe-600 mb-1 flex items-center gap-1">
                          <RiPhoneLine /> Phone
                        </p>
                        <p className="font-medium text-charcoal-900">
                          {order.customer_phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="border border-cream-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                      <RiMapPinLine className="text-brand-600" />
                      Shipping Address
                    </h3>
                    <div className="space-y-1 text-charcoal-900">
                      <p>{order.shipping_address_line1}</p>
                      {order.shipping_address_line2 && (
                        <p>{order.shipping_address_line2}</p>
                      )}
                      <p>
                        {order.shipping_city}, {order.shipping_state}
                      </p>
                      <p>{order.shipping_country}</p>
                      {order.shipping_postal_code && (
                        <p>{order.shipping_postal_code}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border border-cream-200 rounded-xl overflow-hidden">
                    <div className="bg-cream-50 px-6 py-4 border-b border-cream-200">
                      <h3 className="text-lg font-semibold text-charcoal-900">
                        Order Items
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 pb-4 border-b border-cream-100 last:border-0"
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                              {item.product_image ? (
                                <Image
                                  src={item.product_image}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-taupe-400">
                                  📦
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-charcoal-900">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-taupe-600">
                                SKU: {item.product_sku}
                              </p>
                              {item.size && (
                                <p className="text-sm text-taupe-600">
                                  Size: {item.size}
                                </p>
                              )}
                              {item.color && (
                                <p className="text-sm text-taupe-600">
                                  Color: {item.color}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-taupe-600">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-semibold text-charcoal-900">
                                {formatPrice(item.total_price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-6 border-t border-cream-200 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-taupe-600">Subtotal</span>
                          <span className="font-medium text-charcoal-900">
                            {formatPrice(order.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-taupe-600">Shipping</span>
                          <span className="font-medium text-charcoal-900">
                            {formatPrice(order.shipping_fee)}
                          </span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-taupe-600">Discount</span>
                            <span className="font-medium text-green-600">
                              -{formatPrice(order.discount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-cream-200">
                          <span className="text-charcoal-900">Total</span>
                          <span className="text-brand-600">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {(order.customer_notes || order.admin_notes) && (
                    <div className="border border-cream-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                        Notes
                      </h3>
                      {order.customer_notes && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-taupe-600 mb-1">
                            Customer Notes
                          </p>
                          <p className="text-charcoal-900">
                            {order.customer_notes}
                          </p>
                        </div>
                      )}
                      {order.admin_notes && (
                        <div>
                          <p className="text-sm font-medium text-taupe-600 mb-1">
                            Admin Notes
                          </p>
                          <p className="text-charcoal-900">
                            {order.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-cream-200 bg-cream-50">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      onStatusUpdate(order.id, e.target.value);
                      onClose();
                    }}
                    className="px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-charcoal-900 text-white rounded-xl hover:bg-charcoal-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
