import { createClient } from "@/supabase/client";

const supabase = createClient();
export const customersAPI = {
  // =============== READ OPERATIONS ===============

  // Get all customers with optional filters
  async getAll(filters = {}) {
    try {
      let query = supabase.from("customers").select(`
          *,
          orders (
            id,
            total,
            status,
            created_at
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(
          `email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`
        );
      }

      if (filters.city) {
        query = query.eq("city", filters.city);
      }

      if (filters.state) {
        query = query.eq("state", filters.state);
      }

      // Sorting
      const sortBy = filters.sortBy || "created_at";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error } = await query;

      if (error) throw error;

      // Calculate customer metrics
      const customersWithMetrics = data.map((customer) => ({
        ...customer,
        total_orders: customer.orders?.length || 0,
        total_spent:
          customer.orders?.reduce(
            (sum, order) =>
              order.status !== "cancelled" ? sum + order.total : sum,
            0
          ) || 0,
        last_order: customer.orders?.[0]?.created_at || null,
      }));

      return { data: customersWithMetrics, error: null };
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      return { data: null, error };
    }
  },

  // Get single customer by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          *,
          orders (
            id,
            order_number,
            total,
            status,
            payment_status,
            created_at
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      // Calculate metrics
      const customerWithMetrics = {
        ...data,
        total_orders: data.orders?.length || 0,
        total_spent:
          data.orders?.reduce(
            (sum, order) =>
              order.status !== "cancelled" ? sum + order.total : sum,
            0
          ) || 0,
        average_order_value:
          data.orders?.length > 0
            ? data.orders.reduce((sum, order) => sum + order.total, 0) /
              data.orders.length
            : 0,
      };

      return { data: customerWithMetrics, error: null };
    } catch (error) {
      console.error("❌ Error fetching customer:", error);
      return { data: null, error };
    }
  },

  // Get customer statistics
  async getStats() {
    try {
      // Total customers
      const { count: totalCustomers, error: countError } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      // New customers (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newCustomers, error: newError } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (newError) throw newError;

      // Customers with orders
      const { data: customersWithOrders, error: ordersError } = await supabase
        .from("customers")
        .select("id, orders!inner(id)")
        .limit(1000);

      if (ordersError) throw ordersError;

      const activeCustomers = new Set(customersWithOrders.map((c) => c.id))
        .size;

      return {
        data: {
          total: totalCustomers,
          new: newCustomers,
          active: activeCustomers,
          inactive: totalCustomers - activeCustomers,
        },
        error: null,
      };
    } catch (error) {
      console.error("❌ Error fetching customer stats:", error);
      return { data: null, error };
    }
  },

  // Get top customers by spending
  async getTopCustomers(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          *,
          orders (
            total,
            status
          )
        `
        )
        .limit(1000);

      if (error) throw error;

      // Calculate total spent and sort
      const customersWithSpending = data
        .map((customer) => ({
          ...customer,
          total_spent:
            customer.orders?.reduce(
              (sum, order) =>
                order.status !== "cancelled" ? sum + order.total : sum,
              0
            ) || 0,
          total_orders: customer.orders?.length || 0,
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, limit);

      return { data: customersWithSpending, error: null };
    } catch (error) {
      console.error("❌ Error fetching top customers:", error);
      return { data: null, error };
    }
  },

  // =============== CREATE OPERATION ===============

  async create(customerData) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Customer created successfully:", data.id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error creating customer:", error);
      return { data: null, error };
    }
  },

  // =============== UPDATE OPERATION ===============

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Customer updated successfully:", id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error updating customer:", error);
      return { data: null, error };
    }
  },

  // =============== DELETE OPERATION ===============

  async delete(id) {
    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;
      console.log("✅ Customer deleted:", id);
      return { data: true, error: null };
    } catch (error) {
      console.error("❌ Error deleting customer:", error);
      return { data: null, error };
    }
  },

  // =============== ANALYTICS OPERATIONS ===============

  // Get customer growth over time
  async getGrowthData(months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const { data, error } = await supabase
        .from("customers")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by month
      const monthlyData = {};
      data.forEach((customer) => {
        const month = new Date(customer.created_at).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
          }
        );
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      return { data: monthlyData, error: null };
    } catch (error) {
      console.error("❌ Error fetching growth data:", error);
      return { data: null, error };
    }
  },

  // Get customers by location
  async getByLocation() {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("city, state")
        .not("city", "is", null);

      if (error) throw error;

      // Group by location
      const locationData = {};
      data.forEach((customer) => {
        const location = `${customer.city}, ${customer.state}`;
        locationData[location] = (locationData[location] || 0) + 1;
      });

      return { data: locationData, error: null };
    } catch (error) {
      console.error("❌ Error fetching location data:", error);
      return { data: null, error };
    }
  },
};
