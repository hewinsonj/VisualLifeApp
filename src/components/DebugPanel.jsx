import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const DebugPanel = () => {
  const [visible, setVisible] = useState(false);
  const [fps, setFps] = useState(0);

  // Zustand values
  const viewMode = useAppStore(state => state.viewMode);
  const bloomEnabled = useAppStore(state => state.bloom);
  const glitchEnabled = useAppStore(state => state.glitch);
  const godrays = useAppStore(state => state.godrays);
  const distortion = useAppStore(state => state.distortion);
  const ribbons = useAppStore(state => state.ribbons);
  const isMobile = useAppStore(state => state.isMobile);
  const zoomLevel = useAppStore(state => state.zoom);
  const brightnessLevel = useAppStore(state => state.brightnessLevel);
  // New Zustand values
  const contrastLevel = useAppStore(state => state.contrastLevel);
  const debugHudVisible = useAppStore(state => state.debugHudVisible);
  // (Optional future use)
  const toggleDebugHud = useAppStore(state => state.toggleDebugHud)

  // Interaction counters
  const pushCount = useAppStore(state => state.pushCount);
  const pullCount = useAppStore(state => state.pullCount);
  const scrambleCount = useAppStore(state => state.scrambleCount);
  const spreadRaysCount = useAppStore(state => state.spreadRaysCount);
  const tightenRaysCount = useAppStore(state => state.tightenRaysCount);
  const outlineCount = useAppStore(state => state.outlineCount);
  const randomizeOutlineCount = useAppStore(state => state.randomizeOutlineCount);

  const appState = useAppStore.getState();

  // Toggle panel with D key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        setVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let running = true;
    const loop = () => {
      if (!running) return;
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(loop);
    };
    loop();
    return () => { running = false; };
  }, []);

  if (!visible) return null;

  return (
    <div className="debug-panel">
      <button className="debug-scroll-btn up" onClick={() => {
        const el = document.querySelector('.debug-panel-scrollable');
        if (el) el.scrollBy({ top: -100, behavior: 'smooth' });
      }}>↑</button>
      <div className="debug-panel-scrollable">
        <h4>🛠 Debug Panel</h4>
        <div>FPS: <strong>{fps}</strong></div>
        <hr />
        <pre>
          {JSON.stringify({
            ...appState,
            zoomLevel: appState.zoomLevel?.toFixed?.(2),
            zoomTarget: appState.zoomTarget?.toFixed?.(2),
            cameraRotation: {
              x: appState.cameraRotation?.x?.toFixed?.(2),
              y: appState.cameraRotation?.y?.toFixed?.(2),
              z: appState.cameraRotation?.z?.toFixed?.(2),
            },
            targetCameraRotation: {
              x: appState.targetCameraRotation?.x?.toFixed?.(2),
              y: appState.targetCameraRotation?.y?.toFixed?.(2),
              z: appState.targetCameraRotation?.z?.toFixed?.(2),
            },
          }, null, 2)}
        </pre>
      </div>
      <button className="debug-scroll-btn down" onClick={() => {
        const el = document.querySelector('.debug-panel-scrollable');
        if (el) el.scrollBy({ top: 100, behavior: 'smooth' });
      }}>↓</button>
    </div>
  );
};

export default DebugPanel;