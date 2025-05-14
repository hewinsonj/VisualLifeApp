import { useFrame, useThree } from "@react-three/fiber";
import { useAppStore } from "../store/useAppStore";

// ZoomController listens to global zoom state and applies it to the camera when not in free view
export default function ZoomController() {
  const { camera } = useThree();
  const cameraDistanceFromPivot = useAppStore((state) => state.cameraDistanceFromPivot);
  const freeView = useAppStore((state) => state.freeView);
  const cameraMode = useAppStore((state) => state.cameraMode);

  useFrame(() => {
    if (cameraMode !== 'zoom' && !freeView && camera && typeof cameraDistanceFromPivot === "number") {
      camera.position.z = cameraDistanceFromPivot;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}