"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RiImageAddLine,
  RiCloseLine,
  RiAddLine,
  RiDeleteBinLine,
  RiUploadCloudLine,
} from "react-icons/ri";
import Image from "next/image";

export default function ProductForm({
  product,
  mode,
  onSubmit,
  onCancel,
  loading,
}) {
  const isViewMode = mode === "view";

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    subcategory: "",
    price: "",
    currency: "NGN",
    color: "",
    size: [],
    material: "",
    tags: [],
    image: "",
    images: [],
    description: "",
    in_stock: true,
    sku: "",
    stock_quantity: "",
    low_stock_threshold: "10",
    meta_title: "",
    meta_description: "",
  });

  // UI state
  const [currentTag, setCurrentTag] = useState("");
  const [currentSize, setCurrentSize] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [errors, setErrors] = useState({});

  // Initialize form with product data if editing/viewing
  useEffect(() => {
    if (product && (mode === "edit" || mode === "view")) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        price: product.price ? (product.price / 100).toString() : "",
        currency: product.currency || "NGN",
        color: product.color || "",
        size: product.size || [],
        material: product.material || "",
        tags: product.tags || [],
        image: product.image || "",
        images: product.images || [],
        description: product.description || "",
        in_stock: product.in_stock ?? true,
        sku: product.sku || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        low_stock_threshold: product.low_stock_threshold?.toString() || "10",
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
      });
    }
  }, [product, mode]);

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Auto-generate SKU
  const generateSKU = () => {
    const prefix = formData.category
      ? formData.category.substring(0, 3).toUpperCase()
      : "PRD";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug when name changes
    if (name === "name" && !product) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Add size
  const addSize = () => {
    if (currentSize.trim() && !formData.size.includes(currentSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        size: [...prev.size, currentSize.trim()],
      }));
      setCurrentSize("");
    }
  };

  // Remove size
  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      size: prev.size.filter((s) => s !== sizeToRemove),
    }));
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Add image URL
  const addImage = () => {
    if (currentImage.trim() && !formData.images.includes(currentImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, currentImage.trim()],
      }));
      setCurrentImage("");
    }
  };

  // Remove image
  const removeImage = (imageToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageToRemove),
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0)
      newErrors.stock_quantity = "Valid stock quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      console.log("❌ Form validation failed");
      return;
    }

    // Prepare data for API (convert price to kobo)
    const productData = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      category: formData.category,
      subcategory: formData.subcategory || null,
      price: Math.round(parseFloat(formData.price) * 100), // Convert to kobo
      currency: formData.currency,
      color: formData.color.trim() || null,
      size: formData.size.length > 0 ? formData.size : null,
      material: formData.material.trim() || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
      image: formData.image.trim() || null,
      images: formData.images.length > 0 ? formData.images : null,
      description: formData.description.trim() || null,
      in_stock: formData.in_stock,
      sku: formData.sku.trim(),
      stock_quantity: parseInt(formData.stock_quantity),
      low_stock_threshold: parseInt(formData.low_stock_threshold),
      meta_title: formData.meta_title.trim() || null,
      meta_description: formData.meta_description.trim() || null,
    };

    onSubmit(productData);
  };

  const categories = [
    { value: "ready-to-wear", label: "Ready to Wear" },
    { value: "jewelry", label: "Jewelry" },
    { value: "accessories", label: "Accessories" },
    { value: "beauty-hair", label: "Beauty & Hair" },
    { value: "cosmetics", label: "Cosmetics" },
  ];

  const subcategories = {
    "ready-to-wear": ["women", "men", "kids", "bridal-shower"],
    jewelry: ["necklaces", "earrings", "bracelets", "rings"],
    accessories: ["bags", "belts", "scarves", "hats"],
    "beauty-hair": ["wigs", "extensions", "styling", "care"],
    cosmetics: ["makeup", "skincare", "fragrance", "tools"],
  };

  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-charcoal-900 border-b border-cream-200 pb-2">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="e.g., Elegant Silk Evening Gown"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-cream-200 focus:border-brand-400 focus:ring-brand-100"
              } ${isViewMode ? "bg-cream-50 cursor-not-allowed" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="elegant-silk-evening-gown"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.slug
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-cream-200 focus:border-brand-400 focus:ring-brand-100"
              } ${isViewMode ? "bg-cream-50 cursor-not-allowed" : ""}`}
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="REA-123456-789"
                className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.sku
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-cream-200 focus:border-brand-400 focus:ring-brand-100"
                } ${isViewMode ? "bg-cream-50 cursor-not-allowed" : ""}`}
              />
              {!isViewMode && !product && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, sku: generateSKU() }))
                  }
                  className="px-4 py-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 transition-colors font-medium whitespace-nowrap"
                >
                  Generate
                </button>
              )}
            </div>
            {errors.sku && (
              <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
            )}
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.category
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-cream-200 focus:border-brand-400 focus:ring-brand-100"
              } ${isViewMode ? "bg-cream-50 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={isViewMode || !formData.category}
              className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all ${
                isViewMode || !formData.category
                  ? "bg-cream-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="">Select Subcategory</option>
              {formData.category &&
                subcategories[formData.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-charcoal-900 border-b border-cream-200 pb-2">
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Price (NGN) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-600">
                ₦
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-cream-200 focus:border-brand-400 focus:ring-brand-100"
                } ${isViewMode ? "bg-cream-50 cursor-not-allowed" : ""}`}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="0"
              min="0"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.stock_quantity
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-cream-200 focus:border-brand-400 focus:ring-brand-100"
              } ${isViewMode ? "bg-cream-50 cursor-not-allowed" : ""}`}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock_quantity}
              </p>
            )}
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Low Stock Alert
            </label>
            <input
              type="number"
              name="low_stock_threshold"
              value={formData.low_stock_threshold}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="10"
              min="0"
              className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all ${
                isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* In Stock Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="in_stock"
            id="in_stock"
            checked={formData.in_stock}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-5 h-5 text-brand-600 border-cream-300 rounded focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="in_stock"
            className="text-sm font-medium text-charcoal-900"
          >
            Product is in stock and available for purchase
          </label>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-charcoal-900 border-b border-cream-200 pb-2">
          Product Details
        </h3>

        {/* Material & Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="e.g., 100% Silk"
              className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all ${
                isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-2">
              Color
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="e.g., Midnight Blue"
              className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all ${
                isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Available Sizes
          </label>
          {!isViewMode && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSize())
                }
                placeholder="e.g., S, M, L"
                className="flex-1 px-4 py-2 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                <RiAddLine className="text-xl" />
              </button>
            </div>
          )}
          {!isViewMode && (
            <div className="flex flex-wrap gap-2 mb-3">
              {commonSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (!formData.size.includes(size)) {
                      setFormData((prev) => ({
                        ...prev,
                        size: [...prev.size, size],
                      }));
                    }
                  }}
                  className="px-3 py-1 text-sm border border-cream-300 text-taupe-700 rounded-lg hover:bg-cream-100 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.size.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm"
              >
                {size}
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="hover:text-brand-900"
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
          {!isViewMode && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="e.g., trending, luxury, new-arrival"
                className="flex-1 px-4 py-2 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                <RiAddLine className="text-xl" />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 text-gold-700 rounded-lg text-sm"
              >
                {tag}
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-gold-900"
                  >
                    <RiCloseLine />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isViewMode}
            rows={4}
            placeholder="Detailed product description..."
            className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all resize-none ${
              isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-charcoal-900 border-b border-cream-200 pb-2">
          Product Images
        </h3>

        {/* Primary Image */}
        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Primary Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="https://example.com/image.jpg"
            className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all ${
              isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
            }`}
          />
          {formData.image && (
            <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden bg-cream-100">
              <Image
                src={formData.image}
                alt="Primary image preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Additional Images
          </label>
          {!isViewMode && (
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={currentImage}
                onChange={(e) => setCurrentImage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImage())
                }
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                <RiAddLine className="text-xl" />
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formData.images.map((img, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-cream-100">
                  <Image
                    src={img}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RiDeleteBinLine />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-charcoal-900 border-b border-cream-200 pb-2">
          SEO (Optional)
        </h3>

        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleChange}
            disabled={isViewMode}
            placeholder="SEO-optimized title"
            className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all ${
              isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-900 mb-2">
            Meta Description
          </label>
          <textarea
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            disabled={isViewMode}
            rows={3}
            placeholder="SEO-optimized description (150-160 characters)"
            className={`w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:border-brand-400 focus:ring-brand-100 transition-all resize-none ${
              isViewMode ? "bg-cream-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>

      {/* Form Actions */}
      {!isViewMode && (
        <div className="flex gap-3 pt-4 border-t border-cream-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-cream-300 text-charcoal-900 rounded-xl hover:bg-cream-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>{mode === "create" ? "Create Product" : "Update Product"}</>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
