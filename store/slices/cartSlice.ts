import { StateCreator } from "zustand";
import { CartState, Product } from "@/lib/store.types";

export const createCartSlice: StateCreator<CartState> = (set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, size, color, quantity = 1) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += quantity;
      set({ items: newItems });
    } else {
      set({
        items: [
          ...items,
          {
            product,
            quantity,
            selectedSize: size,
            selectedColor: color,
          },
        ],
      });
    }

    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(get().items));
    }
  },

  removeItem: (productId, size, color) => {
    const items = get().items.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    set({ items });

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  },

  updateQuantity: (productId, size, color, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size, color);
      return;
    }

    const items = get().items.map((item) =>
      item.product.id === productId &&
      item.selectedSize === size &&
      item.selectedColor === color
        ? { ...item, quantity }
        : item
    );
    set({ items });

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  },

  clearCart: () => {
    set({ items: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },
});
