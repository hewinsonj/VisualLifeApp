import { useThree, extend, useFrame } from '@react-three/fiber';
import CameraControlsLib from 'camera-controls';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

// Required for CameraControls to bind to THREE
CameraControlsLib.install({ THREE });
extend({ CameraControls: CameraControlsLib });

export default function CameraRig({ children }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const useCameraControls = useAppStore((s) => s.useCameraControls);
  const cameraControlsRef = useRef();

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragButton = useRef(null);

  useEffect(() => {
    if (
      useCameraControls &&
      cameraControlsRef.current &&
      !cameraControlsRef.current._isInitialized
    ) {
      cameraControlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
      cameraControlsRef.current._isInitialized = true;
    }
  }, [useCameraControls]);

  useEffect(() => {
    if (!useCameraControls) return;

    const handleMouseDown = (event) => {
      if (event.shiftKey && event.button === 0) {
        isDragging.current = true;
        dragStart.current = { x: event.clientX, y: event.clientY };
        dragButton.current = event.button;
        // Removed call to setDragging
      }
    };

    const handleMouseMove = (event) => {
      if (!isDragging.current || dragButton.current !== 0) return;

      const dx = event.clientX - dragStart.current.x;
      const dy = event.clientY - dragStart.current.y;
      dragStart.current = { x: event.clientX, y: event.clientY };

      cameraControlsRef.current?.rotate(dx * -0.005, dy * -0.005, true);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      dragButton.current = null;
      // Removed call to setDragging
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [useCameraControls]);

  useEffect(() => {
    if (!useCameraControls || !cameraControlsRef.current) return;

    const handleKeyDown = (e) => {
      const controls = cameraControlsRef.current;
      if (!controls) return;

      const moveSpeed = 1.2;
      switch (e.code) {
        case 'KeyW':
          controls.forward(moveSpeed, true);
          break;
        case 'KeyS':
          controls.forward(-moveSpeed, true);
          break;
        case 'KeyA':
          controls.truck(-moveSpeed, 0, true);
          break;
        case 'KeyD':
          controls.truck(moveSpeed, 0, true);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [useCameraControls]);

  useFrame((state, delta) => {
    if (useCameraControls && cameraControlsRef.current) {
      cameraControlsRef.current.update(delta);
    }
    // else {
    //   camera.position.set(...) // removed fallback camera override logic
    // }
  });

  return (
    <>
      {useCameraControls && (
        <cameraControls
          ref={cameraControlsRef}
          args={[camera, gl.domElement]}
          enabled={true}
          dollySpeed={2.0}
          truckSpeed={2.0}
          dragToOrbit={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          maxAzimuthAngle={Infinity}
          minAzimuthAngle={-Infinity}
          touches={{
            one: CameraControlsLib.ACTION.TOUCH_ROTATE,
            two: CameraControlsLib.ACTION.TOUCH_DOLLY_TRUCK,
            three: CameraControlsLib.ACTION.TOUCH_TRUCK,
          }}
          mouseButtons={{
            left: CameraControlsLib.ACTION.ROTATE,
            middle: CameraControlsLib.ACTION.DOLLY,
            right: CameraControlsLib.ACTION.TRUCK,
            wheel: CameraControlsLib.ACTION.DOLLY,
          }}
        />
      )}
      {children}
    </>
  );
}