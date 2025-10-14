import { StateCreator } from "zustand";
import { UIState } from "@/lib/store.types";

export const createUISlice: StateCreator<UIState> = (set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toast: null,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  showToast: (message, type) => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null }),
});
