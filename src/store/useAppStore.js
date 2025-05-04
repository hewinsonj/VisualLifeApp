/**
 * Zustand store for managing global UI and shader effects.
 * Includes postprocessing toggles (bloom, glitch) and camera view mode.
 */
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  bloomEnabled: true,
  glitchEnabled: false,
  cameraMode: 'default',
  // Global zoom level for scaling UI/camera
  zoomLevel: 1,
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // HUD visibility toggle for glyphs, buttons, overlays
  hudVisible: true,
  toggleHud: () => set((state) => ({ hudVisible: !state })),

  timeSpeed: 1,
  setTimeSpeed: (val) => set({ timeSpeed: val }),

  fisheyeEnabled: false,
  toggleFisheye: () => set((s) => ({ fisheyeEnabled: !s.fisheyeEnabled })),
  wormholeEnabled: false,
  toggleWormhole: () => set((s) => ({ wormholeEnabled: !s.wormholeEnabled })),

  // Device profile: 'desktop', 'mobile', 'lowPower'
  deviceProfile: 'desktop',
  setDeviceProfile: (profile) => set({ deviceProfile: profile }),
  setBloom: (val) => set({ bloomEnabled: val }),
  setGlitch: (val) => set({ glitchEnabled: val }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
}));