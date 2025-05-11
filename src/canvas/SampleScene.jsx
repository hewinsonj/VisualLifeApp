import React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import ZoomController from '../systems/ZoomController';
import KeyboardControls from '../input/KeyboardControls';
import MouseControls from '../input/MouseControls';
import CameraController from '../input/CameraController';
import { useAppStore } from '../store/useAppStore';


function SceneContents() {
  const cubeRef = useRef();
  const updateZoomLevel = useAppStore((state) => state.updateZoomLevel);
  const zoomLevel = useAppStore((state) => state.zoomLevel);
  const freeView = useAppStore((state) => state.freeView);
  const prevMouse = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  const prevFreeView = useRef(false);

  useFrame((state, delta) => {
    updateZoomLevel();
    const controls = useAppStore.getState().cameraControls;
    if (controls) {
      controls.update(delta);
    }

    const { freeView } = useAppStore.getState();
    prevFreeView.current = freeView;
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

      <primitive object={camera} />

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
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: '#111' }}>
        <CameraController />
        <SceneContents />
      </Canvas>
    </div>
  );
}