// lib/store/wishlistStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  incrementProductFavorites,
  decrementProductFavorites,
} from "@/utils/products";

/**
 * Wishlist Store
 * Manages wishlist/favorites with localStorage persistence
 */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // =====================================================
      // STATE
      // =====================================================
      items: [],

      // =====================================================
      // COMPUTED VALUES
      // =====================================================

      /**
       * Get total number of items in wishlist
       */
      getTotalItems: () => {
        const { items } = get();
        return items.length;
      },

      /**
       * Check if product is in wishlist
       */
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      /**
       * Get wishlist item
       */
      getWishlistItem: (productId) => {
        const { items } = get();
        return items.find((item) => item.id === productId);
      },

      // =====================================================
      // ACTIONS
      // =====================================================

      /**
       * Add item to wishlist
       * @param {Object} product - Product object
       */
      addItem: async (product) => {
        const { items, isInWishlist } = get();

        // Check if already in wishlist
        if (isInWishlist(product.id)) {
          console.log(`💝 Product already in wishlist: ${product.name}`);
          return;
        }

        const newItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          currency: product.currency || "NGN",
          image: product.image,
          category: product.category,
          subcategory: product.subcategory,
          inStock: product.in_stock ?? product.inStock ?? true,
          addedAt: new Date().toISOString(),
        };

        set({ items: [...items, newItem] });
        console.log(`💝 Added to wishlist: ${product.name}`);

        // Increment favorites count in database
        await incrementProductFavorites(product.id);
      },

      /**
       * Remove item from wishlist
       */
      removeItem: async (productId) => {
        const { items } = get();

        const updatedItems = items.filter((item) => item.id !== productId);

        set({ items: updatedItems });
        console.log(`💔 Removed from wishlist: ${productId}`);

        // Decrement favorites count in database
        await decrementProductFavorites(productId);
      },

      /**
       * Toggle item in wishlist
       */
      toggleItem: async (product) => {
        const { isInWishlist, addItem, removeItem } = get();

        if (isInWishlist(product.id)) {
          await removeItem(product.id);
        } else {
          await addItem(product);
        }
      },

      /**
       * Clear entire wishlist
       */
      clearWishlist: () => {
        set({ items: [] });
        console.log("💔 Wishlist cleared");
      },

      /**
       * Move item from wishlist to cart
       */
      moveToCart: (productId, addToCart) => {
        const { items, removeItem } = get();
        const item = items.find((item) => item.id === productId);

        if (item) {
          // Add to cart (using cart store's addItem function passed as parameter)
          addToCart(item, 1);

          // Remove from wishlist
          removeItem(productId);

          console.log(`🛒 Moved to cart: ${item.name}`);
        }
      },
    }),
    {
      name: "topeve-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
