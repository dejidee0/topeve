// components/cart/cartSidebar.jsx
"use client";

import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/utils/products";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    getTotalItems,
    getFormattedSubtotal,
  } = useCartStore();

  const totalItems = getTotalItems();
  const subtotal = getFormattedSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-taupe/20">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-brand" />
                <div>
                  <h2 className="font-heading text-xl text-brand">
                    Shopping Cart
                  </h2>
                  <p className="text-sm text-charcoal/60">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-taupe/10 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={24} className="text-charcoal/70" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-taupe/10 flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-charcoal/30" />
                  </div>
                  <h3 className="font-heading text-xl text-brand mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-charcoal/60 mb-6">
                    Add items to get started
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-cream/30 rounded-2xl p-4 group"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white"
                        onClick={closeCart}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="block"
                        >
                          <h3 className="font-medium text-brand line-clamp-2 mb-1 group-hover:text-gold transition-colors">
                            {item.name}
                          </h3>
                        </Link>

                        {/* Size & Color */}
                        <div className="flex items-center gap-2 text-xs text-charcoal/60 mb-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.size && item.color && <span>•</span>}
                          {item.color && (
                            <span className="capitalize">
                              Color: {item.color}
                            </span>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-taupe/30 rounded-lg">
                            <button
                              onClick={() =>
                                decrementQuantity(
                                  item.id,
                                  item.size,
                                  item.color
                                )
                              }
                              className="p-1.5 hover:bg-taupe/10 rounded-l-lg transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                incrementQuantity(
                                  item.id,
                                  item.size,
                                  item.color
                                )
                              }
                              className="p-1.5 hover:bg-taupe/10 rounded-r-lg transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-brand">
                              {formatPrice(
                                item.price * item.quantity,
                                item.currency
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          removeItem(item.id, item.size, item.color)
                        }
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-taupe/20 px-6 py-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="font-bold text-brand text-xl">
                    {subtotal}
                  </span>
                </div>

                <p className="text-xs text-charcoal/60">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block w-full px-6 py-3 bg-brand text-cream rounded-full hover:bg-gold hover:text-brand transition-all duration-300 font-semibold text-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gold text-brand rounded-full hover:bg-brand hover:text-cream transition-all duration-300 font-semibold"
                  >
                    <span>Checkout</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-sm text-charcoal/60 hover:text-brand transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
