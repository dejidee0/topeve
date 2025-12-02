"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiAddLine,
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiFilterLine,
  RiCloseLine,
  RiCheckLine,
  RiAlertLine,
} from "react-icons/ri";
import { productsAPI } from "@/lib/products";
import Image from "next/image";
import ProductModal from "@/components/shared/admin/products/modal";
import DeleteConfirmModal from "@/components/shared/admin/products/delete-modal";

export default function ProductsPageContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    console.log("📦 Fetching products...");
    setLoading(true);

    const filters = {};
    if (selectedCategory !== "all") {
      filters.category = selectedCategory;
    }

    const { data, error } = await productsAPI.getAll(filters);

    if (error) {
      console.error("❌ Error fetching products:", error);
    } else {
      setProducts(data || []);
      console.log(`✅ Loaded ${data?.length || 0} products`);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    console.log("🗑️ Deleting product:", productToDelete.id);
    const { error } = await productsAPI.softDelete(productToDelete.id);

    if (error) {
      console.error("❌ Error deleting product:", error);
      alert("Failed to delete product");
    } else {
      console.log("✅ Product deleted successfully");
      fetchProducts();
    }

    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    if (shouldRefresh) {
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const categories = [
    { value: "all", label: "All Products" },
    { value: "ready-to-wear", label: "Ready to Wear" },
    { value: "jewelry", label: "Jewelry" },
    { value: "accessories", label: "Accessories" },
    { value: "beauty-hair", label: "Beauty & Hair" },
    { value: "cosmetics", label: "Cosmetics" },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-charcoal-900">
            Products
          </h1>
          <p className="text-taupe-600 mt-1">
            Manage your product inventory and listings
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <RiAddLine className="text-xl" />
          Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500 text-xl" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border transition-all ${
                showFilters
                  ? "bg-brand-50 border-brand-300 text-brand-700"
                  : "border-cream-200 text-taupe-700 hover:bg-cream-50"
              }`}
            >
              <RiFilterLine className="text-xl" />
            </button>
          </div>
        </div>

        {/* Advanced Filters (Collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-cream-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Stock Status
                  </label>
                  <select className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400">
                    <option value="all">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Subcategory
                  </label>
                  <select className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-brand-400">
                    <option value="all">All</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm text-taupe-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-charcoal-900">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm text-taupe-600 mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.in_stock).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm text-taupe-600 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-orange-600">
            {
              products.filter((p) => p.stock_quantity <= p.low_stock_threshold)
                .length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm text-taupe-600 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-brand-600">
            {formatPrice(
              products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0)
            )}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-lg font-medium text-charcoal-900 mb-2">
              No products found
            </p>
            <p className="text-taupe-600 mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateProduct}
                className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-charcoal-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-cream-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-taupe-400">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-charcoal-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-taupe-600 truncate">
                            {product.material}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-taupe-700">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-charcoal-900 capitalize">
                        {product.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-charcoal-900">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-charcoal-900">
                          {product.stock_quantity}
                        </span>
                        {product.stock_quantity <=
                          product.low_stock_threshold && (
                          <RiAlertLine className="text-orange-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          product.in_stock
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.in_stock ? (
                          <>
                            <RiCheckLine /> In Stock
                          </>
                        ) : (
                          <>
                            <RiCloseLine /> Out of Stock
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-taupe-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                          title="View"
                        >
                          <RiEyeLine className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-taupe-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <RiEditLine className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-taupe-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <RiDeleteBinLine className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        productName={productToDelete?.name}
      />
    </div>
  );
}
