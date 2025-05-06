import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import ZoomController from '../systems/ZoomController';
import KeyboardControls from '../input/KeyboardControls';
import MouseControls from '../input/MouseControls';
import { useAppStore } from '../store/useAppStore';

function SceneContents() {
  const cubeRef = useRef();
  const cameraGroupRef = useRef();
  const updateCameraRotation = useAppStore((state) => state.updateCameraRotation);

  useFrame(() => {
    updateCameraRotation();
    const { cameraRotation } = useAppStore.getState();

    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.x = cameraRotation.x;
      cameraGroupRef.current.rotation.y = cameraRotation.y;
    }
  });

  return (
    <>
      <ZoomController />
      <KeyboardControls />
      <MouseControls />

      <group ref={cameraGroupRef}>
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
        <SceneContents />
      </Canvas>
    </div>
  );
}