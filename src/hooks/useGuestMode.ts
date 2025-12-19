import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GuestModeState {
  isGuestMode: boolean;
  guestSessionStart: number | null;
  pagesVisited: string[];
  featuresUsed: string[];
  setGuestMode: (value: boolean) => void;
  trackPageVisit: (page: string) => void;
  trackFeatureUsed: (feature: string) => void;
  clearGuestSession: () => void;
  getSessionMinutes: () => number;
}

export const useGuestMode = create<GuestModeState>()(
  persist(
    (set, get) => ({
      isGuestMode: false,
      guestSessionStart: null,
      pagesVisited: [],
      featuresUsed: [],
      
      setGuestMode: (value: boolean) => set({ 
        isGuestMode: value,
        guestSessionStart: value ? Date.now() : null,
        pagesVisited: value ? [] : get().pagesVisited,
        featuresUsed: value ? [] : get().featuresUsed,
      }),
      
      trackPageVisit: (page: string) => set((state) => ({
        pagesVisited: state.pagesVisited.includes(page) 
          ? state.pagesVisited 
          : [...state.pagesVisited, page]
      })),
      
      trackFeatureUsed: (feature: string) => set((state) => ({
        featuresUsed: state.featuresUsed.includes(feature)
          ? state.featuresUsed
          : [...state.featuresUsed, feature]
      })),
      
      clearGuestSession: () => set({
        isGuestMode: false,
        guestSessionStart: null,
        pagesVisited: [],
        featuresUsed: [],
      }),
      
      getSessionMinutes: () => {
        const start = get().guestSessionStart;
        if (!start) return 0;
        return Math.floor((Date.now() - start) / 60000);
      },
    }),
    {
      name: 'pt-guest-mode',
    }
  )
);
