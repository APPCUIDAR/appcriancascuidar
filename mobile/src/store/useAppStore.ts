import { create } from 'zustand';

interface AppState {
  isLayerBUnlocked: boolean;
  isProfileComplete: boolean;
  unlockLayerB: () => void;
  lockLayerB: () => void;
  setProfileComplete: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLayerBUnlocked: false,
  isProfileComplete: false,
  unlockLayerB: () => set({ isLayerBUnlocked: true }),
  lockLayerB: () => set({ isLayerBUnlocked: false }),
  setProfileComplete: () => set({ isProfileComplete: true }),
}));
