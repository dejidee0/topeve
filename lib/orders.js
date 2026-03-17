// lib/orders.js - Updated with correct schema
import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const supabase = createClient();

export const ordersAPI = {
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

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.payment_status) {
        query = query.eq("payment_status", filters.payment_status);
      }

      const sortBy = filters.sortBy || "created_at";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      return { data: null, error };
    }
  },

  // Create pending order (before payment)
  async createPending(orderData, orderItems) {
    try {
      // Ensure all required fields are present
      const completeOrderData = {
        ...orderData,
        payment_status: "pending",
        status: "pending",
        payment_method: orderData.payment_method || "paystack",
        currency: orderData.currency || "NGN",
        shipping_country: orderData.shipping_country || "Nigeria",
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([completeOrderData])
        .select()
        .single();

      if (orderError) {
        console.error("❌ Order creation error:", orderError);
        throw orderError;
      }

      const itemsWithOrderId = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsWithOrderId)
        .select();

      if (itemsError) {
        console.error("❌ Order items creation error:", itemsError);
        throw itemsError;
      }

      return { data: { ...order, order_items: items }, error: null };
    } catch (error) {
      console.error("❌ Error creating pending order:", error);
      return { data: null, error };
    }
  },

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
        `,
        )
        .eq("order_number", orderNumber)
        .single();

      if (error) {
        console.error("❌ Error fetching order:", error);
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error in getByOrderNumber:", error);
      return { data: null, error };
    }
  },

  async verifyPayment(reference) {
    try {
      const response = await fetch(
        `/api/verify-payment?reference=${reference}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error verifying payment:", error);
      return { success: false, error: error.message };
    }
  },

  async updateCustomerData(userId, customerData) {
    try {
      const { error } = await supabase
        .from("customers")
        .upsert({
          id: userId,
          ...customerData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("❌ Error updating customer:", error);
      return { success: false, error };
    }
  },
};

// React Query Hooks
export function useCreatePendingOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderData, orderItems }) =>
      ordersAPI.createPending(orderData, orderItems),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
    },
  });
}

export function useOrderByNumber(orderNumber) {
  return useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => ordersAPI.getByOrderNumber(orderNumber),
    enabled: !!orderNumber,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useVerifyPayment(reference) {
  return useQuery({
    queryKey: ["verify-payment", reference],
    queryFn: () => ordersAPI.verifyPayment(reference),
    enabled: !!reference,
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: (data) => {
      // Stop polling if payment is successful
      if (data?.success && data?.order?.payment_status === "paid") {
        return false;
      }
      // Poll every 3 seconds
      return 3000;
    },
  });
}
