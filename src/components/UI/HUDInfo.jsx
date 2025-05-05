import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function HUDInfo() {
  const { hideHud, hudVisible } = useAppStore();

  const [visible, setVisible] = useState(true);
const [shouldRender, setShouldRender] = useState(true);

useEffect(() => {
  if (!hudVisible) {
    setVisible(false); // Triggers fade-out class
    const timeout = setTimeout(() => setShouldRender(false), 300); // Wait for CSS animation
    return () => clearTimeout(timeout);
  } else {
    setVisible(true);
    setShouldRender(true); // Ensure it mounts again
  }
}, [hudVisible]);

if (!shouldRender) return null;

  return (
    <div id="hud" className={`hud-info ${visible ? 'fade-in' : 'fade-out'}`}>
      <div className="hud-info-header">
        <button className="hud-close-button large" onClick={hideHud}>✖</button>
      </div>
      <strong>🖱 Mouse or Touch:</strong><br />
      • Left Drag: Orbit<br />
      • Scroll: Zoom<br />
      • Right Drag: Pan<br /><br />
      <div className="keyboard-instructions">
      <strong>⌨️ Keyboard:</strong><br />
      • [1/2/3]: View Modes<br />
      • [Arrow Keys]: Tilt & Rotate<br />
      • [+/-/0]: Speed Up / Slow Down<br />
      • [-]: Zoom In<br />
      • []: Zoom Out<br />
      • [F]: Toggle Fisheye Effect<br />
      • [V]: Toggle Wormhole Effect<br />
      • [E]: Scramble Shapes<br />
      • [K]: Push Shapes<br />
      • [L]: Pull Shapes<br />
      • [Z]: Regenerate Temple<br />
      • [C]: Adjust Contrast<br />
      • [D]: Adjust Brightness<br />
      • [N]: Invert Colors<br />
      • [R/H/B/P/Y/W]: Color Palettes<br />
      • [X]: Cycle Random Palette<br />
      • [G]: Hold to Glitch<br />
      • [Q]: Randomize Outlines<br />
      • [O]: Toggle Wireframe Outlines<br />
      • [S]: Spread God Rays<br />
      • [T]: Tighten God Rays<br />
      • [U]: Toggle Choppy Speed<br />
      • [M]: Toggle Mirror Mode<br />
      </div>
    </div>
  );
}