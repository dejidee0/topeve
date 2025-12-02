// lib/store/index.js
/**
 * Topeve Store Index
 * Central export for all Zustand stores
 */

export { useCartStore } from "./cart";
export { useWishlistStore } from "./wishlist";
export { useAuthStore } from "./auth";
export { useUIStore } from "./ui";

// Re-export useful utilities
export { formatPrice, koboToNGN, ngnToKobo } from "@/utils/products";
