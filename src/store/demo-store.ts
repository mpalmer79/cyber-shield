// src/store/demo-store.ts
// Demo Mode State Management
// Uses sessionStorage (not localStorage) so demo resets on browser close

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DemoStore {
  isDemoMode: boolean;
  demoStartedAt: number | null;
  scenariosCompleted: number;

  enableDemo: () => void;
  disableDemo: () => void;
  incrementScenarios: () => void;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      isDemoMode: false,
      demoStartedAt: null,
      scenariosCompleted: 0,

      enableDemo: () => set({
        isDemoMode: true,
        demoStartedAt: Date.now(),
        scenariosCompleted: 0,
      }),

      disableDemo: () => set({
        isDemoMode: false,
        demoStartedAt: null,
        scenariosCompleted: 0,
      }),

      incrementScenarios: () => set((s) => ({
        scenariosCompleted: s.scenariosCompleted + 1,
      })),
    }),
    {
      name: 'cybershield-demo',
      storage: createJSONStorage(() => {
        // SSR guard
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return sessionStorage;
      }),
    }
  )
);
