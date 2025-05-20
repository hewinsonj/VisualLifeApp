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
  const topTimeRef = useRef(0);

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
    //   console.log("➡️ Exiting cam-controls to custom mode");
    //   console.log("📍 Position:", pos.toArray());
    //   console.log("🎯 Target:", tgt.toArray());
    // } else {
    //   const { cameraPosition, pivotPosition } = useAppStore.getState();
    //   console.log("↩️ Entering cam-controls mode with:");
    //   console.log("📍 Position from store:", cameraPosition);
    //   console.log("🎯 Pivot from store:", pivotPosition);
    }
  }, [useCameraControls]);

  useFrame((state, delta) => {
    const cameraMode = useAppStore.getState().cameraMode;
    const {
      zoomLevel,
      zoomVelocity,
      tiltAngle,
      yawAngle,
      updateTiltYawAngles,
    } = useAppStore.getState();

    if (useCameraControls && cameraControlsRef.current) {
      cameraControlsRef.current.update(delta);
    } else if (cameraMode === 'zoom') {
      const newZoom = zoomLevel + zoomVelocity;
      useAppStore.setState({ zoomLevel: newZoom, zoomVelocity: zoomVelocity * 0.9 });
      state.camera.position.set(0, 0, newZoom);
      state.camera.lookAt(0, 0, 0);
    } else if (cameraMode === 'top') {
      const { timeScale } = useAppStore.getState();
      topTimeRef.current += delta * timeScale;
      useAppStore.setState({
        cameraDistanceFromPivot: 0,
        tiltAngle: 0,
        yawAngle: topTimeRef.current,
      });

      const elapsed = topTimeRef.current;
      const orbitRadius = 30;
      const x = Math.cos(elapsed) * orbitRadius;
      const z = Math.sin(elapsed) * orbitRadius;
      const y = 10;

      // Assuming cameraPivotRef is accessible here, otherwise this line needs adjustment
      // Since it's not defined in this file, commenting out to avoid error
      // cameraPivotRef.current.position.set(x, y, z);

      state.camera.position.set(0, 0, 0);
      state.camera.lookAt(0, 0, 0);
      state.camera.rotation.z = elapsed * 0.15;
      return;
    }
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