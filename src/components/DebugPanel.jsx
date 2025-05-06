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
      <h4>🛠 Debug Panel</h4>
      {/* <div>View Mode: <strong>{viewMode}</strong></div> */}
      {/* <div>Zoom: <strong>{zoomLevel}</strong></div> */}
      {/* <div>Device: <strong>{isMobile ? 'Mobile' : 'Desktop'}</strong></div> */}
      <div>FPS: <strong>{fps}</strong></div>
      {/* <hr /> */}
      {/* <div>Shaders:</div> */}
      {/* <div>‣ Bloom: <strong>{bloomEnabled ? 'On' : 'Off'}</strong></div> */}
      {/* <div>‣ Glitch: <strong>{glitchEnabled ? 'On' : 'Off'}</strong></div> */}
      {/* <div>‣ Godrays: <strong>{godrays ? 'On' : 'Off'}</strong></div> */}
      {/* <div>‣ Distortion: <strong>{distortion ? 'On' : 'Off'}</strong></div> */}
      {/* <div>‣ Ribbons: <strong>{ribbons ? 'On' : 'Off'}</strong></div> */}
      <hr />
      {/* <div><strong>Interaction Counters:</strong></div>
      <div>Push: {pushCount}</div>
      <div>Pull: {pullCount}</div>
      <div>Scramble: {scrambleCount}</div>
      <div>Spread Rays: {spreadRaysCount}</div>
      <div>Tighten Rays: {tightenRaysCount}</div>
      <div>Outline: {outlineCount}</div>
      <div>Randomize Outlines: {randomizeOutlineCount}</div>
      <div>Brightness Level: {brightnessLevel}</div>
      <div>Contrast Level: {contrastLevel}</div>
      <div>Debug HUD Visible: {debugHudVisible ? 'Yes' : 'No'}</div>
      <hr /> */}
      {/* <div><strong>Zustand Snapshot:</strong></div> */}
      <pre>
        {JSON.stringify(appState, null, 2)}
      </pre>
    </div>
  );
};

export default DebugPanel;