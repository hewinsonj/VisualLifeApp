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
    zoomTarget,
    setZoomTarget,
    setZoomLevel,
    resetZoomLevel,
    setCameraMode,
    timeScale,
    setTimeScale,
    incrementTimeScale,
    decrementTimeScale,
    fisheyeEnabled,
    wormholeEnabled,
    toggleFisheye,
    toggleWormhole,
    colorMode,
    setColorMode,
    scrambleEnabled,
    incrementScramble,
    incrementPush,
    incrementPull,
    invertEnabled,
    toggleInvert,
    mirrorModeEnabled,
    toggleMirrorMode,
    // Add control functions from store
    showHud,
    showButtons,
    hideButtons,
    // Future: Add more toggle states here as you wire them in
    // incrementOutline,  <-- replaced by toggleOutline
    // incrementRandomizeOutline,
    incrementRandomizeOutline,
    incrementSpreadRays,
    incrementTightenRays,
    incrementBrightness,
    incrementTemple,
    incrementContrast,
    contrastLevel,
    incrementCycle,
    toggleOutline,
    outlineEnabled,
    useCameraControls,
    setUseCameraControls,
  } = useAppStore();

  const [flashButton, setFlashButton] = React.useState(null);
  const flash = (name) => {
    setFlashButton(name);
    setTimeout(() => setFlashButton(null), 300);
  };

  // Store the last non-zero timeScale for pause/resume
  const lastTimeScale = useRef(timeScale || 1);
  useEffect(() => {
    if (timeScale !== 0) {
      lastTimeScale.current = timeScale;
    }
  }, [timeScale]);

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
      action: () => {
        const { setCameraPosition, setPivotPosition } = useAppStore.getState();
        const controls = document.querySelector("cameraControls")?.__r3f?.object;
        if (controls && useCameraControls) {
          const pos = controls.getPosition(new THREE.Vector3());
          const tgt = controls.getTarget(new THREE.Vector3());
          setCameraPosition({ x: pos.x, y: pos.y, z: pos.z });
          setPivotPosition({ x: tgt.x, y: tgt.y, z: tgt.z });
        }
        setCameraMode("control");
        setUseCameraControls(true);
      },
      isActive: () => cameraMode === "control",
    },
    {
      label: "View 2",
      action: () => {
        setCameraMode("default");
        setUseCameraControls(false);
      },
      isActive: () => cameraMode === "default",
    },
    {
      label: "View 3",
      action: () => setCameraMode("zoom"),
      isActive: () => cameraMode === "zoom",
    },
    {
      label: "View 4",
      action: () => setCameraMode("top"),
      isActive: () => cameraMode === "top",
    },
    {
      label: "Time +",
      action: () => {
        // If paused, resume with increment
        const next = Math.min(5.0, timeScale === 0 ? lastTimeScale.current + 0.05 : timeScale + 0.05);
        setTimeScale(next);
        flash("timePlus");
      },
      flashKey: "timePlus",
    },
    {
      label: "Time -",
      action: () => {
        // If paused, resume with decrement
        const next = Math.max(0.05, timeScale === 0 ? lastTimeScale.current - 0.05 : timeScale - 0.05);
        setTimeScale(next);
        flash("timeMinus");
      },
      flashKey: "timeMinus",
    },
    {
      label: "Time 1x",
      action: () => {
        setTimeScale(1);
        flash("timeReset");
      },
      flashKey: "timeReset",
    },
    {
      label: timeScale === 0 ? "Time Flow" : "Time Pause",
      action: () => {
        setTimeScale(timeScale === 0 ? lastTimeScale.current : 0);
        flash("pauseTime");
      },
      flashKey: "pauseTime",
    },
    {
      label: "Zoom -",
      action: () => {
        setZoomTarget(Math.max(0.5, zoomTarget - 1.5));
        flash("zoomIn");
      },
      flashKey: "zoomIn",
    },
    {
      label: "Zoom +",
      action: () => {
        setZoomTarget(Math.min(150, zoomTarget + 1.5));
        flash("zoomOut");
      },
      flashKey: "zoomOut",
    },
    {
      label: "Zoom 1x",
      action: () => {
        resetZoomLevel();
        flash("zoomReset");
      },
      flashKey: "zoomReset",
    },
    {
      label: "Glitch",
      action: () => setGlitch(!glitchEnabled),
      isActive: () => glitchEnabled,
    },
    {
      label: `Cycle`,
      action: () => {
        incrementCycle();
        flash("cycle");
      },
      flashKey: "cycle",
    },
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
        incrementScramble();
        flash("scramble");
      },
      flashKey: "scramble",
    },
    {
      label: "Push",
      action: () => {
        incrementPush();
        flash("push");
      },
      flashKey: "push",
    },
    {
      label: "Pull",
      action: () => {
        incrementPull();
        flash("pull");
      },
      flashKey: "pull",
    },
    {
      label: "Temple",
      action: () => {
        incrementTemple();
        flash("temple");
      },
      flashKey: "temple",
    },
    { label: "Invert", action: toggleInvert, isActive: () => invertEnabled },
    {
      label: `Contrast`,
      action: () => {
        incrementContrast();
        flash("contrast");
      },
      flashKey: "contrast",
    },
    {
      label: "Brightness",
      action: () => {
        incrementBrightness();
        flash("brightness");
      },
      flashKey: "brightness",
    },
    {
      label: "Outline",
      action: () => {
        toggleOutline();
        flash("outline");
      },
      isActive: () => outlineEnabled,
      flashKey: "outline",
    },
    {
      label: "Randomize Outlines",
      action: () => {
        incrementRandomizeOutline();
        flash("randomizeOutline");
      },
      flashKey: "randomizeOutline",
    },
    {
      label: "Spread Rays",
      action: () => {
        incrementSpreadRays();
        flash("spreadRays");
      },
      flashKey: "spreadRays",
    },
    {
      label: "Tighten Rays",
      action: () => {
        incrementTightenRays();
        flash("tightenRays");
      },
      flashKey: "tightenRays",
    },
    {
      label: "Mirror Mode",
      action: toggleMirrorMode,
      isActive: () => mirrorModeEnabled,
    },
  ];

  return (
    <div
      className={`toggle-panel-container ${visible ? "" : "fade-out"}`}
      ref={containerRef}
    >
      {" "}
      {showLeftArrow && <div className="scroll-arrow left">←</div>}
      {buttonsVisible && (
        <div
          className="scroll-guard-zone block-zoom"
          onWheel={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
      <div
        className="toggle-panel-scroll-wrapper"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="toggle-panel-scroll">
          {buttonConfigs.map((btn, idx) => (
            <button
              key={idx}
              className={`toggle-button ${visible ? "fade-in" : "fade-out"}`}
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
      {showRightArrow && <div className="scroll-arrow right">→</div>}{" "}
    </div>
  );
}
