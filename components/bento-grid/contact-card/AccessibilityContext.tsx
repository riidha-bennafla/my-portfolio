// AccessibilityContext.ts

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AccessibilityConfig } from "./types";
import { CONFIG } from "./config";

const defaultConfig: AccessibilityConfig = {
  highContrast: false,
  reducedMotion: false,
  announceActions: true,
  keyboardNavigation: true,
};

const AccessibilityContext = createContext<AccessibilityConfig>(defaultConfig);

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [config, setConfig] = useState<AccessibilityConfig>(defaultConfig);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      CONFIG.MEDIA_QUERIES.REDUCED_MOTION
    ).matches;
    const highContrast = window.matchMedia(
      CONFIG.MEDIA_QUERIES.HIGH_CONTRAST
    ).matches;

    setConfig({
      ...defaultConfig,
      reducedMotion,
      highContrast,
    });
  }, []);

  return (
    <AccessibilityContext.Provider value={config}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
