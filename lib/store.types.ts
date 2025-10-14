import { User } from "@supabase/supabase-js";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product,
    size: string,
    color: string,
    quantity?: number
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  filters: {
    category: string[];
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
  };
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  applyFilters: () => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
}

export interface WishlistState {
  wishlistItems: Product[]; // Changed from 'items' to 'wishlistItems'
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toast: {
    message: string;
    type: "success" | "error" | "info";
  } | null;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  hideToast: () => void;
}
