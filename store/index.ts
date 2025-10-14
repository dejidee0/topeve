import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAuthSlice } from "./slices/AuthSlice";
import { createCartSlice } from "./slices/cartSlice";
import { createProductSlice } from "./slices/productSlice";
import { createWishlistSlice } from "./slices/wishlistSlice";
import { createUISlice } from "./slices/UISlice";
import type {
  AuthState,
  CartState,
  ProductState,
  WishlistState,
  UIState,
} from "@/lib/store.types";

type StoreState = AuthState &
  CartState &
  ProductState &
  WishlistState &
  UIState;

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createCartSlice(...a),
        ...createProductSlice(...a),
        ...createWishlistSlice(...a),
        ...createUISlice(...a),
      }),
      {
        name: "nike-store",
        partialize: (state) => ({
          items: state.items, // CartItem[]
          wishlistItems: state.wishlistItems, // Product[]
        }),
      }
    )
  )
);

// Selectors for optimized performance
export const useAuth = () =>
  useStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    signIn: state.signIn,
    signUp: state.signUp,
    signOut: state.signOut,
    initializeAuth: state.initializeAuth,
  }));

export const useCart = () =>
  useStore((state) => ({
    items: state.items,
    isOpen: state.isOpen,
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    toggleCart: state.toggleCart,
    getTotalItems: state.getTotalItems,
    getTotalPrice: state.getTotalPrice,
  }));

export const useProducts = () =>
  useStore((state) => ({
    products: state.products,
    filteredProducts: state.filteredProducts,
    selectedProduct: state.selectedProduct,
    isLoading: state.isLoading,
    filters: state.filters,
    setProducts: state.setProducts,
    setSelectedProduct: state.setSelectedProduct,
    fetchProducts: state.fetchProducts,
    fetchProductById: state.fetchProductById,
    applyFilters: state.applyFilters,
    setFilter: state.setFilter,
    clearFilters: state.clearFilters,
  }));

export const useWishlist = () =>
  useStore((state) => ({
    items: state.wishlistItems, // Changed to match the new state property
    addItem: state.addItem,
    removeItem: state.removeItem,
    isInWishlist: state.isInWishlist,
    clearWishlist: state.clearWishlist,
  }));

export const useUI = () =>
  useStore((state) => ({
    isMobileMenuOpen: state.isMobileMenuOpen,
    isSearchOpen: state.isSearchOpen,
    toast: state.toast,
    toggleMobileMenu: state.toggleMobileMenu,
    toggleSearch: state.toggleSearch,
    showToast: state.showToast,
    hideToast: state.hideToast,
  }));
