// lib/store/uiStore.js
import { create } from "zustand";

/**
 * UI Store
 * Manages global UI state (modals, sidebars, loading states, etc.)
 */
export const useUIStore = create((set, get) => ({
  // =====================================================
  // STATE
  // =====================================================

  // Sidebar states
  mobileMenuOpen: false,
  filterSidebarOpen: false,

  // Modal states
  quickViewModal: {
    isOpen: false,
    productId: null,
    product: null,
  },
  sizeGuideModal: {
    isOpen: false,
  },
  authModal: {
    isOpen: false,
    mode: "signin", // 'signin' | 'signup' | 'reset'
  },
  searchModal: {
    isOpen: false,
  },

  // Loading states
  pageLoading: false,

  // Notification/Toast
  notification: {
    isVisible: false,
    message: "",
    type: "info", // 'info' | 'success' | 'error' | 'warning'
  },

  // Product filters (for products page)
  activeFilters: {
    category: null,
    subcategory: null,
    colors: [],
    sizes: [],
    materials: [],
    priceRange: { min: null, max: null },
    tags: [],
    sortBy: "created_at",
    sortOrder: "desc",
  },

  // Search state
  searchQuery: "",
  searchResults: [],
  isSearching: false,

  // =====================================================
  // SIDEBAR ACTIONS
  // =====================================================

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },

  /**
   * Open mobile menu
   */
  openMobileMenu: () => {
    set({ mobileMenuOpen: true });
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu: () => {
    set({ mobileMenuOpen: false });
  },

  /**
   * Toggle filter sidebar
   */
  toggleFilterSidebar: () => {
    set((state) => ({ filterSidebarOpen: !state.filterSidebarOpen }));
  },

  /**
   * Open filter sidebar
   */
  openFilterSidebar: () => {
    set({ filterSidebarOpen: true });
  },

  /**
   * Close filter sidebar
   */
  closeFilterSidebar: () => {
    set({ filterSidebarOpen: false });
  },

  // =====================================================
  // MODAL ACTIONS
  // =====================================================

  /**
   * Open quick view modal
   */
  openQuickView: (product) => {
    set({
      quickViewModal: {
        isOpen: true,
        productId: product.id,
        product: product,
      },
    });
    console.log("👁️ Quick view opened:", product.name);
  },

  /**
   * Close quick view modal
   */
  closeQuickView: () => {
    set({
      quickViewModal: {
        isOpen: false,
        productId: null,
        product: null,
      },
    });
  },

  /**
   * Open size guide modal
   */
  openSizeGuide: () => {
    set({
      sizeGuideModal: { isOpen: true },
    });
  },

  /**
   * Close size guide modal
   */
  closeSizeGuide: () => {
    set({
      sizeGuideModal: { isOpen: false },
    });
  },

  /**
   * Open auth modal
   */
  openAuthModal: (mode = "signin") => {
    set({
      authModal: {
        isOpen: true,
        mode: mode,
      },
    });
  },

  /**
   * Close auth modal
   */
  closeAuthModal: () => {
    set({
      authModal: {
        isOpen: false,
        mode: "signin",
      },
    });
  },

  /**
   * Switch auth modal mode
   */
  setAuthModalMode: (mode) => {
    set((state) => ({
      authModal: {
        ...state.authModal,
        mode: mode,
      },
    }));
  },

  /**
   * Open search modal
   */
  openSearchModal: () => {
    set({
      searchModal: { isOpen: true },
    });
  },

  /**
   * Close search modal
   */
  closeSearchModal: () => {
    set({
      searchModal: { isOpen: false },
    });
    // Clear search when closing
    get().clearSearch();
  },

  // =====================================================
  // NOTIFICATION ACTIONS
  // =====================================================

  /**
   * Show notification
   */
  showNotification: (message, type = "info", duration = 3000) => {
    set({
      notification: {
        isVisible: true,
        message: message,
        type: type,
      },
    });

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        get().hideNotification();
      }, duration);
    }

    console.log(`📢 Notification (${type}): ${message}`);
  },

  /**
   * Hide notification
   */
  hideNotification: () => {
    set({
      notification: {
        isVisible: false,
        message: "",
        type: "info",
      },
    });
  },

  // =====================================================
  // LOADING ACTIONS
  // =====================================================

  /**
   * Set page loading state
   */
  setPageLoading: (loading) => {
    set({ pageLoading: loading });
  },

  // =====================================================
  // FILTER ACTIONS
  // =====================================================

  /**
   * Set category filter
   */
  setCategory: (category) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        category: category,
        subcategory: null, // Reset subcategory when category changes
      },
    }));
  },

  /**
   * Set subcategory filter
   */
  setSubcategory: (subcategory) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        subcategory: subcategory,
      },
    }));
  },

  /**
   * Toggle color filter
   */
  toggleColorFilter: (color) => {
    set((state) => {
      const colors = state.activeFilters.colors.includes(color)
        ? state.activeFilters.colors.filter((c) => c !== color)
        : [...state.activeFilters.colors, color];

      return {
        activeFilters: {
          ...state.activeFilters,
          colors: colors,
        },
      };
    });
  },

  /**
   * Toggle size filter
   */
  toggleSizeFilter: (size) => {
    set((state) => {
      const sizes = state.activeFilters.sizes.includes(size)
        ? state.activeFilters.sizes.filter((s) => s !== size)
        : [...state.activeFilters.sizes, size];

      return {
        activeFilters: {
          ...state.activeFilters,
          sizes: sizes,
        },
      };
    });
  },

  /**
   * Toggle material filter
   */
  toggleMaterialFilter: (material) => {
    set((state) => {
      const materials = state.activeFilters.materials.includes(material)
        ? state.activeFilters.materials.filter((m) => m !== material)
        : [...state.activeFilters.materials, material];

      return {
        activeFilters: {
          ...state.activeFilters,
          materials: materials,
        },
      };
    });
  },

  /**
   * Set price range filter
   */
  setPriceRange: (min, max) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        priceRange: { min, max },
      },
    }));
  },

  /**
   * Toggle tag filter
   */
  toggleTagFilter: (tag) => {
    set((state) => {
      const tags = state.activeFilters.tags.includes(tag)
        ? state.activeFilters.tags.filter((t) => t !== tag)
        : [...state.activeFilters.tags, tag];

      return {
        activeFilters: {
          ...state.activeFilters,
          tags: tags,
        },
      };
    });
  },

  /**
   * Set sort option
   */
  setSortBy: (sortBy, sortOrder = "desc") => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        sortBy: sortBy,
        sortOrder: sortOrder,
      },
    }));
  },

  /**
   * Clear all filters
   */
  clearFilters: () => {
    set({
      activeFilters: {
        category: null,
        subcategory: null,
        colors: [],
        sizes: [],
        materials: [],
        priceRange: { min: null, max: null },
        tags: [],
        sortBy: "created_at",
        sortOrder: "desc",
      },
    });
    console.log("🧹 Filters cleared");
  },

  /**
   * Clear specific filter type
   */
  clearFilterType: (filterType) => {
    set((state) => {
      const newFilters = { ...state.activeFilters };

      if (filterType === "colors") newFilters.colors = [];
      else if (filterType === "sizes") newFilters.sizes = [];
      else if (filterType === "materials") newFilters.materials = [];
      else if (filterType === "priceRange")
        newFilters.priceRange = { min: null, max: null };
      else if (filterType === "tags") newFilters.tags = [];
      else if (filterType === "category") {
        newFilters.category = null;
        newFilters.subcategory = null;
      } else if (filterType === "subcategory") newFilters.subcategory = null;

      return { activeFilters: newFilters };
    });
  },

  /**
   * Get active filter count
   */
  getActiveFilterCount: () => {
    const { activeFilters } = get();
    let count = 0;

    if (activeFilters.category) count++;
    if (activeFilters.subcategory) count++;
    count += activeFilters.colors.length;
    count += activeFilters.sizes.length;
    count += activeFilters.materials.length;
    count += activeFilters.tags.length;
    if (activeFilters.priceRange.min || activeFilters.priceRange.max) count++;

    return count;
  },

  // =====================================================
  // SEARCH ACTIONS
  // =====================================================

  /**
   * Set search query
   */
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  /**
   * Set search results
   */
  setSearchResults: (results) => {
    set({ searchResults: results });
  },

  /**
   * Set searching state
   */
  setIsSearching: (isSearching) => {
    set({ isSearching: isSearching });
  },

  /**
   * Clear search
   */
  clearSearch: () => {
    set({
      searchQuery: "",
      searchResults: [],
      isSearching: false,
    });
  },
}));
