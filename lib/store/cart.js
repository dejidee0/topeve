// lib/store/cartStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Cart Store
 * Manages shopping cart state with localStorage persistence
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      // =====================================================
      // STATE
      // =====================================================
      items: [],
      isOpen: false,

      // =====================================================
      // COMPUTED VALUES
      // =====================================================

      /**
       * Get total number of items in cart
       */
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Get cart subtotal (in kobo)
       */
      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      /**
       * Get formatted subtotal (in NGN)
       */
      getFormattedSubtotal: () => {
        const subtotal = get().getSubtotal();
        return new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(subtotal);
      },

      /**
       * Check if product is in cart
       */
      isInCart: (productId, size = null, color = null) => {
        const { items } = get();
        return items.some(
          (item) =>
            item.id === productId && item.size === size && item.color === color
        );
      },

      /**
       * Get item from cart
       */
      getCartItem: (productId, size = null, color = null) => {
        const { items } = get();
        return items.find(
          (item) =>
            item.id === productId && item.size === size && item.color === color
        );
      },

      /**
       * Get item quantity
       */
      getItemQuantity: (productId, size = null, color = null) => {
        const item = get().getCartItem(productId, size, color);
        return item ? item.quantity : 0;
      },

      // =====================================================
      // ACTIONS
      // =====================================================

      /**
       * Add item to cart
       * @param {Object} product - Product object
       * @param {number} quantity - Quantity to add
       * @param {string} size - Selected size
       * @param {string} color - Selected color
       */
      addItem: (product, quantity = 1, size = null, color = null) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === product.id &&
              item.size === size &&
              item.color === color
          );

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;

            console.log(
              `🛒 Updated cart: ${product.name} x${updatedItems[existingItemIndex].quantity}`
            );

            return { items: updatedItems };
          } else {
            // New item, add to cart
            const newItem = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              currency: product.currency || "NGN",
              image: product.image,
              size: size,
              color: color,
              quantity: quantity,
              sku: product.sku,
              inStock: product.in_stock ?? product.inStock ?? true,
            };

            console.log(`🛒 Added to cart: ${product.name} x${quantity}`);

            return { items: [...state.items, newItem] };
          }
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (productId, size = null, color = null) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) =>
              !(
                item.id === productId &&
                item.size === size &&
                item.color === color
              )
          );

          console.log(`🗑️ Removed from cart: ${productId}`);

          return { items: updatedItems };
        });
      },

      /**
       * Update item quantity
       */
      updateQuantity: (productId, quantity, size = null, color = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          );

          console.log(`🔄 Updated quantity: ${productId} to ${quantity}`);

          return { items: updatedItems };
        });
      },

      /**
       * Increment item quantity
       */
      incrementQuantity: (productId, size = null, color = null) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );

          return { items: updatedItems };
        });
      },

      /**
       * Decrement item quantity
       */
      decrementQuantity: (productId, size = null, color = null) => {
        set((state) => {
          const item = state.items.find(
            (item) =>
              item.id === productId &&
              item.size === size &&
              item.color === color
          );

          if (!item) return state;

          if (item.quantity <= 1) {
            // Remove item if quantity would be 0
            return {
              items: state.items.filter(
                (item) =>
                  !(
                    item.id === productId &&
                    item.size === size &&
                    item.color === color
                  )
              ),
            };
          }

          const updatedItems = state.items.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );

          return { items: updatedItems };
        });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({ items: [] });
        console.log("🗑️ Cart cleared");
      },

      /**
       * Toggle cart sidebar
       */
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      /**
       * Open cart sidebar
       */
      openCart: () => {
        set({ isOpen: true });
      },

      /**
       * Close cart sidebar
       */
      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: "topeve-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
