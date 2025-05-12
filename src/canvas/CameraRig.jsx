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

  useEffect(() => {
    if (!cameraControlsRef.current) return;

    if (!useCameraControls) {
      const pos = cameraControlsRef.current.getPosition(new THREE.Vector3());
      const tgt = cameraControlsRef.current.getTarget(new THREE.Vector3());
      console.log("➡️ Exiting cam-controls to custom mode");
      console.log("📍 Position:", pos.toArray());
      console.log("🎯 Target:", tgt.toArray());
    } else {
      const { cameraPosition, pivotPosition } = useAppStore.getState();
      console.log("↩️ Entering cam-controls mode with:");
      console.log("📍 Position from store:", cameraPosition);
      console.log("🎯 Pivot from store:", pivotPosition);
    }
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
          minPolarAngle={-Infinity}
          maxPolarAngle={Infinity}
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