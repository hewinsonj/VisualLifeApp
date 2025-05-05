import React, { useRef, useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function TogglePanel() {
  const {
    bloomEnabled,
    glitchEnabled,
    hudVisible,
    buttonsVisible,
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
    colorMode,
    setColorMode,
    scrambleEnabled,
    toggleScramble,
    pushEnabled,
    togglePush,
    pullEnabled,
    togglePull,
    invertEnabled,
    toggleInvert,
    mirrorModeEnabled,
    toggleMirrorMode,
    // Add control functions from store
    showHud,
    showButtons,
    hideButtons,
    // Future: Add more toggle states here as you wire them in
  } = useAppStore();

  
  const [flashButton, setFlashButton] = React.useState(null);
  const flash = (name) => {
    setFlashButton(name);
    setTimeout(() => setFlashButton(null), 300);
  };

  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  // Fade toggle logic for panel visibility based on buttonsVisible
  useEffect(() => {
    if (buttonsVisible) {
      setShouldRender(true);
      setVisible(true);
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [buttonsVisible]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(handleScroll);
    observer.observe(el);
    window.addEventListener("resize", handleScroll);

    // run once on mount
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleScroll);
    };
  }, [buttonsVisible]);

  if (!shouldRender) return null;

  const buttonConfigs = [
    {
      label: "View 1",
      action: () => setCameraMode("orbit"),
      isActive: () => cameraMode === "orbit",
    },
    {
      label: "View 2",
      action: () => setCameraMode("zoom"),
      isActive: () => cameraMode === "zoom",
    },
    {
      label: "View 3",
      action: () => setCameraMode("top"),
      isActive: () => cameraMode === "top",
    },
    {
      label: "Time +",
      action: () => {
        setTimeSpeed(timeSpeed + 0.5);
        flash("timePlus");
      },
      flashKey: "timePlus",
    },
    {
      label: "Time -",
      action: () => {
        setTimeSpeed(Math.max(0.1, timeSpeed - 0.5));
        flash("timeMinus");
      },
      flashKey: "timeMinus",
    },
    {
      label: "Time 1x",
      action: () => {
        setTimeSpeed(1);
        flash("timeReset");
      },
      flashKey: "timeReset",
    },
    {
      label: "Glitch",
      action: () => setGlitch(!glitchEnabled),
      isActive: () => glitchEnabled,
    },
    { label: "Cycle", action: () => flash("cycle"), flashKey: "cycle" },
    { label: "Fisheye", action: toggleFisheye, isActive: () => fisheyeEnabled },
    {
      label: "Wormhole",
      action: toggleWormhole,
      isActive: () => wormholeEnabled,
    },
    {
      label: "Bloom",
      action: () => setBloom(!bloomEnabled),
      isActive: () => bloomEnabled,
    },
    {
      label: "Red",
      action: () => setColorMode("red"),
      isActive: () => colorMode === "red",
    },
    {
      label: "Green",
      action: () => setColorMode("green"),
      isActive: () => colorMode === "green",
    },
    {
      label: "Blue",
      action: () => setColorMode("blue"),
      isActive: () => colorMode === "blue",
    },
    {
      label: "Purple",
      action: () => setColorMode("purple"),
      isActive: () => colorMode === "purple",
    },
    {
      label: "Yellow",
      action: () => setColorMode("yellow"),
      isActive: () => colorMode === "yellow",
    },
    {
      label: "White",
      action: () => setColorMode("white"),
      isActive: () => colorMode === "white",
    },
    {
      label: "Scramble",
      action: () => {
        toggleScramble();
        flash("scramble");
      },
      flashKey: "scramble",
    },
    {
      label: "Push",
      action: () => {
        togglePush();
        flash("push");
      },
      flashKey: "push",
    },
    {
      label: "Pull",
      action: () => {
        togglePull();
        flash("pull");
      },
      flashKey: "pull",
    },
    { label: "Temple", action: () => flash("temple"), flashKey: "temple" },
    { label: "Invert", action: toggleInvert, isActive: () => invertEnabled },
    {
      label: "Contrast",
      action: () => flash("contrast"),
      flashKey: "contrast",
    },
    {
      label: "Brightness",
      action: () => flash("brightness"),
      flashKey: "brightness",
    },
    { label: "Outline", action: () => flash("outline"), flashKey: "outline" },
    {
      label: "Randomize Outlines",
      action: () => flash("randomizeOutline"),
      flashKey: "randomizeOutline",
    },
    {
      label: "Spread Rays",
      action: () => flash("spreadRays"),
      flashKey: "spreadRays",
    },
    {
      label: "Tighten Rays",
      action: () => flash("tightenRays"),
      flashKey: "tightenRays",
    },
    {
      label: "Mirror Mode",
      action: toggleMirrorMode,
      isActive: () => mirrorModeEnabled,
    },
  ];

  return (
    <div className={`toggle-panel-container ${visible ? '' : 'fade-out'}`} ref={containerRef}>
      {" "}
      {showLeftArrow && <div className="scroll-arrow left">←</div>}
      <div
        className="toggle-panel-scroll-wrapper"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div
          className="toggle-panel-scroll"
        >
          {buttonConfigs.map((btn, idx) => (
            <button
              key={idx}
              className={`toggle-button ${visible ? 'fade-in' : 'fade-out'}`}
              style={{
                backgroundColor:
                  btn.isActive?.() || flashButton === btn.flashKey
                    ? "purple"
                    : undefined,
                flexShrink: 0,
              }}
              onClick={btn.action}
            >
              {btn.label}
            </button>
          ))}
    {!hudVisible ? (
            <button className="toggle-button" onClick={showHud}>
              Show HUD
            </button>
          ) : (
            <button className="toggle-button" onClick={toggleHud}>
              Hide HUD
            </button>
          )}
        </div>
      </div>
      {showRightArrow && <div className="scroll-arrow right">→</div>}
      {" "}
    </div>
  );
}
