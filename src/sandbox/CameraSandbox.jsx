import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import '../utils/setupCameraControls';
import CameraControls from 'camera-controls';
// CameraControls.install({ THREE }) is handled in '../utils/setupCameraControls'

function SandboxControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [freeViewEnabled, setFreeViewEnabled] = useState(false);
  const [keysPressed, setKeysPressed] = useState({});
  const [isDraggingFreeView, setIsDraggingFreeView] = useState(false);
  const pointerDelta = useRef([0, 0]);
  const prevPointer = useRef([0, 0]);
  const savedPosition = useRef(new THREE.Vector3());
  const savedDirection = useRef(new THREE.Vector3());

  useEffect(() => {
    const controls = new CameraControls(camera, gl.domElement);
    controlsRef.current = controls;

    controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    controls.mouseButtons.middle = CameraControls.ACTION.ZOOM;
    controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
    // Always call connect after creation, no need to check .connected
    if (!controls._domElement) {
      controls.connect(gl.domElement);
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setFreeViewEnabled(true);
        controls.enabled = false;
        controlsRef.current.setPosition(camera.position.x, camera.position.y, camera.position.z, false);
        savedPosition.current.copy(camera.position);
        camera.getWorldDirection(savedDirection.current);
      }
      setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setFreeViewEnabled(false);
        setIsDraggingFreeView(false);

        controlsRef.current.setPosition(camera.position.x, camera.position.y, camera.position.z, false);
        controlsRef.current.setTarget(
          camera.position.x + camera.getWorldDirection(new THREE.Vector3()).x,
          camera.position.y + camera.getWorldDirection(new THREE.Vector3()).y,
          camera.position.z + camera.getWorldDirection(new THREE.Vector3()).z,
          false
        );

        controls.enabled = true;
        controls.update(0);
      }
      setKeysPressed(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    const handleMouseDown = (e) => {
      if (e.button === 0 && e.shiftKey) {
        setIsDraggingFreeView(true);
        prevPointer.current = [e.clientX, e.clientY];
      }
    };

    const handleMouseUp = () => {
      setIsDraggingFreeView(false);
    };

    const handlePointerMove = (e) => {
      if (isDraggingFreeView) {
        pointerDelta.current = [e.clientX - prevPointer.current[0], e.clientY - prevPointer.current[1]];
        prevPointer.current = [e.clientX, e.clientY];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handlePointerMove);

    return () => {
      controls.dispose();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [camera, gl, isDraggingFreeView]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (isDraggingFreeView) {
      const [prevX, prevY] = prevPointer.current;
      const movementX = pointerDelta.current[0];
      const movementY = pointerDelta.current[1];

      camera.rotation.y -= movementX * 0.002;
      camera.rotation.x -= movementY * 0.002;
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

      pointerDelta.current = [0, 0];
    } else if (freeViewEnabled) {
      const speed = 5 * delta;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      if (keysPressed.w) camera.position.addScaledVector(direction, speed);
      if (keysPressed.s) camera.position.addScaledVector(direction, -speed);

      const strafe = new THREE.Vector3();
      strafe.crossVectors(camera.up, direction).normalize();

      if (keysPressed.a) camera.position.addScaledVector(strafe, speed);
      if (keysPressed.d) camera.position.addScaledVector(strafe, -speed);
    }

    if (!freeViewEnabled && controlsRef.current?.enabled) {
      controlsRef.current.update(delta);
    }
  });

  return null;
}

function Cube() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function CameraSandbox() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Cube />
      <SandboxControls />
    </Canvas>
  );
}