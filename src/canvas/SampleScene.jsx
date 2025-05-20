import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';
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
  const prevCameraMode = useRef(null);

  const justExitedFreeView = useRef(false);
  const prevFreeView = useRef(false);

  const cameraMode = useAppStore((state) => state.cameraMode);
  const timeScale = useAppStore((state) => state.timeScale);

  const prevMode = useRef(null);

  const zoomTime = useRef(0);
  const topTime = useRef(0);

  const pause = timeScale === 0;

  // Flipping bounce logic: useFrame-based timer for timeScale-accurate flipping
  const [flipped, setFlipped] = useState(false);
  const flipTime = useRef(0);
  const bounceDuration = 1; // seconds

  const { position } = useSpring({
    to: { position: flipped ? [0, 1, 0] : [0, 0.25, 0] },
    config: { mass: 1, tension: 80, friction: 12 },
    pause: timeScale === 0,
  });

  const orangeSpring = useSpring({
    to: { position: flipped ? [1.5, 1, -3] : [1.5, 0.25, -3] },
    config: { mass: 1, tension: 80, friction: 12 },
    pause: timeScale === 0,
  });

  const blueSpring = useSpring({
    to: { position: flipped ? [-1.5, 1, -3] : [-1.5, 0.25, -3] },
    config: { mass: 1, tension: 80, friction: 12 },
    pause: timeScale === 0,
  });

  const topEntryFrameCount = useRef(0);

  // (Removed: temporary handshake forcing jump to 'zoom' before 'top' mode)

  // (Removed: legacy top view spin/init effects now replaced by single handshake above)

  useFrame((state, delta) => {
    // Flipping bounce logic (runs before zoom/top mode blocks)
    if (timeScale > 0) {
      flipTime.current += delta * timeScale;
      if (flipTime.current >= bounceDuration) {
        flipTime.current = 0;
        setFlipped(f => !f);
      }
    }
    const { topYawVelocity, cameraMode } = useAppStore.getState();
    if (cameraMode === 'top') {
      console.log('[useFrame check] topYawVelocity:', topYawVelocity);
    }
    // Only update tilt/yaw angles if time is flowing
    if (timeScale > 0) {
      const updateTiltYawAngles = useAppStore.getState().updateTiltYawAngles;
      updateTiltYawAngles();
    }
    updateCameraRotation();
    updateZoomLevel();
    const stateStore = useAppStore.getState();

    // Ensure spin is initialized if landing directly in top view
    if (stateStore.cameraMode === 'top') {
      const spinVelocityConst = 0.002;
      if (stateStore.topYawVelocity !== spinVelocityConst) {
        console.log('🔁 Ensuring topYawVelocity is set in top view');
        useAppStore.setState({ topYawVelocity: spinVelocityConst });
      }
    }

    const {
      cameraRotation,
      freeView,
      targetCameraRotation,
      pivotPosition,
      cameraDistanceFromPivot,
      cameraMode: currentCameraMode,
      zoomVelocity,
      zoomLevel,
      tiltAngle,
      yawAngle,
      topViewActive,
    } = stateStore;

    const enteringZoom = prevMode.current !== currentCameraMode && currentCameraMode === 'zoom';
    const enteringTop = prevMode.current !== currentCameraMode && currentCameraMode === 'top';

    if (currentCameraMode === 'zoom') {
      zoomTime.current += delta * timeScale;
      const orbitSpeed = 0.6;
      const zoomOscillation = Math.sin(zoomTime.current * 1.6) * 1.2;
      const verticalOscillation = Math.sin(zoomTime.current * 2.0) * 0.5;

      const baseZoom = zoomLevel + zoomVelocity;
      const oscillatedZoom = baseZoom + zoomOscillation;

      const angle = zoomTime.current * orbitSpeed;
      const x = Math.sin(angle) * oscillatedZoom;
      const z = Math.cos(angle) * oscillatedZoom;
      const y = verticalOscillation;

      cameraPivotRef.current.position.set(x, y, z);

      if (enteringZoom) {
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 0, 0);
      }

      // console.log('🔍 Zoom camera update', {
      //   zoomVelocity,
      //   newZoom: oscillatedZoom,
      //   pivotZ: cameraPivotRef.current.position.z,
      //   localCameraZ: camera.position.z,
      //   worldCameraZ: camera.getWorldPosition(new THREE.Vector3()).z,
      // });

      prevMode.current = currentCameraMode;
      return;
    }

    if (currentCameraMode === 'top') {
      topTime.current += delta * timeScale;

      topEntryFrameCount.current++;

      if (topEntryFrameCount.current === 1) {
        camera.updateMatrix();
        camera.updateMatrixWorld(true);
        cameraPivotRef.current.updateMatrixWorld?.();
        console.log('🔧 Forced matrix sync on first top frame', {
          pivot: cameraPivotRef.current?.position,
          camRot: camera.rotation,
        });
        console.log('🔁 [TOP INIT] First frame in top view', {
          pivot: cameraPivotRef.current?.position,
          spinVelocity: useAppStore.getState().topYawVelocity,
          camRot: camera.rotation,
        });
        cameraPivotRef.current.rotation.set(0, 0, 0);
      }

      // Ensure pivot position is initialized
      if (!cameraPivotRef.current.position) {
        cameraPivotRef.current.position = new THREE.Vector3(0, 10, 30);
      }
      cameraPivotRef.current.position.set(
        cameraPivotRef.current.position.x ?? 0,
        cameraPivotRef.current.position.y ?? 10,
        cameraPivotRef.current.position.z ?? 30
      );

      if (!cameraPivotRef.current.rotation) {
        cameraPivotRef.current.rotation = new THREE.Euler(0, 0, 0);
      }
      // cameraPivotRef.current.rotation.set(0, 0, 0);

      // ⏱ Apply global timeScale to elapsed time
      const orbitRadius = 30;
      let spinVelocity = useAppStore.getState().topYawVelocity;

      if (spinVelocity === 0) {
        console.warn('⚠️ Detected stuck spin velocity, forcing reset');
        spinVelocity = 0.002;
        useAppStore.setState({ topYawVelocity: spinVelocity });
      }

      const x = Math.cos(topTime.current) * orbitRadius;
      const z = Math.sin(topTime.current) * orbitRadius;
      const y = 10;

      cameraPivotRef.current.position.set(x, y, z);
      camera.position.set(0, 0, 0);
      if (enteringTop) {
        camera.lookAt(0, 0, 0);
      }
      camera.updateMatrix();
      camera.updateMatrixWorld(true);
      cameraPivotRef.current.updateMatrixWorld(true);

      if (topEntryFrameCount.current > 1) {
        const spinAngle = spinVelocity * topTime.current;
        cameraPivotRef.current.rotation.y = spinAngle;
        console.log('🌀 Spin angle applied to pivot:', spinAngle);
        console.log('🔁 pivot rotation.y:', cameraPivotRef.current.rotation.y);
      }

      prevMode.current = currentCameraMode;
      return;
    }
    
    // Track free view exit
    if (prevFreeView.current && !freeView) {
      justExitedFreeView.current = true;
    }
    prevFreeView.current = freeView;

    if (currentCameraMode === 'control') {
      // OrbitControls-style spherical coordinate camera positioning to avoid gimbal issues
      const radius = cameraDistanceFromPivot;
      // Prevent yawAngle and tiltAngle from updating when timeScale === 0
      // (Assume cameraRotation is updated via updateTiltYawAngles, which is now gated above)
      const phi = Math.max(0.01, Math.min(Math.PI - 0.01, cameraRotation.x + Math.PI / 2));
      const theta = cameraRotation.y;
      const spherical = new THREE.Spherical(radius, phi, theta);
      const target = new THREE.Vector3();
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    } else if (cameraPivotRef.current && currentCameraMode !== 'top') {
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
      // No longer reset camera.rotation here!
    }

    if (
      currentCameraMode !== 'zoom' &&
      currentCameraMode !== 'top' &&
      !freeView &&
      !justExitedFreeView.current
    ) {
      camera.position.set(0, 0, cameraDistanceFromPivot);
    }

    if (currentCameraMode !== 'top') topEntryFrameCount.current = 0;

    justExitedFreeView.current = false;

    prevMode.current = currentCameraMode;
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
    }
  }, [cameraMode]);

  // Ensure camera is attached to pivot and matrices synced when entering top view
  useEffect(() => {
    if (cameraMode === 'top') {
      if (cameraPivotRef.current && camera && !cameraPivotRef.current.children.includes(camera)) {
        cameraPivotRef.current.add(camera);
        console.log('📌 Attached camera to pivot in top view');
        camera.updateMatrix();
        camera.updateMatrixWorld(true);
        cameraPivotRef.current.updateMatrixWorld(true);
      }
    }
  }, [cameraMode, camera]);

  // Log pivot/camera state on every cameraMode change
  useEffect(() => {
    // Defensive: cameraPivotRef.current may be undefined on first render
    console.log('[MODE INIT]', cameraMode, {
      pivot: cameraPivotRef.current?.position,
      camPos: camera.position,
      camRot: camera.rotation,
    });
  }, [cameraMode]);

  // Manual matrix sync when exiting "default" view
  useEffect(() => {
    const prevMode = prevCameraMode.current;
    if (prevMode === 'default' && cameraMode !== 'default') {
      console.log('✨ Potential matrix sync on exiting default');

      camera.updateMatrix();
      camera.updateMatrixWorld(true);

      if (cameraPivotRef.current) {
        cameraPivotRef.current.position.set(0, 0, 10); // mimic zoom offset
        cameraPivotRef.current.updateMatrixWorld(true);
      }

      camera.position.set(0, 0, 0); // neutralize transform
      camera.lookAt(0, 0, 0);       // orient toward origin
    }
    prevCameraMode.current = cameraMode;
  }, [cameraMode, camera]);

  return (
    <>
      <ZoomController />
      <KeyboardControls />
      <MouseControls />

      <group ref={cameraPivotRef}>
        <primitive object={camera} />
      </group>

      <group>
        <a.mesh ref={cubeRef} position={position}>
          <boxGeometry />
          <meshStandardMaterial color="lime" />
        </a.mesh>

        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        <a.mesh position={orangeSpring.position}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </a.mesh>

        <a.mesh position={blueSpring.position}>
          <boxGeometry />
          <meshStandardMaterial color="skyblue" />
        </a.mesh>

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