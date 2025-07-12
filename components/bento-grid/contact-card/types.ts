// types.ts

import { BentoCardProps } from "../types";

export interface ContactCardProps extends BentoCardProps {
  email?: string;
  enableAudio?: boolean;
  enableHaptics?: boolean;
  enableConfetti?: boolean;
  enableAnalytics?: boolean;
  theme?: "light" | "dark" | "auto";
  locale?: string;
  onCopySuccess?: (email: string, metadata: AnalyticsMetadata) => void;
  onCopyError?: (
    error: string,
    email: string,
    metadata: AnalyticsMetadata
  ) => void;
  performanceConfig?: PerformanceConfig;
  accessibilityConfig?: AccessibilityConfig;
}

export interface ToastState {
  message: string;
  type: "error" | "success" | "info" | "warning";
  id: number;
  duration?: number;
}

export interface ClipboardState {
  copied: boolean;
  loading: boolean;
  error: string | null;
  retryCount: number;
  lastCopyTime: number | null;
}

export interface AnalyticsMetadata {
  timestamp: number;
  userAgent: string;
  method: "modern" | "fallback";
  retryCount: number;
  duration: number;
  preferredLanguage: string;
}

export interface PerformanceConfig {
  enableMetrics: boolean;
  metricsEndpoint?: string;
  debounceMs: number;
  retryDelay: number;
}

export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  announceActions: boolean;
  keyboardNavigation: boolean;
}

export interface AudioContextManager {
  context: AudioContext | null;
  isSupported: boolean;
  isEnabled: boolean;
}

export interface PerformanceMetrics {
  componentRenderTime: number;
  clipboardOperationTime: number;
  audioInitTime: number;
  animationFrameTime: number;
  memoryUsage: number;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, string | number | boolean>;
  timestamp: number;
}
