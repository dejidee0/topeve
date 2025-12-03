// app/admin/dashboard/content.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { productsAPI } from "@/lib/products";
import { ordersAPI } from "@/lib/orders";
import { customersAPI } from "@/lib/customers";
import Link from "next/link";

const COLORS = ["#2C1810", "#D4AF7F", "#C9B8A8", "#FAF7F2", "#3A3A3A"];

export default function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days"); // 7days, 30days, 90days
  const [stats, setStats] = useState({
    revenue: {
      total: 0,
      change: 0,
      trend: "up",
    },
    orders: {
      total: 0,
      change: 0,
      trend: "up",
    },
    customers: {
      total: 0,
      change: 0,
      trend: "up",
    },
    conversion: {
      rate: 0,
      change: 0,
      trend: "down",
    },
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    console.log("📊 Fetching dashboard data...");

    try {
      // Fetch products
      const { data: products } = await productsAPI.getAll();

      // Fetch orders
      const { data: orders } = await ordersAPI.getAll({
        sortBy: "created_at",
        sortOrder: "desc",
        limit: 100,
      });

      // Fetch customers
      const { data: customerStats } = await customersAPI.getStats();

      // Calculate stats
      const now = new Date();
      const daysAgo =
        timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
      const startDate = subDays(now, daysAgo);

      const recentOrders =
        orders?.filter((o) => new Date(o.created_at) >= startDate) || [];

      const previousPeriodOrders =
        orders?.filter((o) => {
          const orderDate = new Date(o.created_at);
          return (
            orderDate >= subDays(startDate, daysAgo) && orderDate < startDate
          );
        }) || [];

      // Revenue calculations
      const totalRevenue = recentOrders
        .filter((o) => o.payment_status === "paid")
        .reduce((sum, o) => sum + o.total, 0);

      const previousRevenue = previousPeriodOrders
        .filter((o) => o.payment_status === "paid")
        .reduce((sum, o) => sum + o.total, 0);

      const revenueChange =
        previousRevenue > 0
          ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
          : 100;

      // Orders calculations
      const totalOrders = recentOrders.length;
      const previousOrders = previousPeriodOrders.length;
      const ordersChange =
        previousOrders > 0
          ? ((totalOrders - previousOrders) / previousOrders) * 100
          : 100;

      // Customers calculations
      const totalCustomers = customerStats?.total || 0;
      const newCustomers = customerStats?.new || 0;
      const customersChange =
        totalCustomers > 0 ? (newCustomers / totalCustomers) * 100 : 0;

      // Update stats
      setStats({
        revenue: {
          total: totalRevenue,
          change: revenueChange,
          trend: revenueChange >= 0 ? "up" : "down",
        },
        orders: {
          total: totalOrders,
          change: ordersChange,
          trend: ordersChange >= 0 ? "up" : "down",
        },
        customers: {
          total: totalCustomers,
          change: customersChange,
          trend: customersChange >= 0 ? "up" : "down",
        },
        conversion: {
          rate: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0,
          change: -2.1,
          trend: "down",
        },
      });

      // Generate revenue data for chart
      const revenueByDay = {};
      for (let i = 0; i < daysAgo; i++) {
        const date = subDays(now, daysAgo - i - 1);
        const dateStr = format(date, "MMM dd");
        revenueByDay[dateStr] = 0;
      }

      recentOrders.forEach((order) => {
        if (order.payment_status === "paid") {
          const dateStr = format(new Date(order.created_at), "MMM dd");
          if (revenueByDay[dateStr] !== undefined) {
            revenueByDay[dateStr] += order.total / 100; // Convert to NGN
          }
        }
      });

      const revenueChartData = Object.entries(revenueByDay).map(
        ([date, revenue]) => ({
          date,
          revenue: Math.round(revenue),
          orders: recentOrders.filter(
            (o) => format(new Date(o.created_at), "MMM dd") === date
          ).length,
        })
      );

      setRevenueData(revenueChartData);

      // Category distribution
      const categoryCount = {};
      products?.forEach((p) => {
        const cat = p.category || "Uncategorized";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });

      const categoryChartData = Object.entries(categoryCount).map(
        ([name, value]) => ({
          name: name
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          value,
        })
      );

      setCategoryData(categoryChartData);

      // Top products (by stock value)
      const sortedProducts = products
        ?.map((p) => ({
          ...p,
          value: (p.price / 100) * p.stock_quantity,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setTopProducts(sortedProducts || []);

      // Recent orders
      setRecentOrders(orders?.slice(0, 5) || []);

      // Low stock products
      const lowStock = products
        ?.filter((p) => p.stock_quantity <= p.low_stock_threshold)
        .sort((a, b) => a.stock_quantity - b.stock_quantity)
        .slice(0, 5);

      setLowStockProducts(lowStock || []);

      console.log("✅ Dashboard data loaded");
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-taupe/20 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <p className="text-charcoal/60 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-brand">{value}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand mb-2">
            Dashboard
          </h1>
          <p className="text-charcoal/60">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-taupe/20">
          {[
            { value: "7days", label: "7 Days" },
            { value: "30days", label: "30 Days" },
            { value: "90days", label: "90 Days" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range.value
                  ? "bg-brand text-cream"
                  : "text-charcoal/60 hover:bg-taupe/10"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.revenue.total)}
          change={stats.revenue.change}
          trend={stats.revenue.trend}
          icon={DollarSign}
          color="bg-gradient-to-br from-brand to-gold"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.total.toLocaleString()}
          change={stats.orders.change}
          trend={stats.orders.trend}
          icon={ShoppingCart}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.customers.total.toLocaleString()}
          change={stats.customers.change}
          trend={stats.customers.trend}
          icon={Users}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversion.rate.toFixed(2)}%`}
          change={stats.conversion.change}
          trend={stats.conversion.trend}
          icon={TrendingUp}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-taupe/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-brand">
                Revenue Overview
              </h2>
              <p className="text-sm text-charcoal/60 mt-1">
                Daily revenue and order trends
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2C1810" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2C1810" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `₦${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => [
                  name === "revenue" ? `₦${value.toLocaleString()}` : value,
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2C1810"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-taupe/20 shadow-sm">
          <h2 className="text-xl font-heading font-bold text-brand mb-6">
            Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products and Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-taupe/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-brand">
                Top Products
              </h2>
              <p className="text-sm text-charcoal/60 mt-1">
                By inventory value
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-brand hover:text-gold transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-charcoal/60">
                    Stock: {product.stock_quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand">
                    {formatPrice(product.value * 100)}
                  </p>
                  <p className="text-sm text-charcoal/60">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-taupe/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-brand">
                Recent Orders
              </h2>
              <p className="text-sm text-charcoal/60 mt-1">
                Latest customer orders
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-brand hover:text-gold transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-cream/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand font-mono text-sm">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-charcoal/60">
                    {format(new Date(order.created_at), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand">
                    {formatPrice(order.total)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-heading font-bold text-orange-900 mb-2">
                Low Stock Alert
              </h2>
              <p className="text-orange-700 mb-4">
                {lowStockProducts.length} products are running low on stock
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl p-3 border border-orange-200"
                  >
                    <p className="font-semibold text-brand text-sm truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-charcoal/60">
                        Stock: {product.stock_quantity}
                      </span>
                      <span className="text-xs font-semibold text-orange-600">
                        Low
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold text-sm"
              >
                Manage Inventory
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-taupe/20 shadow-sm">
        <h2 className="text-xl font-heading font-bold text-brand mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/products"
            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-cream/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:scale-110 transition-all">
              <Package
                size={24}
                className="text-brand group-hover:text-cream transition-colors"
              />
            </div>
            <span className="text-sm font-semibold text-brand text-center">
              Manage Products
            </span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-cream/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all">
              <ShoppingCart
                size={24}
                className="text-gold group-hover:text-cream transition-colors"
              />
            </div>
            <span className="text-sm font-semibold text-brand text-center">
              View Orders
            </span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-cream/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all">
              <Users
                size={24}
                className="text-green-600 group-hover:text-white transition-colors"
              />
            </div>
            <span className="text-sm font-semibold text-brand text-center">
              Customers
            </span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-cream/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all">
              <Eye
                size={24}
                className="text-purple-600 group-hover:text-white transition-colors"
              />
            </div>
            <span className="text-sm font-semibold text-brand text-center">
              Analytics
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
