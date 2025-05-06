import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export default function useDetectDeviceProfile() {
  const setDeviceProfile = useAppStore((s) => s.setDeviceProfile);

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isLowPower = navigator.hardwareConcurrency <= 2;

    const profile = isMobile
      ? (isLowPower ? "lowPower" : "mobile")
      : "desktop";

    setDeviceProfile(profile);
  }, []);
}