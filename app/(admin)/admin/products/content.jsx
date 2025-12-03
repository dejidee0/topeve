// app/admin/products/content.jsx
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
  RiRefreshLine,
} from "react-icons/ri";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { productsAPI } from "@/lib/products";
import Image from "next/image";
import ProductModal from "@/components/shared/admin/products/modal";
import DeleteConfirmModal from "@/components/shared/admin/products/delete-modal";

export default function ProductsPageContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    console.log("📦 Fetching products...");

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
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleRefresh = () => {
    fetchProducts(true);
  };

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
      fetchProducts(true);
    }

    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    if (shouldRefresh) {
      fetchProducts(true);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStockStatus =
      selectedStockStatus === "all" ||
      (selectedStockStatus === "in-stock" && product.in_stock) ||
      (selectedStockStatus === "low-stock" &&
        product.stock_quantity <= product.low_stock_threshold) ||
      (selectedStockStatus === "out-of-stock" && !product.in_stock);

    const matchesSubcategory =
      selectedSubcategory === "all" ||
      product.subcategory === selectedSubcategory;

    return matchesSearch && matchesStockStatus && matchesSubcategory;
  });

  const categories = [
    { value: "all", label: "All Products" },
    { value: "ready-to-wear", label: "Ready to Wear" },
    { value: "jewelry", label: "Jewelry" },
    { value: "accessories", label: "Accessories" },
    { value: "beauty-hair", label: "Beauty & Hair" },
    { value: "cosmetics", label: "Cosmetics" },
  ];

  const subcategories = [
    { value: "all", label: "All Subcategories" },
    { value: "women", label: "Women" },
    { value: "men", label: "Men" },
    { value: "kids", label: "Kids" },
    { value: "bridal-shower", label: "Bridal Shower" },
  ];

  const stockStatuses = [
    { value: "all", label: "All Stock Levels" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.in_stock).length,
    lowStock: products.filter(
      (p) => p.stock_quantity <= p.low_stock_threshold && p.in_stock
    ).length,
    totalValue: products.reduce(
      (sum, p) => sum + p.price * p.stock_quantity,
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand">
            Products
          </h1>
          <p className="text-charcoal/60 mt-1">
            Manage your product inventory and listings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 border border-taupe/30 text-brand rounded-xl hover:bg-taupe/10 transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RiRefreshLine
              className={`text-xl ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-6 py-3 bg-brand text-cream rounded-xl font-semibold hover:bg-gold hover:text-brand hover:shadow-lg transition-all duration-200"
          >
            <RiAddLine className="text-xl" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-taupe/20 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-charcoal/60 font-medium">
              Total Products
            </p>
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Package size={20} className="text-brand" />
            </div>
          </div>
          <p className="text-3xl font-bold text-brand">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl border border-taupe/20 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-charcoal/60 font-medium">In Stock</p>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
        </div>

        <div className="bg-white rounded-xl border border-taupe/20 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-charcoal/60 font-medium">Low Stock</p>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
          {stats.lowStock > 0 && (
            <p className="text-xs text-orange-600 mt-1">Needs restocking</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-taupe/20 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-charcoal/60 font-medium">Total Value</p>
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <DollarSign size={20} className="text-gold" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gold">
            {formatPrice(stats.totalValue)}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-taupe/20 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 text-xl" />
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white min-w-[180px]"
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
                  ? "bg-brand text-cream border-brand"
                  : "border-taupe/30 text-brand hover:bg-taupe/10"
              }`}
              title="Toggle filters"
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
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-taupe/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-2">
                      Stock Status
                    </label>
                    <select
                      value={selectedStockStatus}
                      onChange={(e) => setSelectedStockStatus(e.target.value)}
                      className="w-full px-4 py-2.5 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    >
                      {stockStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand mb-2">
                      Subcategory
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-taupe/30 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    >
                      {subcategories.map((sub) => (
                        <option key={sub.value} value={sub.value}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedStockStatus("all");
                        setSelectedSubcategory("all");
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      className="w-full px-4 py-2.5 border border-taupe/30 text-brand rounded-xl hover:bg-taupe/10 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Summary */}
        {(searchQuery ||
          selectedCategory !== "all" ||
          selectedStockStatus !== "all" ||
          selectedSubcategory !== "all") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-charcoal/60 font-medium">
              Active filters:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 text-brand rounded-lg text-sm">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-red-600"
                >
                  <RiCloseLine size={16} />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 text-brand rounded-lg text-sm capitalize">
                {selectedCategory.replace("-", " ")}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-red-600"
                >
                  <RiCloseLine size={16} />
                </button>
              </span>
            )}
            {selectedStockStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 text-brand rounded-lg text-sm">
                {
                  stockStatuses.find((s) => s.value === selectedStockStatus)
                    ?.label
                }
                <button
                  onClick={() => setSelectedStockStatus("all")}
                  className="hover:text-red-600"
                >
                  <RiCloseLine size={16} />
                </button>
              </span>
            )}
            {selectedSubcategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 text-brand rounded-lg text-sm capitalize">
                {selectedSubcategory.replace("-", " ")}
                <button
                  onClick={() => setSelectedSubcategory("all")}
                  className="hover:text-red-600"
                >
                  <RiCloseLine size={16} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-charcoal/60">
          <p>
            Showing{" "}
            <span className="font-semibold text-brand">
              {filteredProducts.length}
            </span>{" "}
            of <span className="font-semibold">{products.length}</span> products
          </p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-taupe/20 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-charcoal/60">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl font-semibold text-brand mb-2">
              No products found
            </p>
            <p className="text-charcoal/60 mb-6 max-w-md mx-auto">
              {searchQuery ||
              selectedCategory !== "all" ||
              selectedStockStatus !== "all" ||
              selectedSubcategory !== "all"
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Get started by adding your first product to the inventory"}
            </p>
            <button
              onClick={
                searchQuery ||
                selectedCategory !== "all" ||
                selectedStockStatus !== "all" ||
                selectedSubcategory !== "all"
                  ? () => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedStockStatus("all");
                      setSelectedSubcategory("all");
                    }
                  : handleCreateProduct
              }
              className="px-6 py-3 bg-brand text-cream rounded-xl hover:bg-gold hover:text-brand transition-all font-semibold shadow-md hover:shadow-lg"
            >
              {searchQuery ||
              selectedCategory !== "all" ||
              selectedStockStatus !== "all" ||
              selectedSubcategory !== "all"
                ? "Clear Filters"
                : "Add Your First Product"}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream border-b border-taupe/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-brand uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe/10">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream border border-taupe/20 flex-shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal/30 text-2xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand truncate max-w-xs">
                            {product.name}
                          </p>
                          {product.material && (
                            <p className="text-sm text-charcoal/60 truncate">
                              {product.material}
                            </p>
                          )}
                          {product.color && (
                            <p className="text-xs text-charcoal/50 capitalize mt-0.5">
                              {product.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-charcoal/70 bg-taupe/10 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm text-brand capitalize font-medium block">
                          {product.category.replace("-", " ")}
                        </span>
                        {product.subcategory && (
                          <span className="text-xs text-charcoal/60 capitalize">
                            {product.subcategory.replace("-", " ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-brand">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            product.stock_quantity <=
                            product.low_stock_threshold
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                        {product.stock_quantity <=
                          product.low_stock_threshold && (
                          <RiAlertLine
                            className="text-orange-500"
                            title="Low stock"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          product.in_stock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.in_stock ? (
                          <>
                            <RiCheckLine size={14} /> In Stock
                          </>
                        ) : (
                          <>
                            <RiCloseLine size={14} /> Out of Stock
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-charcoal/60 hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
                          title="View details"
                        >
                          <RiEyeLine className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-charcoal/60 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit product"
                        >
                          <RiEditLine className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-charcoal/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete product"
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
