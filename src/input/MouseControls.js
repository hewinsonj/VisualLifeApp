import { useEffect } from 'react';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { useAppStore } from '../store/useAppStore';
import { useThree } from '@react-three/fiber';

function MouseControls() {
  const setFreeView = useAppStore((state) => state.setFreeView);
  const cameraDistanceFromPivot = useAppStore((state) => state.cameraDistanceFromPivot);

  const { camera } = useThree();

  const controls = useAppStore.getState().cameraControls;
  // console.log('cameraControls in MouseControls:', controls);

  useEffect(() => {
    console.log('🎯 Controls created:', controls);

    // Log to verify controls.rotate is not being triggered by default
    if (controls && typeof controls.rotate === 'function') {
      console.log('controls.rotate function exists but not triggered by default');
    } else {
      console.log('controls.rotate function is not available');
    }

    const handleMouseDown = (event) => {
      console.log('Mouse down event:', event);
      console.log('Camera position on mouse down:', camera.position);
      console.log('Camera rotation on mouse down:', camera.rotation);
      if (event.shiftKey && event.button === 0) {
        console.log('Activating free view mode');
        setFreeView(true);
      }
    };

    const handleMouseUp = () => {
      console.log('Mouse up event');
      console.log('Camera position on mouse up:', camera.position);
      console.log('Camera rotation on mouse up:', camera.rotation);
      if (useAppStore.getState().freeView) {
        console.log('Deactivating free view mode');
        setFreeView(false);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setFreeView, cameraDistanceFromPivot, controls]);

  return null;
}

export default MouseControls;