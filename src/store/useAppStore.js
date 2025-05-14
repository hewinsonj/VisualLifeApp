import { create } from "zustand";

export const useAppStore = create((set) => ({
  bloomEnabled: false,
  glitchEnabled: false,
  cameraMode: "control",
  useCameraControls: true,

  // HUD visibility toggle for glyphs, buttons, overlays
  hudVisible: true,
  toggleHud: () => set((state) => ({ hudVisible: !state.hudVisible })),

  timeSpeed: 0.6,
  setTimeSpeed: (val) => set({ timeSpeed: val }),
  incrementTimeSpeed: () =>
    set((state) => ({
      timeSpeed: Math.min(5.0, state.timeSpeed + 0.05),
    })),
  decrementTimeSpeed: () =>
    set((state) => ({
      timeSpeed: Math.max(0.1, state.timeSpeed - 0.05),
    })),

  fisheyeEnabled: false,
  toggleFisheye: () => set((s) => ({ fisheyeEnabled: !s.fisheyeEnabled })),
  wormholeEnabled: false,
  toggleWormhole: () => set((s) => ({ wormholeEnabled: !s.wormholeEnabled })),

  // Device profile: 'desktop', 'mobile', 'lowPower'
  deviceProfile: "desktop",
  setDeviceProfile: (profile) => set({ deviceProfile: profile }),
  setBloom: (val) => set({ bloomEnabled: val }),
  setGlitch: (val) => set({ glitchEnabled: val }),
  setCameraMode: (mode) => set({ cameraMode: mode }),

  // Interaction counters
  scrambleCount: 0,
  incrementScramble: () => set((s) => ({ scrambleCount: s.scrambleCount + 1 })),

  pushCount: 0,
  incrementPush: () => set((s) => ({ pushCount: s.pushCount + 1 })),

  pullCount: 0,
  incrementPull: () => set((s) => ({ pullCount: s.pullCount + 1 })),

  tightenRaysCount: 0,
  incrementTightenRays: () =>
    set((state) => ({ tightenRaysCount: state.tightenRaysCount + 1 })),

  spreadRaysCount: 0,
  incrementSpreadRays: () =>
    set((state) => ({ spreadRaysCount: state.spreadRaysCount + 1 })),

  // Changed outlineCount to boolean toggle outlineEnabled
  outlineEnabled: false,
  toggleOutline: () =>
    set((state) => ({ outlineEnabled: !state.outlineEnabled })),

  randomizeOutlinesCount: 0,
  incrementRandomizeOutline: () =>
    set((state) => ({
      randomizeOutlinesCount: state.randomizeOutlinesCount + 1,
    })),

  // Brightness scale (1 = default). Use for shader/lighting intensity.
  brightness: 1,
  incrementBrightness: () =>
    set((state) => {
      const step = 0.05;
      const min = 0.5;
      const max = 3.0;
      let direction = state.brightnessDirection ?? 1;
      let next = state.brightness + step * direction;

      if (next >= max || next <= min) {
        direction *= -1;
        next = Math.max(min, Math.min(max, next));
      }

      return {
        brightness: next,
        brightnessDirection: direction,
      };
    }),

  templeCount: 0,
  incrementTemple: () =>
    set((state) => ({ templeCount: state.templeCount + 1 })),

  cycleCount: 0,
  incrementCycle: () => set((state) => ({ cycleCount: state.cycleCount + 1 })),

  colorMode: "null",
  setColorMode: (mode) => set({ colorMode: mode }),

  invertEnabled: false,
  toggleInvert: () => set((s) => ({ invertEnabled: !s.invertEnabled })),

  mirrorModeEnabled: false,
  toggleMirrorMode: () =>
    set((s) => ({ mirrorModeEnabled: !s.mirrorModeEnabled })),

  buttonsVisible: true,
  showButtons: () => set({ buttonsVisible: true }),
  hideButtons: () => set({ buttonsVisible: false }),

  showHud: () => set({ hudVisible: true }),
  hideHud: () => set({ hudVisible: false }),

  setUseCameraControls: (value) => set({ useCameraControls: value }),

  // Contrast level controls
  contrastLevel: 0,
  incrementContrast: () =>
    set((state) => ({
      contrastLevel: (state.contrastLevel + 1) % 4,
    })),

  zoomLevel: 30,
  zoomTarget: 30,
  cameraDistanceFromPivot: 30,
  setCameraDistanceFromPivot: (val) => set({ cameraDistanceFromPivot: val }),
  setZoomTarget: (val) => set({ zoomTarget: val }),
  updateZoomLevel: () =>
    set((state) => {
      const lerp = (a, b, t) => a + (b - a) * t;
      return {
        zoomLevel: lerp(state.zoomLevel, state.zoomTarget, 0.08),
      };
    }),
  incrementZoomLevel: () =>
    set((state) => ({
      zoomLevel: Math.min(150, state.zoomLevel + .7),
    })),
  decrementZoomLevel: () =>
    set((state) => ({
      zoomLevel: Math.max(0.5, state.zoomLevel - .7),
    })),

  setZoomLevel: (val) => set({ zoomLevel: val }),
  resetZoomLevel: () => set({
    zoomTarget: 1,
    cameraRotation: { x: 0, y: 0, z: 0 },
    targetCameraRotation: { x: 0, y: 0, z: 0 },
    cameraOffset: { x: 0, y: 0 },
  }),

  freeView: false,
  setFreeView: (val) => set({ freeView: val }),

  cameraRotation: { x: 0, y: 0, z: 0 },
  targetCameraRotation: { x: 0, y: 0, z: 0 },
  setCameraRotation: (rotation) => set({ targetCameraRotation: rotation }),
  updateCameraRotation: () =>
    set((state) => {
      const lerp = (start, end, factor) => start + (end - start) * factor;
      const threshold = 0.00001;

      const snap = (a, b) => Math.abs(a - b) < threshold ? b : lerp(a, b, 0.04);

      return {
        cameraRotation: {
          x: snap(state.cameraRotation.x, state.targetCameraRotation.x),
          y: snap(state.cameraRotation.y, state.targetCameraRotation.y),
          z: snap(state.cameraRotation.z ?? 0, state.targetCameraRotation.z ?? 0),
        },
      };
    }),

  cameraOffset: { x: 0, y: 0 },
  setCameraOffset: (offset) => set({ cameraOffset: offset }),

  // Pivot group position for camera transitions
  pivotPosition: { x: 0, y: 0, z: 0 },
  initialPivotPosition: { x: 0, y: 0, z: 0 },

  setPivotPosition: (pos) => {
    // Prevent accidental reset if already matching target
    if (pos && typeof pos === 'object' && 'x' in pos && 'y' in pos && 'z' in pos) {
      set({ pivotPosition: pos });
    }
  },

  resetPivotPosition: () => {
    const { initialPivotPosition } = useAppStore.getState();
    set({ pivotPosition: { ...initialPivotPosition } });
  },

  cameraPosition: { x: 0, y: 0, z: 0 },
  setCameraPosition: (pos) => {
    if (pos && typeof pos === 'object' && 'x' in pos && 'y' in pos && 'z' in pos) {
      set({ cameraPosition: pos });
    }
  },

  // New zoom and top camera view state values
  zoomVelocity: 0,
  setZoomVelocity: (val) => set({ zoomVelocity: val }),

  tiltAngle: 0,
  yawAngle: 0,
  targetTiltAngle: 0,
  targetYawAngle: 0,
  setTargetTiltAngle: (val) => set({ targetTiltAngle: val }),
  setTargetYawAngle: (val) => set({ targetYawAngle: val }),
  updateTiltYawAngles: () =>
    set((state) => ({
      tiltAngle: state.tiltAngle + (state.targetTiltAngle - state.tiltAngle) * 0.08,
      yawAngle: state.yawAngle + (state.targetYawAngle - state.yawAngle) * 0.08,
    })),

  topViewActive: false,
  setTopViewActive: (val) => set({ topViewActive: val }),
}));
