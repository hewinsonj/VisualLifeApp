import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import ZoomController from '../systems/ZoomController';
import KeyboardControls from '../input/KeyboardControls';
import MouseControls from '../input/MouseControls';
import { useAppStore } from '../store/useAppStore';
import CameraRig from './CameraRig';

function SceneContents() {
  const cubeRef = useRef();
  const cameraPivotRef = useRef();
  const updateCameraRotation = useAppStore((state) => state.updateCameraRotation);
  const updateZoomLevel = useAppStore((state) => state.updateZoomLevel);
  const zoomLevel = useAppStore((state) => state.zoomLevel);
  const freeView = useAppStore((state) => state.freeView);
  const prevMouse = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const [needsPivotSync, setNeedsPivotSync] = useState(false);

  const justExitedFreeView = useRef(false);
  const prevFreeView = useRef(false);

  useFrame(() => {
    updateCameraRotation();
    updateZoomLevel();
    const state = useAppStore.getState();
    const { cameraRotation, freeView, targetCameraRotation, pivotPosition, cameraDistanceFromPivot } = state;

    // Track free view exit
    if (prevFreeView.current && !freeView) {
      justExitedFreeView.current = true;
    }
    prevFreeView.current = freeView;

    if (freeView) {
      camera.rotation.x = cameraRotation.x;
      camera.rotation.y = cameraRotation.y;
      camera.rotation.z = cameraRotation.z ?? 0;
    } else if (cameraPivotRef.current) {
      cameraPivotRef.current.position.set(
        pivotPosition.x,
        pivotPosition.y,
        pivotPosition.z
      );

      if (justExitedFreeView.current) {
        cameraPivotRef.current.rotation.set(
          targetCameraRotation.x,
          targetCameraRotation.y,
          targetCameraRotation.z ?? 0
        );
      } else {
        cameraPivotRef.current.rotation.x = cameraRotation.x;
        cameraPivotRef.current.rotation.y = cameraRotation.y;
        cameraPivotRef.current.rotation.z = cameraRotation.z ?? 0;
      }

      camera.rotation.set(0, 0, 0);
    }

    if (!freeView && !justExitedFreeView.current) {
      camera.position.set(0, 0, cameraDistanceFromPivot);
    }

    justExitedFreeView.current = false;
  });

  useEffect(() => {
    const updateMouse = (e) => {
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  return (
    <>
      <ZoomController />
      <KeyboardControls />
      <MouseControls />

      <group ref={cameraPivotRef}>
        <primitive object={camera} />
      </group>

      <group>
        <mesh ref={cubeRef} position={[0, 0.5, 0]}>
          <boxGeometry />
          <meshStandardMaterial color="lime" />
        </mesh>

        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        <mesh position={[2, 0.5, -5]}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position={[-2, 0.5, -10]}>
          <boxGeometry />
          <meshStandardMaterial color="skyblue" />
        </mesh>

        <directionalLight position={[5, 5, 5]} intensity={1} />
      </group>
    </>
  );
}

export default function SampleScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: '#111' }}
        onWheel={(e) => console.log('🎯 Canvas wheel', e.target)}
        onMouseDown={(e) => console.log('🎯 Canvas mousedown', e.target)}
      >
        <CameraRig>
          <SceneContents />
        </CameraRig>
      </Canvas>
    </div>
  );
}