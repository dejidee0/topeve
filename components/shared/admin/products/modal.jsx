// components/admin/ProductModal.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiSaveLine,
  RiImageAddLine,
  RiDeleteBinLine,
  RiImageLine,
} from "react-icons/ri";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { productsAPI } from "@/lib/products";
import Image from "next/image";
import { createClient } from "@/supabase/client";

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
    meta_title: "",
    meta_description: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const supabase = createClient();

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
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
      });
      setImagePreview(product.image || "");
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
        meta_title: "",
        meta_description: "",
      });
      setImagePreview("");
      setImageFile(null);
    }
    setErrors({});
  }, [product, mode, isOpen]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const generateSKU = () => {
    const category = formData.category.toUpperCase().slice(0, 3);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${category}-${random}`;
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
      meta_title: name, // Auto-generate meta title
    });
    if (errors.name) {
      setErrors({ ...errors, name: null });
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size must be less than 5MB" });
      return;
    }

    setImageFile(file);
    setErrors({ ...errors, image: null });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    setUploadingImage(true);
    console.log("📤 Uploading image to Supabase Storage...");

    try {
      // Generate unique filename
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("❌ Upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      console.log("✅ Image uploaded successfully:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      setErrors({ ...errors, image: "Failed to upload image" });
      return formData.image; // Return existing image on error
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (
      formData.image &&
      formData.image.includes("supabase") &&
      confirm("Are you sure you want to remove this image?")
    ) {
      try {
        // Extract file path from URL
        const url = new URL(formData.image);
        const pathParts = url.pathname.split("/");
        const filePath = pathParts[pathParts.length - 1];

        // Delete from Supabase Storage
        await supabase.storage.from("product-images").remove([filePath]);

        console.log("🗑️ Image deleted from storage");
      } catch (error) {
        console.error("❌ Error deleting image:", error);
      }
    }

    setFormData({ ...formData, image: "" });
    setImagePreview("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0)
      newErrors.stock_quantity = "Valid stock quantity is required";
    if (!imagePreview && !formData.image)
      newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.warn("⚠️ Form validation failed");
      return;
    }

    setLoading(true);
    console.log(
      `${mode === "create" ? "📝 Creating" : "✏️ Updating"} product...`
    );

    try {
      // Upload image if new file selected
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }

      // Convert price from naira to kobo
      const productData = {
        ...formData,
        image: imageUrl,
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

      if (result.error) {
        console.error("❌ Error:", result.error);
        throw new Error(result.error.message);
      }

      console.log("✅ Product saved successfully!");
      onClose(true); // true means refresh the list
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`Failed to ${mode} product: ${error.message}`);
    } finally {
      setLoading(false);
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
            onClick={() => !loading && onClose(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-taupe/20 bg-cream">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-brand">
                      {mode === "create" && "Add New Product"}
                      {mode === "edit" && "Edit Product"}
                      {mode === "view" && "Product Details"}
                    </h2>
                    <p className="text-sm text-charcoal/60 mt-1">
                      {mode === "create" &&
                        "Fill in the details to add a new product"}
                      {mode === "edit" && "Update product information"}
                      {mode === "view" && "View product details"}
                    </p>
                  </div>
                  <button
                    onClick={() => !loading && onClose(false)}
                    disabled={loading}
                    className="p-2 hover:bg-taupe/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RiCloseLine className="text-2xl text-brand" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-2">
                    {/* Left Column - Image Upload */}
                    <div className="lg:col-span-1 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand mb-3">
                          Product Image *
                        </label>

                        {/* Image Preview */}
                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-cream border-2 border-dashed border-taupe/30 mb-3">
                          {imagePreview || formData.image ? (
                            <>
                              <Image
                                src={imagePreview || formData.image}
                                alt="Product preview"
                                fill
                                className="object-cover"
                              />
                              {!isViewMode && (
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                >
                                  <RiDeleteBinLine className="text-lg" />
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-charcoal/40">
                              <RiImageLine className="text-6xl mb-2" />
                              <p className="text-sm">No image uploaded</p>
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        {!isViewMode && (
                          <>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-cream rounded-xl hover:bg-gold hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="animate-spin" size={20} />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={20} />
                                  <span>
                                    {imagePreview || formData.image
                                      ? "Change Image"
                                      : "Upload Image"}
                                  </span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {errors.image && (
                          <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{errors.image}</span>
                          </div>
                        )}

                        <p className="text-xs text-charcoal/50 mt-2">
                          Recommended: 600x800px, max 5MB
                        </p>
                      </div>

                      {/* Stock Status */}
                      <div className="p-4 bg-cream rounded-xl border border-taupe/20">
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
                            className="w-5 h-5 text-brand border-taupe/30 rounded focus:ring-gold disabled:opacity-50"
                          />
                          <div>
                            <span className="text-sm font-semibold text-brand block">
                              Product is in stock
                            </span>
                            <span className="text-xs text-charcoal/60">
                              Customers can purchase this product
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-brand mb-4 pb-2 border-b border-taupe/20">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Product Name */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Product Name *
                            </label>
                            <input
                              type="text"
                              required
                              disabled={isViewMode}
                              value={formData.name}
                              onChange={handleNameChange}
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors ${
                                errors.name
                                  ? "border-red-300 bg-red-50"
                                  : "border-taupe/30"
                              }`}
                              placeholder="e.g., Elegant Evening Dress"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.name}
                              </p>
                            )}
                          </div>

                          {/* SKU */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              SKU *
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required
                                disabled={isViewMode}
                                value={formData.sku}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    sku: e.target.value.toUpperCase(),
                                  })
                                }
                                className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors font-mono ${
                                  errors.sku
                                    ? "border-red-300 bg-red-50"
                                    : "border-taupe/30"
                                }`}
                                placeholder="REA-ABC123"
                              />
                              {!isViewMode && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      sku: generateSKU(),
                                    })
                                  }
                                  className="px-4 py-3 bg-taupe/10 text-brand rounded-xl hover:bg-taupe/20 transition-colors text-sm font-medium"
                                >
                                  Generate
                                </button>
                              )}
                            </div>
                            {errors.sku && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.sku}
                              </p>
                            )}
                          </div>

                          {/* Slug */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Slug *
                            </label>
                            <input
                              type="text"
                              required
                              disabled={isViewMode}
                              value={formData.slug}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  slug: e.target.value,
                                })
                              }
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors font-mono text-sm ${
                                errors.slug
                                  ? "border-red-300 bg-red-50"
                                  : "border-taupe/30"
                              }`}
                              placeholder="elegant-evening-dress"
                            />
                            {errors.slug && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.slug}
                              </p>
                            )}
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Category *
                            </label>
                            <select
                              required
                              disabled={isViewMode}
                              value={formData.category}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  category: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors"
                            >
                              <option value="ready-to-wear">
                                Ready to Wear
                              </option>
                              <option value="jewelry">Jewelry</option>
                              <option value="accessories">Accessories</option>
                              <option value="beauty-hair">Beauty & Hair</option>
                              <option value="cosmetics">Cosmetics</option>
                            </select>
                          </div>

                          {/* Subcategory */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
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
                              className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors"
                            >
                              <option value="">None</option>
                              <option value="women">Women</option>
                              <option value="men">Men</option>
                              <option value="kids">Kids</option>
                              <option value="bridal-shower">
                                Bridal Shower
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Inventory */}
                      <div>
                        <h3 className="text-lg font-semibold text-brand mb-4 pb-2 border-b border-taupe/20">
                          Pricing & Inventory
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Price */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Price (₦) *
                            </label>
                            <input
                              type="number"
                              required
                              disabled={isViewMode}
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: e.target.value,
                                })
                              }
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors ${
                                errors.price
                                  ? "border-red-300 bg-red-50"
                                  : "border-taupe/30"
                              }`}
                              placeholder="85000"
                              step="0.01"
                              min="0"
                            />
                            {errors.price && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.price}
                              </p>
                            )}
                          </div>

                          {/* Stock Quantity */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
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
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors ${
                                errors.stock_quantity
                                  ? "border-red-300 bg-red-50"
                                  : "border-taupe/30"
                              }`}
                              placeholder="50"
                              min="0"
                            />
                            {errors.stock_quantity && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.stock_quantity}
                              </p>
                            )}
                          </div>

                          {/* Low Stock Alert */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
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
                              className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors"
                              placeholder="10"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Attributes */}
                      <div>
                        <h3 className="text-lg font-semibold text-brand mb-4 pb-2 border-b border-taupe/20">
                          Product Attributes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Color */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Color
                            </label>
                            <input
                              type="text"
                              disabled={isViewMode}
                              value={formData.color}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  color: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors"
                              placeholder="e.g., Navy Blue"
                            />
                          </div>

                          {/* Material */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Material
                            </label>
                            <input
                              type="text"
                              disabled={isViewMode}
                              value={formData.material}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  material: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors"
                              placeholder="e.g., Cotton, Silk"
                            />
                          </div>

                          {/* Sizes */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Available Sizes
                            </label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                disabled={isViewMode}
                                value={sizeInput}
                                onChange={(e) => setSizeInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSize();
                                  }
                                }}
                                className="flex-1 px-4 py-2.5 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 text-sm"
                                placeholder="e.g., S, M, L, XL"
                              />
                              {!isViewMode && (
                                <button
                                  type="button"
                                  onClick={handleAddSize}
                                  className="px-4 py-2.5 bg-brand text-cream rounded-xl hover:bg-gold hover:text-brand transition-colors text-sm font-medium"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.size.map((size) => (
                                <span
                                  key={size}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-cream text-brand rounded-lg text-sm font-medium border border-taupe/20"
                                >
                                  {size}
                                  {!isViewMode && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSize(size)}
                                      className="hover:text-red-600 transition-colors"
                                    >
                                      <RiCloseLine size={16} />
                                    </button>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <label className="block text-sm font-medium text-charcoal/80 mb-2">
                              Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                disabled={isViewMode}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTag();
                                  }
                                }}
                                className="flex-1 px-4 py-2.5 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-taupe/10 text-sm"
                                placeholder="e.g., new, trending"
                              />
                              {!isViewMode && (
                                <button
                                  type="button"
                                  onClick={handleAddTag}
                                  className="px-4 py-2.5 bg-brand text-cream rounded-xl hover:bg-gold hover:text-brand transition-colors text-sm font-medium"
                                >
                                  Add
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/20 text-brand rounded-lg text-sm font-medium"
                                >
                                  {tag}
                                  {!isViewMode && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTag(tag)}
                                      className="hover:text-red-600 transition-colors"
                                    >
                                      <RiCloseLine size={16} />
                                    </button>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-brand mb-4 pb-2 border-b border-taupe/20">
                          Description
                        </h3>
                        <textarea
                          disabled={isViewMode}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows={5}
                          className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none disabled:bg-taupe/10 disabled:cursor-not-allowed transition-colors"
                          placeholder="Enter detailed product description..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  {!isViewMode && (
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-taupe/20">
                      <button
                        type="button"
                        onClick={() => onClose(false)}
                        disabled={loading || uploadingImage}
                        className="px-6 py-3 border border-taupe/30 text-brand rounded-xl hover:bg-taupe/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || uploadingImage}
                        className="flex items-center gap-2 px-6 py-3 bg-brand text-cream rounded-xl hover:bg-gold hover:text-brand transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
                      >
                        {loading || uploadingImage ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>
                              {uploadingImage ? "Uploading..." : "Saving..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <RiSaveLine size={20} />
                            <span>
                              {mode === "create"
                                ? "Create Product"
                                : "Save Changes"}
                            </span>
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
