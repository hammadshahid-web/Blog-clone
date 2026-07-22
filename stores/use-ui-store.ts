// stores/use-ui-store.ts
import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));