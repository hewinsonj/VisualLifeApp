import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function KeyboardControls() {
  const {
    toggleViewMode1,
    toggleViewMode2,
    toggleViewMode3,
    incrementTimeSpeed,
    decrementTimeSpeed,
    resetTimeSpeed,
    zoomTarget,
    setZoomTarget,
    toggleFisheye,
    toggleWormhole,
    incrementScramble,
    incrementPush,
    incrementPull,
    regenerateTemple,
    incrementContrastLevel,
    incrementBrightness,
    toggleInvert,
    cycleColorPalette,
    toggleGlitch,
    incrementRandomizeOutline,
    toggleWireframe,
    incrementSpreadRays,
    incrementTightenRays,
    toggleChoppySpeed,
    toggleMirror,
    // toggleDebugger,
    resetZoomLevel,
  } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case '1': toggleViewMode1(); break;
        case '2': toggleViewMode2(); break;
        case '3': toggleViewMode3(); break;
        case '+': incrementTimeSpeed(); break;
        case '-': decrementTimeSpeed(); break;
        case '0': resetTimeSpeed(); break;
        case '[': setZoomTarget(Math.max(0.5, zoomTarget - 1.5)); break;
        case ']': setZoomTarget(Math.min(150, zoomTarget + 1.5)); break;
        case 'f': toggleFisheye(); break;
        case 'v': toggleWormhole(); break;
        case 'e': incrementScramble(); break;
        case 'k': incrementPush(); break;
        case 'l': incrementPull(); break;
        case 'z': regenerateTemple(); break;
        case 'c': incrementContrastLevel(); break;
        case 'b': incrementBrightness(); break; // 'd' is used for debugger
        case 'n': toggleInvert(); break;
        case 'x': cycleColorPalette(); break;
        case 'g': toggleGlitch(); break;
        case 'q': incrementRandomizeOutline(); break;
        case 'o': toggleWireframe(); break;
        case 's': incrementSpreadRays(); break;
        case 't': incrementTightenRays(); break;
        case 'u': toggleChoppySpeed(); break;
        case 'm': toggleMirror(); break;
        case '\\':
          resetZoomLevel();
          setZoomTarget(5);
          useAppStore.setState((state) => ({
            cameraDistanceFromPivot: 5,
            cameraRotation: { x: 0, y: 0, z: 0 },
            targetCameraRotation: { x: 0, y: 0, z: 0 },
          }));
          useAppStore.getState().resetPivotPosition();
          break;
        // case 'd': toggleDebugger(); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleViewMode1, toggleViewMode2, toggleViewMode3,
    incrementTimeSpeed, decrementTimeSpeed, resetTimeSpeed,
    zoomTarget, setZoomTarget,
    toggleFisheye, toggleWormhole,
    incrementScramble, incrementPush, incrementPull,
    regenerateTemple,
    incrementContrastLevel, incrementBrightness,
    toggleInvert, cycleColorPalette, toggleGlitch,
    incrementRandomizeOutline, toggleWireframe,
    incrementSpreadRays, incrementTightenRays,
    toggleChoppySpeed, toggleMirror,
    // toggleDebugger,
    resetZoomLevel,
  ]);

  return null;
}
