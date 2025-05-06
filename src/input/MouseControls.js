

import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

function MouseControls() {
  const incrementZoomLevel = useAppStore((state) => state.incrementZoomLevel);
  const decrementZoomLevel = useAppStore((state) => state.decrementZoomLevel);

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        decrementZoomLevel();
      } else {
        incrementZoomLevel();
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [incrementZoomLevel, decrementZoomLevel]);

  return null;
}

export default MouseControls;