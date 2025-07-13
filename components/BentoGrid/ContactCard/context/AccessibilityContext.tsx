// components/BentoGrid/ContactCard/context/AccessibilityContext.tsx
"use client";
// =============================================
// Component Imports
// =============================================
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// =============================================
// Constants
// =============================================
/**
 * Media query strings for accessibility preferences
 * - Defined as constants for maintainability
 */
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CONTRAST_QUERY = "(prefers-contrast: more)";

// =============================================
// Type Definitions
// =============================================
/**
 * Context shape for accessibility preferences
 *
 * @property reducedMotion - Reduced motion preference status
 * @property highContrast - High contrast preference status
 * @property setReducedMotion - Function to update reduced motion setting
 * @property setHighContrast - Function to update high contrast setting
 */
interface AccessibilityContextType {
  reducedMotion: boolean;
  highContrast: boolean;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
}

// =============================================
// Context Creation
// =============================================
/**
 * Accessibility context instance with default values
 */
const AccessibilityContext = createContext<AccessibilityContextType>({
  reducedMotion: false,
  highContrast: false,
  setReducedMotion: () => {},
  setHighContrast: () => {},
});

// =============================================
// Browser Compatibility Extensions
// =============================================
/**
 * Extends Window interface for older browser support
 * - Ensures compatibility with legacy MediaQueryList implementations
 */
declare global {
  interface Window {
    MediaQueryList?: {
      prototype: MediaQueryList;
      new (): MediaQueryList;
    };
  }
}

// =============================================
// Main Provider Component
// =============================================
/**
 * Provides accessibility preferences to child components
 *
 * Features:
 * - Synchronizes with OS-level accessibility settings
 * - Supports both modern and legacy browser APIs
 * - Automatic cleanup of event listeners
 * - SSR-safe implementation
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 *
 * @returns {JSX.Element} Context provider wrapper
 */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // =============================================
  // State Management
  // =============================================
  /**
   * Tracks reduced motion preference
   * - Default: false (full motion enabled)
   */
  const [reducedMotion, setReducedMotion] = useState(false);

  /**
   * Tracks high contrast preference
   * - Default: false (standard contrast)
   */
  const [highContrast, setHighContrast] = useState(false);

  // =============================================
  // Media Query Initialization & Synchronization
  // =============================================
  useEffect(() => {
    // Exit during server-side rendering
    if (typeof window === "undefined") return;

    // =============================================
    // Event Handlers
    // =============================================
    /**
     * Handles changes to reduced motion preference
     * @param {MediaQueryListEvent} e - Media query event
     */
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    /**
     * Handles changes to high contrast preference
     * @param {MediaQueryListEvent} e - Media query event
     */
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    // Media query instances
    let motionMediaQuery: MediaQueryList | null = null;
    let contrastMediaQuery: MediaQueryList | null = null;

    try {
      // =============================================
      // Media Query Initialization
      // =============================================
      // Create media query watchers
      motionMediaQuery = window.matchMedia(MOTION_QUERY);
      contrastMediaQuery = window.matchMedia(CONTRAST_QUERY);

      // Set initial state from system preferences
      setReducedMotion(motionMediaQuery.matches);
      setHighContrast(contrastMediaQuery.matches);

      // =============================================
      // Event Listener Registration
      // =============================================
      // Modern browsers (addEventListener)
      if (motionMediaQuery.addEventListener) {
        motionMediaQuery.addEventListener("change", handleMotionChange);
      }
      // Legacy browsers (addListener)
      else if (motionMediaQuery.addListener) {
        motionMediaQuery.addListener(handleMotionChange);
      }

      // Modern browsers (addEventListener)
      if (contrastMediaQuery.addEventListener) {
        contrastMediaQuery.addEventListener("change", handleContrastChange);
      }
      // Legacy browsers (addListener)
      else if (contrastMediaQuery.addListener) {
        contrastMediaQuery.addListener(handleContrastChange);
      }
    } catch (error) {
      // Handle initialization errors
      console.error("Media query initialization failed:", error);
    }

    // =============================================
    // Cleanup Function
    // =============================================
    return () => {
      try {
        // Remove motion preference listeners
        if (motionMediaQuery) {
          if (motionMediaQuery.removeEventListener) {
            motionMediaQuery.removeEventListener("change", handleMotionChange);
          } else if (motionMediaQuery.removeListener) {
            motionMediaQuery.removeListener(handleMotionChange);
          }
        }

        // Remove contrast preference listeners
        if (contrastMediaQuery) {
          if (contrastMediaQuery.removeEventListener) {
            contrastMediaQuery.removeEventListener(
              "change",
              handleContrastChange
            );
          } else if (contrastMediaQuery.removeListener) {
            contrastMediaQuery.removeListener(handleContrastChange);
          }
        }
      } catch (cleanupError) {
        // Handle cleanup errors
        console.error("Media query cleanup failed:", cleanupError);
      }
    };
  }, []);

  // =============================================
  // Context Value Optimization
  // =============================================
  /**
   * Memoized context value to prevent unnecessary re-renders
   * - Only updates when accessibility preferences change
   */
  const contextValue = useMemo(
    () => ({
      reducedMotion,
      highContrast,
      setReducedMotion,
      setHighContrast,
    }),
    [reducedMotion, highContrast]
  );

  // =============================================
  // Provider Rendering
  // =============================================
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// =============================================
// Custom Hook Exports
// =============================================
/**
 * Hook to access the full accessibility context
 * @returns {AccessibilityContextType} Accessibility context values
 */
export const useAccessibilityContext = () => useContext(AccessibilityContext);

/**
 * Hook to check reduced motion preference
 * @returns {boolean} Current reduced motion setting
 */
export const usePrefersReducedMotion = () =>
  useAccessibilityContext().reducedMotion;

/**
 * Hook to check high contrast preference
 * @returns {boolean} Current high contrast setting
 */
export const usePrefersHighContrast = () =>
  useAccessibilityContext().highContrast;
