// components/BentoGrid/ContactCard/index.tsx

// =============================================
// Component Exports
// =============================================
export { default as ContactCard } from "./ContactCard";
export { default as Toast } from "./Toast";
export * from "./ContactButton";

// =============================================
// Context Providers
// =============================================
export * from "./context/AccessibilityContext";

// =============================================
// Hook Exports
// =============================================
export * from "./hooks/useAudioFeedback";
export * from "./hooks/useClipboard";
export * from "./hooks/useTranslation";
export * from "./hooks/useToast";

// =============================================
// Utility Functions
// =============================================
export * from "./utils/clipboard";
export * from "./utils/constants";
export * from "./utils/haptics";

// =============================================
// Type Exports (Explicit for better TS support)
// =============================================
export type {
  CardProps,
  ContactProps,
  AnalyticsEvent,
  PerformanceMetrics,
  Theme,
  Accessibility,
  CardContext,
  Position,
  BentoCard,
  Locale,
} from "./types";
