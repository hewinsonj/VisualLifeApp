export function detectDevice() {
    const ua = navigator.userAgent || '';
    const isMobile = /Mobi|Android/i.test(ua);
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    return { isMobile, isLowPower };
  }