"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";
import { productsAPI } from "@/lib/supabase/products";
import ProductForm from "./product-form";

export default function ProductModal({ isOpen, onClose, product, mode }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (productData) => {
    setLoading(true);

    console.log(
      `${mode === "create" ? "📝 Creating" : "✏️ Updating"} product...`
    );

    let result;
    if (mode === "create") {
      result = await productsAPI.create(productData);
    } else {
      result = await productsAPI.update(product.id, productData);
    }

    setLoading(false);

    if (result.error) {
      console.error("❌ Error:", result.error);
      alert(`Failed to ${mode} product: ${result.error.message}`);
    } else {
      console.log("✅ Product saved successfully!");
      onClose(true); // true means refresh the list
    }
  };

  const handleCancel = () => {
    onClose(false);
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
            onClick={() => onClose(false)}
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
                  <h2 className="text-2xl font-playfair font-bold text-charcoal-900">
                    {mode === "create" && "Add New Product"}
                    {mode === "edit" && "Edit Product"}
                    {mode === "view" && "Product Details"}
                  </h2>
                  <button
                    onClick={() => onClose(false)}
                    className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                  >
                    <RiCloseLine className="text-2xl text-charcoal-900" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6">
                  <ProductForm
                    product={product}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
