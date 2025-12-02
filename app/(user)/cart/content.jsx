// app/cart/content.jsx
"use client";

import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/utils/products";

export default function CartPageContent() {
  const {
    items,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    getTotalItems,
    getFormattedSubtotal,
    clearCart,
  } = useCartStore();

  const totalItems = getTotalItems();
  const subtotal = getFormattedSubtotal();

  // Calculate shipping (free over 50,000 NGN)
  const subtotalInKobo = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingThreshold = 5000000; // 50,000 NGN in kobo
  const shippingFee = subtotalInKobo >= shippingThreshold ? 0 : 200000; // 2,000 NGN
  const total = subtotalInKobo + shippingFee;

  const formatShipping = formatPrice(shippingFee, "NGN");
  const formatTotal = formatPrice(total, "NGN");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-32 h-32 rounded-full bg-taupe/10 flex items-center justify-center mb-6">
              <ShoppingBag size={64} className="text-charcoal/30" />
            </div>
            <h1 className="font-heading text-4xl text-brand mb-4">
              Your cart is empty
            </h1>
            <p className="text-charcoal/60 mb-8 max-w-md">
              Looks like you haven&#39;t added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold"
            >
              <span>Start Shopping</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-brand mb-2">
              Shopping Cart
            </h1>
            <p className="text-charcoal/60">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-cream group"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-heading text-xl text-brand mb-2 hover:text-gold transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal/60 mb-3">
                          {item.size && (
                            <span className="px-3 py-1 bg-taupe/10 rounded-full">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="px-3 py-1 bg-taupe/10 rounded-full capitalize">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          removeItem(item.id, item.size, item.color)
                        }
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-charcoal/60">
                          Quantity:
                        </span>
                        <div className="flex items-center gap-2 border border-taupe/30 rounded-lg">
                          <button
                            onClick={() =>
                              decrementQuantity(item.id, item.size, item.color)
                            }
                            className="p-2 hover:bg-taupe/10 rounded-l-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-base font-semibold w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              incrementQuantity(item.id, item.size, item.color)
                            }
                            className="p-2 hover:bg-taupe/10 rounded-r-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-bold text-brand text-2xl">
                          {formatPrice(
                            item.price * item.quantity,
                            item.currency
                          )}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-charcoal/60">
                            {formatPrice(item.price, item.currency)} each
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Save for Later / Move to Wishlist */}
                    <div className="mt-4 pt-4 border-t border-taupe/10">
                      <button className="text-sm text-gold hover:text-brand transition-colors flex items-center gap-2">
                        <Heart size={14} />
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-heading text-2xl text-brand mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-base">
                  <span className="text-charcoal/70">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-semibold">{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-base">
                  <span className="text-charcoal/70">Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatShipping
                    )}
                  </span>
                </div>

                {subtotalInKobo < shippingThreshold && (
                  <div className="bg-gold/10 rounded-xl p-4">
                    <p className="text-xs text-brand">
                      Add{" "}
                      {formatPrice(shippingThreshold - subtotalInKobo, "NGN")}{" "}
                      more to qualify for FREE shipping
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-taupe/20">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-charcoal">Total</span>
                    <span className="font-bold text-brand text-2xl">
                      {formatTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold mb-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block text-center text-sm text-charcoal/60 hover:text-brand transition-colors py-2"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-taupe/10 space-y-3">
                <div className="flex items-center gap-3 text-sm text-charcoal/70">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-charcoal/70">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-charcoal/70">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span>Free shipping over ₦50,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
