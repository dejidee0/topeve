"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine, RiSaveLine, RiImageAddLine } from "react-icons/ri";
import { productsAPI } from "@/lib/products";
import Image from "next/image";

export default function ProductModal({ isOpen, onClose, product, mode }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "ready-to-wear",
    subcategory: "",
    price: "",
    currency: "NGN",
    color: "",
    size: [],
    material: "",
    tags: [],
    image: "",
    description: "",
    in_stock: true,
    sku: "",
    stock_quantity: 0,
    low_stock_threshold: 10,
  });

  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  useEffect(() => {
    if (product && (mode === "edit" || mode === "view")) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        category: product.category || "ready-to-wear",
        subcategory: product.subcategory || "",
        price: product.price ? (product.price / 100).toString() : "",
        currency: product.currency || "NGN",
        color: product.color || "",
        size: product.size || [],
        material: product.material || "",
        tags: product.tags || [],
        image: product.image || "",
        description: product.description || "",
        in_stock: product.in_stock ?? true,
        sku: product.sku || "",
        stock_quantity: product.stock_quantity || 0,
        low_stock_threshold: product.low_stock_threshold || 10,
      });
    } else if (mode === "create") {
      // Reset form for create mode
      setFormData({
        name: "",
        slug: "",
        category: "ready-to-wear",
        subcategory: "",
        price: "",
        currency: "NGN",
        color: "",
        size: [],
        material: "",
        tags: [],
        image: "",
        description: "",
        in_stock: true,
        sku: "",
        stock_quantity: 0,
        low_stock_threshold: 10,
      });
    }
  }, [product, mode, isOpen]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !formData.size.includes(sizeInput.trim())) {
      setFormData({
        ...formData,
        size: [...formData.size, sizeInput.trim()],
      });
      setSizeInput("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      size: formData.size.filter((size) => size !== sizeToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(
      `${mode === "create" ? "📝 Creating" : "✏️ Updating"} product...`
    );

    // Convert price from naira to kobo
    const productData = {
      ...formData,
      price: Math.round(parseFloat(formData.price) * 100),
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
    };

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

  const isViewMode = mode === "view";

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
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Product Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isViewMode}
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="Enter product name"
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        SKU *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isViewMode}
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="TW-DRESS-001"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isViewMode}
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="product-slug"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        disabled={isViewMode}
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                      >
                        <option value="ready-to-wear">Ready to Wear</option>
                        <option value="jewelry">Jewelry</option>
                        <option value="accessories">Accessories</option>
                        <option value="beauty-hair">Beauty & Hair</option>
                        <option value="cosmetics">Cosmetics</option>
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Subcategory
                      </label>
                      <select
                        disabled={isViewMode}
                        value={formData.subcategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subcategory: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                      >
                        <option value="">None</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                        <option value="bridal-shower">Bridal Shower</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Price (₦) *
                      </label>
                      <input
                        type="number"
                        required
                        disabled={isViewMode}
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="85000"
                        step="0.01"
                      />
                    </div>

                    {/* Stock Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        disabled={isViewMode}
                        value={formData.stock_quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock_quantity: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="50"
                      />
                    </div>

                    {/* Low Stock Threshold */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Low Stock Alert
                      </label>
                      <input
                        type="number"
                        disabled={isViewMode}
                        value={formData.low_stock_threshold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            low_stock_threshold: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="10"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        disabled={isViewMode}
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="Navy Blue"
                      />
                    </div>

                    {/* Material */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        disabled={isViewMode}
                        value={formData.material}
                        onChange={(e) =>
                          setFormData({ ...formData, material: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="Cotton, Silk, etc."
                      />
                    </div>

                    {/* Sizes */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Sizes
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          disabled={isViewMode}
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddSize())
                          }
                          className="flex-1 px-4 py-2 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 disabled:bg-cream-50"
                          placeholder="XS, S, M, L, XL"
                        />
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={handleAddSize}
                            className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.size.map((size) => (
                          <span
                            key={size}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-cream-100 text-charcoal-900 rounded-lg text-sm"
                          >
                            {size}
                            {!isViewMode && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSize(size)}
                                className="hover:text-red-600"
                              >
                                <RiCloseLine />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          disabled={isViewMode}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddTag())
                          }
                          className="flex-1 px-4 py-2 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 disabled:bg-cream-50"
                          placeholder="new, best-seller, etc."
                        />
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gold-100 text-gold-700 rounded-lg text-sm"
                          >
                            {tag}
                            {!isViewMode && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-red-600"
                              >
                                <RiCloseLine />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        disabled={isViewMode}
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-cream-50"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.image && (
                        <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden bg-cream-100">
                          <Image
                            src={formData.image}
                            alt="Product preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Description
                      </label>
                      <textarea
                        disabled={isViewMode}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none disabled:bg-cream-50"
                        placeholder="Enter product description..."
                      />
                    </div>

                    {/* In Stock Toggle */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={isViewMode}
                          checked={formData.in_stock}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              in_stock: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-brand-600 border-cream-300 rounded focus:ring-brand-500 disabled:opacity-50"
                        />
                        <span className="text-sm font-medium text-charcoal-900">
                          Product is in stock
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Footer */}
                  {!isViewMode && (
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-cream-200">
                      <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-6 py-3 border border-cream-300 text-charcoal-900 rounded-xl hover:bg-cream-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-gold-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <RiSaveLine className="text-xl" />
                            {mode === "create"
                              ? "Create Product"
                              : "Save Changes"}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
