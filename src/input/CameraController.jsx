import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import '../utils/setupCameraControls';
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';


function CameraController() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const setCameraControls = useAppStore((state) => state.setCameraControls);

  useEffect(() => {
    const controls = new CameraControls(camera, gl.domElement);
    controlsRef.current = controls;
    controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    controls.mouseButtons.middle = CameraControls.ACTION.ZOOM;
    controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
    console.log('controls object methods:', Object.keys(controls));
    // controls.listenToKeyEvents(window); // Not available in current camera-controls version
    controls.connect(gl.domElement);
    setCameraControls(controls);

    console.log('🎯 Controls created:', controls);
    console.log('🎯 gl.domElement:', gl.domElement);
    gl.domElement.addEventListener('pointerdown', () => {
      console.log('📌 Pointerdown hit gl.domElement');
    });

    return () => {
      setCameraControls(null);
      controls.dispose();
    };
  }, [camera, gl, setCameraControls]);

  useFrame((_, delta) => {
    controlsRef.current?.update(delta);
  });

  return null;
}

export default CameraController;