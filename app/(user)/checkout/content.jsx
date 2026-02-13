"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Truck,
  User,
  Mail,
  Phone,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuthStore, useCartStore } from "@/lib/store";
import { formatPrice } from "@/utils/products";
import { useCreatePendingOrder, ordersAPI } from "@/lib/orders";
import { toast } from "sonner";

// Paystack is loaded but triggered programmatically via initializePayment
const usePaystackPayment = dynamic(
  () => import("react-paystack").then((mod) => mod.usePaystackPayment),
  { ssr: false },
);

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepDot({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
          ${
            done
              ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg"
              : active
                ? "bg-black text-white shadow-black/20 shadow-lg scale-110"
                : "bg-stone-100 text-stone-400"
          }`}
      >
        {done ? <CheckCircle size={14} /> : step}
      </div>
      <span
        className={`text-[10px] font-semibold tracking-widest uppercase transition-colors ${active ? "text-black" : done ? "text-emerald-600" : "text-stone-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, error, children, required }) {
  return (
    <div className="group">
      <label className="block text-[11px] font-bold tracking-widest uppercase text-stone-500 mb-2">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputBase =
  "w-full px-4 py-3 bg-stone-50 border rounded-xl outline-none transition-all duration-200 text-sm text-stone-800 placeholder:text-stone-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]";
const inputOk = "border-stone-200 focus:border-stone-400";
const inputErr = "border-rose-300 bg-rose-50 focus:border-rose-400";

// ─── Main component ───────────────────────────────────────────────────────────
export default function CheckoutPageContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, getSubtotal, clearCart } = useCartStore();
  const createPendingOrder = useCreatePendingOrder();

  const [step, setStep] = useState(1); // 1 = details, 2 = paying
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // unified loading
  const [paystackReady, setPaystackReady] = useState(false);
  const initPayRef = useRef(null); // holds initializePayment fn once loaded

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  // ── Load Paystack hook lazily ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    import("react-paystack").then(({ usePaystackPayment: hook }) => {
      if (mounted) setPaystackReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // ── Pre-fill from Supabase ────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      setIsLoadingCustomerData(true);
      try {
        const { createClient } = await import("@/supabase/client");
        const { data, error } = await createClient()
          .from("customers")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error && data) {
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
        } else {
          setFormData((p) => ({ ...p, email: user.email || "" }));
        }
      } finally {
        setIsLoadingCustomerData(false);
      }
    };
    fetch();
  }, [user?.id, user?.email]);

  // ── Redirect if cart empty ────────────────────────────────────────────────
  useEffect(() => {
    if (items.length === 0 && !pendingOrder) router.push("/cart");
  }, [items.length, router, pendingOrder]);

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 50000 ? 0 : 2000;
  const total = subtotal + shippingFee;
  const totalInKobo = Math.round(total * 100);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const e = {};
    if (!formData.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email";
    if (!formData.firstName?.trim()) e.firstName = "Required";
    if (!formData.lastName?.trim()) e.lastName = "Required";
    if (!formData.phone) e.phone = "Required";
    else if (
      !/^(\+?234|0)[7-9][0-1]\d{8}$/.test(formData.phone.replace(/\s/g, ""))
    )
      e.phone = "Invalid Nigerian number (e.g. 08012345678)";
    if (!formData.address?.trim()) e.address = "Required";
    if (!formData.city?.trim()) e.city = "Required";
    if (!formData.state) e.state = "Required";
    if (!agreedToTerms) e.terms = "Please agree to proceed";
    setErrors(e);
    const valid = Object.keys(e).length === 0;
    setIsFormValid(valid);
    return valid;
  }, [formData, agreedToTerms]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name])
      setErrors((p) => {
        const n = { ...p };
        delete n[name];
        return n;
      });
  };

  // ── THE UNIFIED PAY BUTTON ─────────────────────────────────────────────────
  // One click: create order → open Paystack popup. No intermediate state shown to user.
  const handlePay = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Please complete all required fields");
      return;
    }
    if (!paystackReady) return;

    setIsProcessing(true);
    setStep(2);

    try {
      const orderData = {
        payment_method: "paystack",
        payment_status: "pending",
        status: "pending",
        subtotal,
        shipping_fee: shippingFee,
        tax: 0,
        discount: 0,
        total,
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
      };

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

      const { data, error } = await createPendingOrder.mutateAsync({
        orderData,
        orderItems,
      });

      if (error || !data) {
        toast.error("Failed to create order. Please try again.");
        setStep(1);
        return;
      }

      setPendingOrder(data);

      // Save customer data in background (non-blocking)
      if (user?.id) {
        ordersAPI.updateCustomerData(user.id, {
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
        });
      }

      // Dynamically load & invoke Paystack
      const { usePaystackPayment } = await import("react-paystack");

      // usePaystackPayment is a hook — we invoke it via a helper component rendered once
      initPayRef.current = { orderNumber: data.order_number };

      // Directly call the Paystack JS SDK (bypasses React hook limitation in async context)
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: formData.email,
        amount: totalInKobo,
        currency: "NGN",
        ref: data.order_number,
        channels: [
          "card",
          "bank",
          "ussd",
          "qr",
          "mobile_money",
          "bank_transfer",
        ],
        onSuccess: () => {
          clearCart();
          router.push(`/order-processing?reference=${data.order_number}`);
        },
        onCancel: () => {
          toast.warning("Payment cancelled");
          setStep(1);
          setIsProcessing(false);
        },
      });
      handler.openIframe();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  }, [
    formData,
    user,
    items,
    subtotal,
    shippingFee,
    total,
    totalInKobo,
    validateForm,
    paystackReady,
    createPendingOrder,
    clearCart,
    router,
  ]);

  if (items.length === 0 && !pendingOrder) return null;

  const btnDisabled = !isFormValid || isLoadingCustomerData || isProcessing;

  return (
    <div className="min-h-screen bg-[#faf9f7] pt-24 pb-20">
      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-1">
              Order Checkout
            </p>
            <h1
              className="font-['Cormorant_Garamond',serif] text-5xl font-semibold text-stone-900 leading-none"
              style={{ fontFamily: "'Cormorant Garamond', Garamond, serif" }}
            >
              Complete Order
            </h1>
            {isAuthenticated() && (
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1.5 font-medium">
                <ShieldCheck size={13} />
                {user?.email}
              </p>
            )}
          </div>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition text-sm font-medium mt-1"
          >
            <ArrowLeft size={16} />
            Cart
          </Link>
        </div>

        {/* ── Steps ── */}
        <div className="flex items-center gap-3 mb-10">
          <StepDot step={1} current={step} label="Details" />
          <div className="flex-1 h-px bg-stone-200 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-emerald-400 transition-all duration-700"
              style={{ width: step >= 2 ? "100%" : "0%" }}
            />
          </div>
          <StepDot step={2} current={step} label="Payment" />
        </div>

        {/* ── Loading banner ── */}
        {isLoadingCustomerData && (
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <Loader2 size={16} className="animate-spin text-sky-500" />
            <p className="text-sm text-sky-700">
              Filling in your saved details…
            </p>
          </div>
        )}

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ─────── LEFT: FORM ─────── */}
          <div className="space-y-5">
            {/* Contact */}
            <div className="bg-white border border-stone-100 rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-stone-900 leading-none">
                    Contact
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    How we'll reach you
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Field label="Email" error={errors.email} required>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} pl-10 ${errors.email ? inputErr : inputOk}`}
                      placeholder="you@example.com"
                    />
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" error={errors.firstName} required>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} ${errors.firstName ? inputErr : inputOk}`}
                      placeholder="John"
                    />
                  </Field>
                  <Field label="Last name" error={errors.lastName} required>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} ${errors.lastName ? inputErr : inputOk}`}
                      placeholder="Doe"
                    />
                  </Field>
                </div>

                <Field label="Phone" error={errors.phone} required>
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} pl-10 ${errors.phone ? inputErr : inputOk}`}
                      placeholder="08012345678"
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white border border-stone-100 rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-stone-900 flex items-center justify-center">
                  <Truck size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-stone-900 leading-none">
                    Delivery
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Where should we ship?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Field label="Street address" error={errors.address} required>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoadingCustomerData || isProcessing}
                    className={`${inputBase} ${errors.address ? inputErr : inputOk}`}
                    placeholder="123 Main Street"
                  />
                </Field>

                <Field label="Apartment / Suite">
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    disabled={isLoadingCustomerData || isProcessing}
                    className={`${inputBase} ${inputOk}`}
                    placeholder="Apt 4B (optional)"
                  />
                </Field>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="City" error={errors.city} required>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} ${errors.city ? inputErr : inputOk}`}
                      placeholder="Lagos"
                    />
                  </Field>
                  <Field label="State" error={errors.state} required>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} ${errors.state ? inputErr : inputOk}`}
                    >
                      <option value="">Select</option>
                      {nigerianStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Postal code">
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      disabled={isLoadingCustomerData || isProcessing}
                      className={`${inputBase} ${inputOk}`}
                      placeholder="100001"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-stone-100 rounded-2xl p-7 shadow-sm">
              <Field label="Order notes">
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  disabled={isLoadingCustomerData || isProcessing}
                  rows={3}
                  className={`${inputBase} ${inputOk} resize-none`}
                  placeholder="Special delivery instructions, gift message…"
                />
              </Field>
            </div>
          </div>

          {/* ─────── RIGHT: SUMMARY + PAY ─────── */}
          <div>
            <div className="bg-white border border-stone-100 rounded-2xl p-7 shadow-sm sticky top-24">
              <h2
                className="font-['Cormorant_Garamond',serif] text-3xl font-semibold text-stone-900 mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Garamond, serif" }}
              >
                Your Order
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-56 overflow-y-auto mb-6 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-3.5"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-stone-800 shrink-0">
                      {formatPrice(item.price * item.quantity, "NGN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 py-5 border-t border-b border-stone-100">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-800">
                    {formatPrice(subtotal, "NGN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-medium text-stone-800">
                      {formatPrice(shippingFee, "NGN")}
                    </span>
                  )}
                </div>
                {shippingFee > 0 && (
                  <p className="text-[11px] text-stone-400">
                    Free shipping on orders over {formatPrice(50000, "NGN")}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-baseline pt-4 mb-7">
                <span
                  className="font-['Cormorant_Garamond',serif] text-xl font-semibold text-stone-600"
                  style={{
                    fontFamily: "'Cormorant Garamond', Garamond, serif",
                  }}
                >
                  Total
                </span>
                <span
                  className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-stone-900"
                  style={{
                    fontFamily: "'Cormorant Garamond', Garamond, serif",
                  }}
                >
                  {formatPrice(total, "NGN")}
                </span>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mb-5 group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    disabled={isProcessing}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border-2 border-stone-300 peer-checked:bg-stone-900 peer-checked:border-stone-900 transition-all flex items-center justify-center">
                    {agreedToTerms && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 8"
                      >
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-stone-500 leading-relaxed select-none">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-stone-900 font-semibold hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-rose-500 text-xs mb-4 flex items-center gap-1 font-medium -mt-2">
                  <AlertCircle size={11} /> {errors.terms}
                </p>
              )}

              {/* ── THE ONE BUTTON ── */}
              <button
                onClick={handlePay}
                disabled={btnDisabled}
                className="relative w-full py-4 rounded-2xl font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300
                  bg-stone-900 text-white
                  hover:bg-stone-800 active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
                  shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.2)]"
              >
                <span
                  className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${isProcessing ? "opacity-0" : "opacity-100"}`}
                >
                  <Lock size={15} />
                  Pay {formatPrice(total, "NGN")}
                </span>
                {isProcessing && (
                  <span className="absolute inset-0 flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Opening payment…</span>
                  </span>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>Secured by Paystack</span>
                <span className="text-stone-200">·</span>
                <span>256-bit SSL</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {["Cards", "Bank", "USSD", "Transfer"].map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 bg-stone-50 border border-stone-100 rounded text-[10px] text-stone-500 font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
