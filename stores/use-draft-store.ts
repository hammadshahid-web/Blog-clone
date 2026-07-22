import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DraftState {
  title: string;
  category: string;
  content: string;
  lastSaved: string | null;
  setDraft: (data: Partial<Omit<DraftState, 'setDraft' | 'clearDraft'>>) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      title: '',
      category: '',
      content: '',
      lastSaved: null,
      setDraft: (data) =>
        set((state) => ({
          ...state,
          ...data,
          lastSaved: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        })),
      clearDraft: () =>
        set({ title: '', category: '', content: '', lastSaved: null }),
    }),
    {
      name: 'post-draft-store', // LocalStorage Key
      storage: createJSONStorage(() => localStorage),
    }
  )
);