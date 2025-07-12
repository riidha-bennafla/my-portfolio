// components/contact/ContactCard/context/AccessibilityContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  reducedMotion: boolean;
  highContrast: boolean;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reducedMotion: false,
  highContrast: false,
  setReducedMotion: () => {},
  setHighContrast: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check system preferences
    const motionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const contrastMediaQuery = window.matchMedia("(prefers-contrast: more)");

    setReducedMotion(motionMediaQuery.matches);
    setHighContrast(contrastMediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    motionMediaQuery.addEventListener("change", handleMotionChange);
    contrastMediaQuery.addEventListener("change", handleContrastChange);

    return () => {
      motionMediaQuery.removeEventListener("change", handleMotionChange);
      contrastMediaQuery.removeEventListener("change", handleContrastChange);
    };
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        reducedMotion,
        highContrast,
        setReducedMotion,
        setHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = () => useContext(AccessibilityContext);
export const usePrefersReducedMotion = () =>
  useAccessibilityContext().reducedMotion;
export const usePrefersHighContrast = () =>
  useAccessibilityContext().highContrast;
