import { StateCreator } from "zustand";
import { ProductState } from "@/lib/store.types";
import { createClient } from "@/utils/supabase/client";

export const createProductSlice: StateCreator<ProductState> = (set, get) => ({
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  isLoading: false,
  filters: {
    category: [],
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
  },

  setProducts: (products) => set({ products, filteredProducts: products }),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({
        products: data || [],
        filteredProducts: data || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      set({
        selectedProduct: data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      set({ isLoading: false });
    }
  },

  applyFilters: () => {
    const { products, filters } = get();
    let filtered = [...products];

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    }

    // Price range filter
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((color) => filters.colors.includes(color))
      );
    }

    set({ filteredProducts: filtered });
  },

  setFilter: (key: string, value: any) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
    get().applyFilters();
  },

  clearFilters: () => {
    set({
      filters: {
        category: [],
        priceRange: [0, 1000],
        sizes: [],
        colors: [],
      },
      filteredProducts: get().products,
    });
  },
});
