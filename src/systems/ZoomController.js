import { useFrame, useThree } from "@react-three/fiber";
import { useAppStore } from "../store/useAppStore";

// ZoomController listens to global zoomLevel and applies it to the camera
export default function ZoomController() {
  const { camera } = useThree();
  const zoomLevel = useAppStore((state) => state.zoomLevel);

  useFrame(() => {
    if (camera && typeof zoomLevel === "number") {
      camera.position.z = zoomLevel;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}