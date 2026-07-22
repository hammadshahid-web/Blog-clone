import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  wishlistSlugs: string[];
  toggleWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistSlugs: [],

      toggleWishlist: (slug: string) => {
        const { wishlistSlugs } = get();
        const exists = wishlistSlugs.includes(slug);

        if (exists) {
          set({ wishlistSlugs: wishlistSlugs.filter((itemSlug) => itemSlug !== slug) });
        } else {
          set({ wishlistSlugs: [...wishlistSlugs, slug] });
        }
      },

      isInWishlist: (slug: string) => {
        return get().wishlistSlugs.includes(slug);
      },
    }),
    {
      name: 'blog-wishlist-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);