import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import { useThree } from '@react-three/fiber';

function MouseControls() {
  if (useAppStore.getState().useCameraControls) return null;
  const setZoomTarget = useAppStore((state) => state.setZoomTarget);
  const zoomTarget = useAppStore((state) => state.zoomTarget);
  const targetCameraRotation = useAppStore((state) => state.targetCameraRotation);
  const setCameraRotation = useAppStore((state) => state.setCameraRotation);
  const cameraOffset = useAppStore((state) => state.cameraOffset);
  const setCameraOffset = useAppStore((state) => state.setCameraOffset);
  const setFreeView = useAppStore((state) => state.setFreeView);

  const cameraDistanceFromPivot = useAppStore((state) => state.cameraDistanceFromPivot);
  const setCameraDistanceFromPivot = useAppStore((state) => state.setCameraDistanceFromPivot);

  const { camera } = useThree();

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragButton = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const currentZoom = useAppStore.getState().cameraDistanceFromPivot;
      if (event.deltaY > 0) {
        setCameraDistanceFromPivot(Math.min(150, currentZoom + 1.5));
      } else {
        setCameraDistanceFromPivot(Math.max(0.5, currentZoom - 1.5));
      }
    };

    const handleMouseDown = (event) => {
      isDragging.current = true;
      dragStart.current = { x: event.clientX, y: event.clientY };
      dragButton.current = event.button;
      if (event.shiftKey && event.button === 0) {
        useAppStore.setState({
          cameraRotation: {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z ?? 0,
          },
          targetCameraRotation: {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z ?? 0,
          },
        });
        setFreeView(true);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      dragButton.current = null;

      // Only sync state if we were in free view
      const wasFreeView = useAppStore.getState().freeView;
      if (wasFreeView) {
        const pivotDistance = useAppStore.getState().cameraDistanceFromPivot;

        // Improved calculation: use camera's world position and direction to find look target (pivot)
        const worldPosition = new THREE.Vector3();
        const worldDirection = new THREE.Vector3();
        camera.getWorldPosition(worldPosition);
        camera.getWorldDirection(worldDirection);

        // Use controlled cameraDistanceFromPivot for pivot calculation to avoid drift
        const lookTarget = new THREE.Vector3().copy(worldPosition).add(worldDirection.clone().normalize().multiplyScalar(cameraDistanceFromPivot));

        const worldQuat = camera.getWorldQuaternion(new THREE.Quaternion());
        const worldEuler = new THREE.Euler().setFromQuaternion(worldQuat);

        useAppStore.setState({
          pivotPosition: {
            x: lookTarget.x,
            y: lookTarget.y,
            z: lookTarget.z,
          },
          targetCameraRotation: {
            x: worldEuler.x,
            y: worldEuler.y,
            z: worldEuler.z,
          },
        });
      }

      setFreeView(false);
    };

    const handleMouseMove = (event) => {
      if (!isDragging.current) return;

      const dx = event.clientX - dragStart.current.x;
      const dy = event.clientY - dragStart.current.y;

      dragStart.current = { x: event.clientX, y: event.clientY };

      if (dragButton.current === 0) {
        // Left button - orbit
        if (!targetCameraRotation || !cameraOffset) return;

        const newRotation = {
          x: targetCameraRotation.x + dy * 0.02,
          y: targetCameraRotation.y + dx * 0.02,
        };
        setCameraRotation(newRotation);
      } else if (dragButton.current === 2) {
        // Right button - pan
        const newOffset = {
          x: cameraOffset.x + dx * 0.05,
          y: cameraOffset.y - dy * 0.05,
        };
        setCameraOffset(newOffset);
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        isDragging.current = true;
        dragStart.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
        dragButton.current = 0; // treat like left click
      }
    };

    const handleTouchMove = (event) => {
      if (!isDragging.current || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;

      dragStart.current = { x: touch.clientX, y: touch.clientY };

      if (!targetCameraRotation || !cameraOffset) return;

      const newRotation = {
        x: targetCameraRotation.x + dy * 0.002,
        y: targetCameraRotation.y + dx * 0.002,
      };
      setCameraRotation(newRotation);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      dragButton.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    setZoomTarget,
    zoomTarget,
    targetCameraRotation,
    setCameraRotation,
    cameraOffset,
    setCameraOffset,
    setFreeView,
    camera,
    cameraDistanceFromPivot,
    setCameraDistanceFromPivot,
  ]);

  return null;
}

export default MouseControls;