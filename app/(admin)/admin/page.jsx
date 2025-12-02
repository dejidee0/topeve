export const metadata = {
  title: "Dashboard - Topeve Admin",
  description: "Overview of your Topeve store performance",
};

export default function AdminDashboardPage() {
  console.log("📊 Admin dashboard page loaded");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-charcoal-900 mb-2">
          Dashboard
        </h1>
        <p className="text-taupe-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center">
              <span className="text-white text-2xl">₦</span>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <p className="text-taupe-600 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-charcoal-900">₦2,456,000</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-white text-xl">📦</span>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +8.2%
            </span>
          </div>
          <p className="text-taupe-600 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-charcoal-900">1,247</p>
        </div>

        {/* Active Customers */}
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +15.3%
            </span>
          </div>
          <p className="text-taupe-600 text-sm mb-1">Active Customers</p>
          <p className="text-2xl font-bold text-charcoal-900">8,542</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-taupe-400 to-taupe-600 flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
              -2.1%
            </span>
          </div>
          <p className="text-taupe-600 text-sm mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-charcoal-900">3.24%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-cream-200">
        <h2 className="text-xl font-playfair font-bold text-charcoal-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-cream-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-2xl">
              ➕
            </div>
            <span className="text-sm font-medium text-charcoal-900">
              Add Product
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-cream-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center text-2xl">
              📋
            </div>
            <span className="text-sm font-medium text-charcoal-900">
              View Orders
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-cream-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-taupe-100 flex items-center justify-center text-2xl">
              👤
            </div>
            <span className="text-sm font-medium text-charcoal-900">
              Customers
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-cream-50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cream-200 flex items-center justify-center text-2xl">
              📊
            </div>
            <span className="text-sm font-medium text-charcoal-900">
              Analytics
            </span>
          </button>
        </div>
      </div>

      {/* Recent Orders Table Placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-cream-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-playfair font-bold text-charcoal-900">
            Recent Orders
          </h2>
          <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </button>
        </div>
        <div className="text-center py-12 text-taupe-600">
          <p className="text-4xl mb-2">📦</p>
          <p>Order management table will appear here</p>
        </div>
      </div>
    </div>
  );
}
