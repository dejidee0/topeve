import { createClient } from "@/supabase/client";

export const supabase = createClient();

export const ordersAPI = {
  // =============== READ OPERATIONS ===============

  // Get all orders with optional filters
  async getAll(filters = {}) {
    try {
      let query = supabase.from("orders").select(`
          *,
          order_items (
            *,
            products (name, image, sku)
          )
        `);

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.paymentStatus) {
        query = query.eq("payment_status", filters.paymentStatus);
      }
      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }
      if (filters.search) {
        query = query.or(
          `order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`
        );
      }

      // Sorting
      const sortBy = filters.sortBy || "created_at";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      return { data: null, error };
    }
  },

  // Get single order by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            products (name, image, sku)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching order:", error);
      return { data: null, error };
    }
  },

  // Get order by order number
  async getByOrderNumber(orderNumber) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            products (name, image, sku)
          )
        `
        )
        .eq("order_number", orderNumber)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching order by number:", error);
      return { data: null, error };
    }
  },

  // =============== CREATE OPERATION ===============

  async create(orderData, orderItems) {
    try {
      // Start a transaction by creating order first
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Then create order items
      const itemsWithOrderId = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsWithOrderId)
        .select();

      if (itemsError) throw itemsError;

      console.log("✅ Order created successfully:", order.order_number);
      return { data: { ...order, order_items: items }, error: null };
    } catch (error) {
      console.error("❌ Error creating order:", error);
      return { data: null, error };
    }
  },

  // =============== UPDATE OPERATIONS ===============

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Order updated successfully:", id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error updating order:", error);
      return { data: null, error };
    }
  },

  // Update order status
  async updateStatus(id, status) {
    try {
      const updates = { status };

      // Add timestamps based on status
      if (status === "shipped") {
        updates.shipped_at = new Date().toISOString();
      } else if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      } else if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Order status updated:", id, status);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      return { data: null, error };
    }
  },

  // Update payment status
  async updatePaymentStatus(id, paymentStatus) {
    try {
      const updates = { payment_status: paymentStatus };

      if (paymentStatus === "paid") {
        updates.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Payment status updated:", id, paymentStatus);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      return { data: null, error };
    }
  },

  // =============== DELETE OPERATION ===============

  async delete(id) {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;
      console.log("✅ Order deleted:", id);
      return { data: true, error: null };
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      return { data: null, error };
    }
  },
};
