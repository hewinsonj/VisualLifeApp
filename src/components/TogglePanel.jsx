import React from "react";
import { useAppStore } from "../store/useAppStore";

export default function TogglePanel() {
  const {
    bloomEnabled,
    glitchEnabled,
    hudVisible,
    zoomLevel,
    cameraMode,
    toggleHud,
    setBloom,
    setGlitch,
    setZoomLevel,
    setCameraMode,
    timeSpeed,
    setTimeSpeed,
    fisheyeEnabled,
    wormholeEnabled,
    toggleFisheye,
    toggleWormhole,
    // Future: Add more toggle states here as you wire them in
  } = useAppStore();

  const buttonStyle = {
    margin: "0.2rem",
    padding: "0.3rem 0.5rem",
    fontSize: "0.8rem",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        background: "#111",
        padding: "1rem",
        borderRadius: "8px",
        color: "#fff",
        maxWidth: "95vw",
      }}
    >
      <h4>HUD Buttons</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem" }}>
        {/* Views */}
        <button
          style={{
            ...buttonStyle,
            backgroundColor: cameraMode === "orbit" ? "purple" : undefined,
          }}
          onClick={() => setCameraMode("orbit")}
        >
          View 1
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: cameraMode === "zoom" ? "purple" : undefined,
          }}
          onClick={() => setCameraMode("zoom")}
        >
          View 2
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: cameraMode === "top" ? "purple" : undefined,
          }}
          onClick={() => setCameraMode("top")}
        >
          View 3
        </button>

        {/* Time Control */}

        <button
          style={buttonStyle}
          onClick={() => setTimeSpeed(timeSpeed + 0.5)}
        >
          Time +
        </button>
        <button
          style={buttonStyle}
          onClick={() => setTimeSpeed(Math.max(0.1, timeSpeed - 0.5))}
        >
          Time -
        </button>
        <button style={buttonStyle} onClick={() => setTimeSpeed(1)}>
          Time 1x
        </button>

        {/* Effects */}
        <button
          style={{
            ...buttonStyle,
            backgroundColor: glitchEnabled ? "purple" : undefined,
          }}
          onClick={() => setGlitch(!glitchEnabled)}
        >
          Glitch
        </button>
        <button style={buttonStyle}>Cycle</button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: fisheyeEnabled ? "purple" : undefined,
          }}
          onClick={toggleFisheye}
        >
          Fisheye
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: wormholeEnabled ? "purple" : undefined,
          }}
          onClick={toggleWormhole}
        >
          Wormhole
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: bloomEnabled ? "purple" : undefined,
          }}
          onClick={() => setBloom(!bloomEnabled)}
        >
          Bloom
        </button>

        {/* Colors */}
        <button style={buttonStyle}>Red</button>
        <button style={buttonStyle}>Green</button>
        <button style={buttonStyle}>Blue</button>
        <button style={buttonStyle}>Purple</button>
        <button style={buttonStyle}>Yellow</button>
        <button style={buttonStyle}>White</button>

        {/* Warping */}

        <button style={buttonStyle}>Scramble</button>
        <button style={buttonStyle}>Push</button>
        <button style={buttonStyle}>Pull</button>

        {/* Scene Modes */}
        <button style={buttonStyle}>Temple</button>

        {/* Adjustments */}
        <button style={buttonStyle}>Invert</button>
        <button style={buttonStyle}>Contrast</button>
        <button style={buttonStyle}>Brightness</button>
        <button style={buttonStyle}>Outline</button>

        {/* Rays */}
        <button style={buttonStyle}>Randomize Outlines</button>
        <button style={buttonStyle}>Spragd Rays</button>
        <button style={buttonStyle}>Tighten Rays</button>
        <button style={buttonStyle}>Mirror Mode</button>

        {/* Show/Hide Controls */}
        <button style={buttonStyle}>Show HUD</button>
        <button style={buttonStyle}>Show Buttons</button>
        <button style={buttonStyle}>Hide Buttons</button>
      </div>
    </div>
  );
}
