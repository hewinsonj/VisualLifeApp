import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import ZoomController from '../systems/ZoomController';
import KeyboardControls from '../input/KeyboardControls';
import MouseControls from '../input/MouseControls';

function SceneContents() {
  const cubeRef = useRef();

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <ZoomController />
      <KeyboardControls />
      <MouseControls />
      
      <mesh ref={cubeRef}>
        <boxGeometry />
        <meshStandardMaterial color="lime" />
      </mesh>
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  );
}

export default function SampleScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <SceneContents />
      </Canvas>
    </div>
  );
}