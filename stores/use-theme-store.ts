// stores/use-theme-store.ts
import { create } from 'zustand';

interface ThemeConfigState {
  accentColor: string; // e.g. 'blue', 'emerald', 'violet'
  setAccentColor: (color: string) => void;
}

export const useThemeConfigStore = create<ThemeConfigState>()((set) => ({
  accentColor: 'blue',
  setAccentColor: (color) => set({ accentColor: color }),
}));