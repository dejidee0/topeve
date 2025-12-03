// app/checkout/content.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Truck,
  User,
  Mail,
  Phone,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore, useCartStore } from "@/lib/store";
import { formatPrice } from "@/utils/products";
import { PaystackButton } from "react-paystack";
import { ordersAPI } from "@/lib/orders";

export default function CheckoutPageContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getSubtotal, clearCart } = useCartStore();

  // Form state
  const [formData, setFormData] = useState({
    // Customer Information
    email: "",
    firstName: "",
    lastName: "",
    phone: "",

    // Shipping Address
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",

    // Additional
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);

  // Fetch and prefill customer data if user is logged in
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.id) {
        console.log("ℹ️ [Checkout] No user logged in, skipping prefill");
        return;
      }

      try {
        setIsLoadingCustomerData(true);
        console.log("📋 [Checkout] Fetching customer data for prefill...");

        const { createClient } = await import("@/supabase/client");
        const supabase = createClient();

        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("❌ [Checkout] Error fetching customer:", error);
          // Still use user email from auth
          setFormData((prev) => ({
            ...prev,
            email: user.email || "",
          }));
          return;
        }

        console.log("✅ [Checkout] Customer data loaded, prefilling form");

        // Prefill form with customer data
        setFormData({
          email: data.email || user.email || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phone: data.phone || "",
          address: data.address_line1 || "",
          apartment: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          postalCode: data.postal_code || "",
          country: data.country || "Nigeria",
          orderNotes: "",
        });
      } catch (error) {
        console.error("❌ [Checkout] Error:", error);
        // Fallback to user email
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }));
      } finally {
        setIsLoadingCustomerData(false);
      }
    };

    fetchCustomerData();
  }, [user?.id, user?.email]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessingPayment) {
      console.log("⚠️ [Checkout] Cart is empty, redirecting to cart page");
      router.push("/cart");
    }
  }, [items.length, router, isProcessingPayment]);

  // Calculate totals (in kobo)
  const subtotalInKobo = getSubtotal();
  const shippingThreshold = 5000000; // 50,000 NGN in kobo
  const shippingFee = subtotalInKobo >= shippingThreshold ? 0 : 200000; // 2,000 NGN
  const tax = 0; // Add tax calculation if needed
  const totalInKobo = subtotalInKobo + shippingFee + tax;

  // Format for display
  const subtotal = formatPrice(subtotalInKobo, "NGN");
  const shipping = formatPrice(shippingFee, "NGN");
  const total = formatPrice(totalInKobo);

  // Paystack configuration (correct according to documentation)
  const paystackConfig = {
    reference: `TOPEVE-${new Date().getTime()}`,
    email: formData.email,
    amount: totalInKobo, // Amount in kobo (smallest currency unit)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    currency: "NGN",
    channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"], // Payment channels
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: formData.phone,
        },
        {
          display_name: "Shipping Address",
          variable_name: "shipping_address",
          value: `${formData.address}, ${formData.city}, ${formData.state}`,
        },
      ],
      cart_items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    },
    // Split payment configuration (optional)
    split_code: "", // Add if you're using split payments
    // Subaccount configuration (optional)
    subaccount: "", // Add if you're using subaccounts
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Name validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^(\+234|0)[7-9][0-1]\d{8}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid Nigerian phone number";
    }

    // Address validation
    if (!formData.address) newErrors.address = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    // Terms validation
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // Validate form on changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      validateForm();
    }
  }, [formData, agreedToTerms]);

  const handlePaystackSuccessAction = async (reference) => {
    console.log("✅ [Checkout] Payment successful:", reference);

    // CRITICAL: Set processing flag to prevent redirect to cart
    setIsProcessingPayment(true);

    console.log("📋 [Checkout] Reference details:", {
      reference: reference.reference,
      transaction: reference.transaction,
      status: reference.status,
    });

    try {
      console.log("💾 [Checkout] Preparing order data...");

      // Prepare order data
      const orderData = {
        payment_method: "paystack",
        payment_status: "paid",
        status: "processing",
        subtotal: subtotalInKobo,
        shipping_fee: shippingFee,
        tax: tax,
        discount: 0,
        total: totalInKobo,
        customer_id: user?.id || null,
        currency: "NGN",
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address_line1: formData.address,
        shipping_address_line2: formData.apartment,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_postal_code: formData.postalCode,
        shipping_country: formData.country,
        customer_notes: formData.orderNotes,
        paid_at: new Date().toISOString(),
      };

      console.log("📦 [Checkout] Order data prepared");

      // Prepare order items
      const orderItems = items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_sku: item.sku,
        product_image: item.image,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      console.log(
        "🛍️ [Checkout] Order items prepared:",
        orderItems.length,
        "items"
      );

      // Save order to database
      console.log("💾 [Checkout] Saving order to database...");
      const { data: savedOrder, error: orderError } = await ordersAPI.create(
        orderData,
        orderItems
      );

      if (orderError) {
        console.error("❌ [Checkout] Error saving order:", orderError);
        throw orderError;
      }

      console.log("✅ [Checkout] Order saved successfully!");
      console.log("📋 [Checkout] Order number:", savedOrder.order_number);

      // Update customer data if user is logged in and data has changed
      if (user?.id) {
        console.log("💾 [Checkout] Updating customer data in database...");
        const { createClient } = await import("@/supabase/client");
        const supabase = createClient();

        await supabase
          .from("customers")
          .upsert({
            id: user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address_line1: formData.address,
            address_line2: formData.apartment,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
          })
          .eq("id", user.id);

        console.log("✅ [Checkout] Customer data updated");
      }

      // Send email notification in background (fire and forget)
      console.log("📧 [Checkout] Sending email notifications...");
      fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: savedOrder,
          orderItems: savedOrder.order_items,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("✅ [Checkout] Email notifications sent successfully");
          } else {
            console.warn(
              "⚠️ [Checkout] Email notification failed:",
              data.error
            );
          }
        })
        .catch((error) => {
          console.error("❌ [Checkout] Email notification error:", error);
          // Don't throw - order was saved successfully
        });

      // Clear cart BEFORE redirect
      console.log("🛒 [Checkout] Clearing cart...");
      clearCart();

      // Small delay to ensure cart state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to success page using window.location for guaranteed redirect
      const confirmationUrl = `/order-confirmation?reference=${savedOrder.order_number}`;
      console.log("🔄 [Checkout] Redirecting to:", confirmationUrl);

      // Use window.location.href for immediate redirect
      window.location.href = confirmationUrl;
    } catch (error) {
      console.error("❌ [Checkout] Critical error processing order:", error);

      // Still redirect to confirmation but show warning
      console.log("⚠️ [Checkout] Redirecting with error flag...");
      window.location.href = `/order-confirmation?reference=${reference.reference}&error=true`;
    }
  };

  // Handle payment close (user closed the payment modal)
  const handlePaystackCloseAction = () => {
    console.log("⚠️ Payment modal closed by user");
    // You can show a message here if needed
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Component props for PaystackButton
  const componentProps = {
    ...paystackConfig,
    text: "Pay Securely",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-brand mb-2">Checkout</h1>
            <p className="text-charcoal/60">Complete your purchase securely</p>
            {isAuthenticated() && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <User size={14} />
                <span>Logged in as {user?.email}</span>
              </p>
            )}
          </div>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-brand hover:text-gold transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </Link>
        </div>

        {/* Security Badge */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Lock size={20} className="text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-green-900 text-sm">
              Secure Checkout
            </div>
            <div className="text-xs text-green-700">
              Your payment information is encrypted and secure with Paystack
            </div>
          </div>
        </div>

        {/* Loading State for Customer Data */}
        {isLoadingCustomerData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-blue-700">
              Loading your saved information...
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <User size={20} className="text-brand" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-brand">
                    Contact Information
                  </h2>
                  <p className="text-sm text-charcoal/60">
                    How can we reach you?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-charcoal/80 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={validateForm}
                      disabled={isLoadingCustomerData}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-taupe/30"
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={validateForm}
                      disabled={isLoadingCustomerData}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                        errors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-taupe/30"
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={validateForm}
                      disabled={isLoadingCustomerData}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                        errors.lastName
                          ? "border-red-300 bg-red-50"
                          : "border-taupe/30"
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-charcoal/80 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={validateForm}
                      disabled={isLoadingCustomerData}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                        errors.phone
                          ? "border-red-300 bg-red-50"
                          : "border-taupe/30"
                      }`}
                      placeholder="08012345678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Truck size={20} className="text-brand" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-brand">
                    Shipping Address
                  </h2>
                  <p className="text-sm text-charcoal/60">
                    Where should we deliver?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-charcoal/80 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={validateForm}
                    disabled={isLoadingCustomerData}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                      errors.address
                        ? "border-red-300 bg-red-50"
                        : "border-taupe/30"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Apartment/Suite */}
                <div>
                  <label className="block text-sm font-medium text-charcoal/80 mb-2">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    disabled={isLoadingCustomerData}
                    className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait"
                    placeholder="Apt 4B"
                  />
                </div>

                {/* City, State, Postal */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={validateForm}
                      disabled={isLoadingCustomerData}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                        errors.city
                          ? "border-red-300 bg-red-50"
                          : "border-taupe/30"
                      }`}
                      placeholder="Lagos"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={validateForm}
                      disabled={isLoadingCustomerData}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait ${
                        errors.state
                          ? "border-red-300 bg-red-50"
                          : "border-taupe/30"
                      }`}
                    >
                      <option value="">Select State</option>
                      <option value="Abia">Abia</option>
                      <option value="Adamawa">Adamawa</option>
                      <option value="Akwa Ibom">Akwa Ibom</option>
                      <option value="Anambra">Anambra</option>
                      <option value="Bauchi">Bauchi</option>
                      <option value="Bayelsa">Bayelsa</option>
                      <option value="Benue">Benue</option>
                      <option value="Borno">Borno</option>
                      <option value="Cross River">Cross River</option>
                      <option value="Delta">Delta</option>
                      <option value="Ebonyi">Ebonyi</option>
                      <option value="Edo">Edo</option>
                      <option value="Ekiti">Ekiti</option>
                      <option value="Enugu">Enugu</option>
                      <option value="FCT">FCT (Abuja)</option>
                      <option value="Gombe">Gombe</option>
                      <option value="Imo">Imo</option>
                      <option value="Jigawa">Jigawa</option>
                      <option value="Kaduna">Kaduna</option>
                      <option value="Kano">Kano</option>
                      <option value="Katsina">Katsina</option>
                      <option value="Kebbi">Kebbi</option>
                      <option value="Kogi">Kogi</option>
                      <option value="Kwara">Kwara</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Nasarawa">Nasarawa</option>
                      <option value="Niger">Niger</option>
                      <option value="Ogun">Ogun</option>
                      <option value="Ondo">Ondo</option>
                      <option value="Osun">Osun</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Plateau">Plateau</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Sokoto">Sokoto</option>
                      <option value="Taraba">Taraba</option>
                      <option value="Yobe">Yobe</option>
                      <option value="Zamfara">Zamfara</option>
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal/80 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData}
                      className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all disabled:bg-taupe/10 disabled:cursor-wait"
                      placeholder="100001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-brand mb-3">
                Order Notes (Optional)
              </h3>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                disabled={isLoadingCustomerData}
                rows={4}
                className="w-full px-4 py-3 border border-taupe/30 rounded-lg focus:ring-2 focus:ring-gold/40 focus:border-gold outline-none transition-all resize-none disabled:bg-taupe/10 disabled:cursor-wait"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-heading text-2xl text-brand mb-6">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-cream">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-brand line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="text-xs text-charcoal/60 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && (
                          <span className="capitalize">{item.color}</span>
                        )}
                      </div>
                      <div className="text-xs text-charcoal/60 mt-1">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-brand">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-taupe/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="font-medium">{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/70">Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      shipping
                    )}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal/70">Tax</span>
                    <span className="font-medium">
                      {formatPrice(tax, "NGN")}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg pt-3 border-t border-taupe/20">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-bold text-brand text-2xl">{total}</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={isLoadingCustomerData}
                    className="mt-1 w-4 h-4 text-brand focus:ring-gold rounded border-taupe/30 disabled:cursor-wait"
                  />
                  <span className="text-xs text-charcoal/70">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-brand hover:underline"
                      target="_blank"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-brand hover:underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Payment Button */}
              {isFormValid && !isLoadingCustomerData ? (
                <PaystackButton
                  {...componentProps}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold"
                >
                  <Lock size={20} />
                  <span>Pay Securely</span>
                </PaystackButton>
              ) : (
                <button
                  type="button"
                  onClick={validateForm}
                  disabled={isLoadingCustomerData}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-charcoal/20 text-charcoal/50 rounded-full cursor-not-allowed font-semibold disabled:cursor-wait"
                >
                  <Lock size={20} />
                  <span>
                    {isLoadingCustomerData
                      ? "Loading..."
                      : "Complete Form to Pay"}
                  </span>
                </button>
              )}

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-taupe/20">
                <p className="text-xs text-charcoal/60 text-center mb-3">
                  Secured by Paystack
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-charcoal/60">
                  <span className="px-2 py-1 bg-taupe/10 rounded">Cards</span>
                  <span className="px-2 py-1 bg-taupe/10 rounded">
                    Bank Transfer
                  </span>
                  <span className="px-2 py-1 bg-taupe/10 rounded">USSD</span>
                  <span className="px-2 py-1 bg-taupe/10 rounded">
                    Mobile Money
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
