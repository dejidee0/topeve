import { createClient } from "@/supabase/client";

const supabase = createClient();
export const productsAPI = {
  // =============== READ OPERATIONS ===============

  // Get all products with optional filters
  async getAll(filters = {}) {
    try {
      let query = supabase.from("products").select("*").is("deleted_at", null);

      // Apply filters
      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.subcategory) {
        query = query.eq("subcategory", filters.subcategory);
      }
      if (filters.inStock !== undefined) {
        query = query.eq("in_stock", filters.inStock);
      }
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || "created_at";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      return { data: null, error };
    }
  },

  // Get single product by ID
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      return { data: null, error };
    }
  },

  // Get product by slug
  async getBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .is("deleted_at", null)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching product by slug:", error);
      return { data: null, error };
    }
  },

  // Get product analytics
  async getAnalytics() {
    try {
      const { data, error } = await supabase
        .from("product_analytics")
        .select("*")
        .order("total_orders", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching product analytics:", error);
      return { data: null, error };
    }
  },

  // Get low stock products
  async getLowStock() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lte("stock_quantity", supabase.raw("low_stock_threshold"))
        .is("deleted_at", null)
        .order("stock_quantity", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error fetching low stock products:", error);
      return { data: null, error };
    }
  },

  // =============== CREATE OPERATION ===============

  async create(productData) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Product created successfully:", data.id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error creating product:", error);
      return { data: null, error };
    }
  },

  // =============== UPDATE OPERATION ===============

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Product updated successfully:", id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error updating product:", error);
      return { data: null, error };
    }
  },

  // Update stock quantity
  async updateStock(id, quantity) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ stock_quantity: quantity })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Stock updated successfully:", id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error updating stock:", error);
      return { data: null, error };
    }
  },

  // Increment view count
  async incrementViews(id) {
    try {
      const { data, error } = await supabase.rpc("increment_views", {
        product_id: id,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error incrementing views:", error);
      return { data: null, error };
    }
  },

  // =============== DELETE OPERATIONS ===============

  // Soft delete
  async softDelete(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Product soft deleted:", id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error soft deleting product:", error);
      return { data: null, error };
    }
  },

  // Hard delete (permanent)
  async hardDelete(id) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      console.log("✅ Product permanently deleted:", id);
      return { data: true, error: null };
    } catch (error) {
      console.error("❌ Error permanently deleting product:", error);
      return { data: null, error };
    }
  },

  // Restore soft deleted product
  async restore(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ deleted_at: null })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("✅ Product restored:", id);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error restoring product:", error);
      return { data: null, error };
    }
  },

  // =============== BULK OPERATIONS ===============

  async bulkCreate(productsArray) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productsArray)
        .select();

      if (error) throw error;
      console.log(`✅ ${data.length} products created successfully`);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error bulk creating products:", error);
      return { data: null, error };
    }
  },

  async bulkDelete(ids) {
    try {
      const { error } = await supabase
        .from("products")
        .update({ deleted_at: new Date().toISOString() })
        .in("id", ids);

      if (error) throw error;
      console.log(`✅ ${ids.length} products deleted successfully`);
      return { data: true, error: null };
    } catch (error) {
      console.error("❌ Error bulk deleting products:", error);
      return { data: null, error };
    }
  },
};
