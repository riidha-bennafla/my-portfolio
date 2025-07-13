// components/BentoGrid/ContactCard/utils/haptics.ts

// =============================================
// Safety Constants
// =============================================
const MAX_VIBRATION_DURATION = 10000; // 10 seconds max per pattern
const MAX_VIBRATION_PATTERN_LENGTH = 10; // Max vibration sequence items

// =============================================
// Type Definitions
// =============================================
/**
 * Haptic feedback variants
 * - success: Short positive confirmation
 * - error: Distinct error pattern
 * - light: Subtle notification
 * - medium: Standard feedback
 * - heavy: Strong emphasis
 */
export type HapticType = "success" | "error" | "light" | "medium" | "heavy";

// =============================================
// Platform Detection
// =============================================
/**
 * Detects if the user prefers reduced motion
 * @returns Reduced motion preference status
 */
const prefersReducedMotion = (): boolean => {
  // Check for SSR safety
  if (typeof window === "undefined" || !window.matchMedia) return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Detects the current platform
 * @returns {"ios" | "android" | "other"} Platform identifier
 */
const detectPlatform = (): "ios" | "android" | "other" => {
  if (typeof navigator === "undefined") return "other";

  const { userAgent } = navigator;
  if (/iPad|iPhone|iPod/.test(userAgent)) return "ios";
  if (/Android/.test(userAgent)) return "android";

  return "other";
};

// =============================================
// Core Implementation
// =============================================
/**
 * Triggers device vibration for haptic feedback
 *
 * @param type - Haptic feedback variant
 * @param enabled - Master toggle (default: true)
 */
export const triggerHapticFeedback = (
  type: HapticType,
  enabled: boolean = true
): void => {
  // Exit early if reduced motion is preferred
  if (prefersReducedMotion()) return;

  // Exit early if disabled or unavailable
  if (!enabled || !("vibrate" in navigator)) return;

  const platform = detectPlatform();

  // Platform-specific pattern definitions (milliseconds)
  const platformPatterns = {
    // iOS doesn't support navigator.vibrate, but we keep patterns for future APIs
    ios: {
      success: [50],
      error: [100, 50, 100],
      light: [10],
      medium: [50],
      heavy: [100],
    },
    android: {
      success: [50],
      error: [100, 50, 100],
      light: [10],
      medium: [50],
      heavy: [100],
    },
    // Default patterns for other platforms
    other: {
      success: [50],
      error: [200], // Longer pulse for error
      light: [10],
      medium: [50],
      heavy: [100],
    },
  };

  const pattern = platformPatterns[platform][type];

  // Validate pattern safety
  if (pattern.length > MAX_VIBRATION_PATTERN_LENGTH) {
    console.warn(`Haptic pattern too long (${type})`);
    return;
  }

  const totalDuration = pattern.reduce((sum, duration) => sum + duration, 0);
  if (totalDuration > MAX_VIBRATION_DURATION) {
    console.warn(`Haptic duration too long (${totalDuration}ms)`);
    return;
  }

  try {
    // Attempt vibration (Android and other platforms)
    if (platform !== "ios") {
      navigator.vibrate(pattern);
    }
    // iOS requires different haptic APIs (not implemented here)
  } catch (error) {
    console.error("Haptic feedback failed:", error);
  }
};

// =============================================
// Compatibility Check
// =============================================
/**
 * Checks if haptic feedback is supported
 *
 * @returns Support status
 */
export const isHapticSupported = (): boolean => {
  // Check for reduced motion preference first
  if (prefersReducedMotion()) return false;

  // iOS requires different APIs (WebKitHaptic)
  if (detectPlatform() === "ios") {
    return typeof window !== "undefined" && "WebKitHaptic" in window;
  }

  return "vibrate" in navigator;
};
