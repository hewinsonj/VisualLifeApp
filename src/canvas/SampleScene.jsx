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

  const cameraMode = useAppStore((state) => state.cameraMode);

  // Force top view state immediately to avoid frame sync issues on refresh
  useEffect(() => {
    if (cameraMode === 'top') {
      useAppStore.setState({
        topViewActive: true,
        topYawVelocity: 0.002,
      });
    }
  }, [cameraMode]);

  useFrame(() => {
    updateCameraRotation();
    updateZoomLevel();
    const state = useAppStore.getState();
    const {
      cameraRotation,
      freeView,
      targetCameraRotation,
      pivotPosition,
      cameraDistanceFromPivot,
      cameraMode,
      zoomVelocity,
      zoomLevel,
      tiltAngle,
      yawAngle,
      topViewActive,
    } = state;

    if (cameraMode === 'zoom') {
      const elapsed = performance.now() * 0.001; // faster rotation
      const orbitSpeed = 0.6;
      const zoomOscillation = Math.sin(elapsed * 1.6) * 1.2;
      const verticalOscillation = Math.sin(elapsed * 2.0) * 0.5;

      const baseZoom = zoomLevel + zoomVelocity;
      const oscillatedZoom = baseZoom + zoomOscillation;

      const angle = elapsed * orbitSpeed;
      const x = Math.sin(angle) * oscillatedZoom;
      const z = Math.cos(angle) * oscillatedZoom;
      const y = verticalOscillation;

      cameraPivotRef.current.position.set(x, y, z);

      camera.position.set(0, 0, 0); // Neutralize local transform
      camera.lookAt(0, 0, 0);

      // console.log('🔍 Zoom camera update', {
      //   zoomVelocity,
      //   newZoom: oscillatedZoom,
      //   pivotZ: cameraPivotRef.current.position.z,
      //   localCameraZ: camera.position.z,
      //   worldCameraZ: camera.getWorldPosition(new THREE.Vector3()).z,
      // });

      return;
    }

    if (cameraMode === 'top') {
      useAppStore.setState({
        cameraDistanceFromPivot: 0,
        tiltAngle: 0,
        yawAngle: performance.now() * 0.001, // hot-patch to force non-zero angle
      });

      const elapsed = performance.now() * 0.001;
      const orbitRadius = 30;
      const x = Math.cos(elapsed) * orbitRadius;
      const z = Math.sin(elapsed) * orbitRadius;
      const y = 10;

      cameraPivotRef.current.position.set(x, y, z);
      camera.position.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
      camera.rotation.z = elapsed * 0.15;
      return;
    }

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

    if (
      cameraMode !== 'zoom' &&
      cameraMode !== 'top' &&
      !freeView &&
      !justExitedFreeView.current
    ) {
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

  // Inject scroll-based zoomVelocity update for 'zoom' mode
  useEffect(() => {
    const onWheel = (e) => {
      const { cameraMode } = useAppStore.getState();
      if (cameraMode === 'zoom') {
        e.preventDefault();
        useAppStore.setState((state) => ({
          zoomVelocity: state.zoomVelocity + e.deltaY * 0.002,
        }));
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // Trigger initial motion when views switch
  useEffect(() => {
    if (cameraMode === 'zoom') {
      useAppStore.setState({ zoomVelocity: 0.2 });
    } else if (cameraMode === 'top') {
      useAppStore.setState({
        topViewActive: true,
        topYawVelocity: 0.002,
      });
    }
  }, [cameraMode]);

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
        // onWheel={(e) => console.log('🎯 Canvas wheel', e.target)}
        // onMouseDown={(e) => console.log('🎯 Canvas mousedown', e.target)}
      >
        <CameraRig>
          <SceneContents />
        </CameraRig>
      </Canvas>
    </div>
  );
}