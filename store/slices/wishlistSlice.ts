import { StateCreator } from "zustand";
import { WishlistState, Product } from "@/lib/store.types";

export const createWishlistSlice: StateCreator<WishlistState> = (set, get) => ({
  wishlistItems: [], // Changed from items to wishlistItems

  addItem: (product) => {
    const wishlistItems = get().wishlistItems;
    if (!wishlistItems.find((item) => item.id === product.id)) {
      const newItems = [...wishlistItems, product];
      set({ wishlistItems: newItems }); // Updated to use wishlistItems

      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(newItems));
      }
    }
  },

  removeItem: (productId) => {
    const newItems = get().wishlistItems.filter(
      (item) => item.id !== productId
    );
    set({ wishlistItems: newItems }); // Updated to use wishlistItems

    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(newItems));
    }
  },

  isInWishlist: (productId) => {
    return get().wishlistItems.some((item) => item.id === productId);
  },

  clearWishlist: () => {
    set({ wishlistItems: [] }); // Updated to use wishlistItems
    if (typeof window !== "undefined") {
      localStorage.removeItem("wishlist");
    }
  },
});
