// app/order-confirmation/content.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { ordersAPI } from "@/utils/orders";
import { formatPrice } from "@/utils/products";

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const hasError = searchParams.get("error");

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("🔍 [OrderConfirmation] Component mounted");
  console.log("📋 [OrderConfirmation] Reference:", reference);
  console.log("⚠️ [OrderConfirmation] Has Error:", hasError);

  useEffect(() => {
    console.log("🔄 [OrderConfirmation] useEffect triggered");

    if (!reference) {
      console.warn(
        "⚠️ [OrderConfirmation] No reference found, redirecting to home"
      );
      router.push("/");
      return;
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        console.log(
          "🔎 [OrderConfirmation] Fetching order details for:",
          reference
        );
        setLoading(true);

        const { data, error: fetchError } = await ordersAPI.getByOrderNumber(
          reference
        );

        console.log("📦 [OrderConfirmation] Order data received:", data);
        console.log("❌ [OrderConfirmation] Fetch error:", fetchError);

        if (fetchError) {
          console.error(
            "❌ [OrderConfirmation] Error fetching order:",
            fetchError
          );
          setError(
            "Unable to load order details. Please check your email for confirmation."
          );
          setLoading(false);
          return;
        }

        if (!data) {
          console.warn("⚠️ [OrderConfirmation] No order data found");
          setError(
            "Order not found. Please check your email for confirmation."
          );
          setLoading(false);
          return;
        }

        console.log("✅ [OrderConfirmation] Order loaded successfully:", {
          orderNumber: data.order_number,
          total: data.total,
          itemCount: data.order_items?.length,
        });

        setOrderData(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ [OrderConfirmation] Unexpected error:", err);
        setError(
          "An unexpected error occurred. Please check your email for confirmation."
        );
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [reference, router]);

  // Loading state
  if (loading) {
    console.log("⏳ [OrderConfirmation] Rendering loading state");
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-brand animate-spin mb-4" />
            <p className="text-charcoal/70">Loading your order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || hasError) {
    console.log("❌ [OrderConfirmation] Rendering error state:", error);
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={48} className="text-orange-600" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-brand mb-4">
              Payment Successful
            </h1>
            <p className="text-charcoal/70 text-lg mb-8">
              {error ||
                "Your payment was processed, but we encountered an issue loading your order details."}
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
              <div className="text-sm text-charcoal/60 mb-2">
                Order Reference
              </div>
              <div className="font-mono text-2xl font-bold text-brand">
                {reference}
              </div>
              <p className="text-sm text-charcoal/60 mt-4">
                Please save this reference number. A confirmation email has been
                sent to you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success state with order details
  console.log("✅ [OrderConfirmation] Rendering success state with order data");

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-green-600" />
          </motion.div>

          {/* Success Message */}
          <h1 className="font-heading text-4xl md:text-5xl text-brand mb-4">
            Order Confirmed!
          </h1>
          <p className="text-charcoal/70 text-lg mb-8">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          {/* Order Reference */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="text-sm text-charcoal/60 mb-2">Order Number</div>
            <div className="font-mono text-2xl font-bold text-brand mb-4">
              {orderData.order_number}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-charcoal/60">Total Amount:</span>
                <div className="font-semibold text-brand">
                  {formatPrice(orderData.total, orderData.currency)}
                </div>
              </div>
              <div>
                <span className="text-charcoal/60">Payment Status:</span>
                <div className="font-semibold text-green-600 capitalize">
                  {orderData.payment_status}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {orderData.order_items && orderData.order_items.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 text-left">
              <h2 className="font-heading text-xl text-brand mb-4">
                Order Items ({orderData.order_items.length})
              </h2>
              <div className="space-y-4">
                {orderData.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-taupe/20 last:border-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-cream">
                      <Image
                        src={item.product_image || "/placeholder.jpg"}
                        alt={item.product_name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-brand mb-1">
                        {item.product_name}
                      </h3>
                      <div className="text-sm text-charcoal/60">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && (
                          <span className="capitalize">
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-charcoal/60 mt-1">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-brand">
                        {formatPrice(item.total_price, orderData.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 text-left">
            <h2 className="font-heading text-xl text-brand mb-4">
              Shipping Information
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-charcoal/60">Name:</span>
                <span className="ml-2 font-medium">
                  {orderData.customer_name}
                </span>
              </div>
              <div>
                <span className="text-charcoal/60">Email:</span>
                <span className="ml-2 font-medium">
                  {orderData.customer_email}
                </span>
              </div>
              <div>
                <span className="text-charcoal/60">Phone:</span>
                <span className="ml-2 font-medium">
                  {orderData.customer_phone}
                </span>
              </div>
              <div>
                <span className="text-charcoal/60">Address:</span>
                <div className="mt-1 font-medium">
                  {orderData.shipping_address_line1}
                  {orderData.shipping_address_line2 && (
                    <>, {orderData.shipping_address_line2}</>
                  )}
                  <br />
                  {orderData.shipping_city}, {orderData.shipping_state}{" "}
                  {orderData.shipping_postal_code}
                  <br />
                  {orderData.shipping_country}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-brand" />
              </div>
              <h3 className="font-semibold text-brand mb-2">
                Check Your Email
              </h3>
              <p className="text-sm text-charcoal/60">
                A confirmation email has been sent to {orderData.customer_email}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-brand" />
              </div>
              <h3 className="font-semibold text-brand mb-2">
                Order Processing
              </h3>
              <p className="text-sm text-charcoal/60">
                We're preparing your items for shipment
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={24} className="text-brand" />
              </div>
              <h3 className="font-semibold text-brand mb-2">Track Delivery</h3>
              <p className="text-sm text-charcoal/60">
                You'll receive tracking info within 24-48 hours
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                console.log("🖨️ [OrderConfirmation] Print button clicked");
                window.print();
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand text-brand rounded-full hover:bg-brand hover:text-cream transition-all duration-300 font-semibold"
            >
              Print Receipt
            </button>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
