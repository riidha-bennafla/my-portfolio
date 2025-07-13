// components/BentoGrid/ContactCard/types.ts

// =============================================
// Core Card Properties
// =============================================
/**
 * Base properties for all Bento grid cards
 *
 * Implements atomic design principles with strict type safety
 * Supports Next.js image optimization patterns
 */
export interface BentoCardProps {
  /** Unique component identifier for analytics/DOM */
  id?: string;

  /** Primary heading (max 60 characters) */
  title?: string;

  /** Supporting content explaining card purpose */
  description?: string | React.ReactNode;

  /**
   * Main visual element - optimized Next.js images
   * @example
   * import cardImage from '@/public/card.jpg'
   * <BentoCard img={cardImage} />
   */
  img?: StaticImageData | string;

  /** Decorative background image */
  spareImg?: StaticImageData | string;

  /** Custom image container styling */
  imgClassName?: string;

  /** Title element styling overrides */
  titleClassName?: string;

  /** Root container class names */
  className?: string;

  /** Custom header component slot */
  header?: React.ReactNode;

  /** Custom footer component slot */
  footer?: React.ReactNode;

  /** Primary interaction handler */
  onClick?: () => void;

  /** Entrance animation variant */
  animation?: "fadeIn" | "slideUp" | "scaleIn" | "none";

  /** Visual prominence level */
  emphasis?: "base" | "medium" | "high";

  /** ARIA role attribute */
  role?: string;

  /** Keyboard navigation index */
  tabIndex?: number;
}

// =============================================
// Contact Card Specialization
// =============================================
/**
 * Contact-specific card properties extending base
 *
 * Adds email functionality with multi-sensory feedback
 */
export interface ContactCardProps extends BentoCardProps {
  /** Default: 'contact@example.com' */
  email?: string;

  /** Enable auditory feedback */
  enableAudio?: boolean;

  /** Enable tactile feedback */
  enableHaptics?: boolean;

  /** Supported locales */
  locale?: Locale;

  /**
   * Copy success handler
   * @param email - Copied email address
   * @param method - Clipboard API method used
   */
  onCopySuccess?: (email: string, method: "modern" | "legacy") => void;

  /**
   * Copy failure handler
   * @param error - Error description
   * @param email - Attempted email address
   */
  onCopyError?: (error: string, email: string) => void;
}

// =============================================
// Analytics & Performance
// =============================================
/**
 * Component analytics event structure
 *
 * Follows Google Analytics event model standards
 */
export interface CardAnalyticsEvent {
  /** Originating component name */
  component: string;

  /** Event name/type */
  event: string;

  /** ISO 8601 timestamp */
  timestamp: string;

  /** Event metadata (JSON-serializable values only) */
  metadata?: Record<string, string | number | boolean | null>;

  /** User device context */
  device: {
    type: "mobile" | "tablet" | "desktop";
    os: string;
    browser: string;
  };
}

/**
 * Performance metrics tracking
 *
 * Aligns with Web Vitals specifications
 */
export interface CardPerformanceMetrics {
  /** Component load duration (ms) */
  loadTime?: number;

  /** First Contentful Paint (ms) */
  fcp?: number;

  /** Largest Contentful Paint (ms) */
  lcp?: number;

  /** Cumulative Layout Shift score */
  cls?: number;

  /** Memory consumption (MB) */
  memory?: number;
}

// =============================================
// Media & Styling Types
// =============================================
/** Next.js image optimization format */
export type StaticImageData = Readonly<{
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}>;

/**
 * Theme configuration
 *
 * Supports light/dark/system modes
 */
export type ThemeConfig = Readonly<{
  mode: "light" | "dark" | "system";
  primary: string;
  secondary: string;
  cardVariant: "elevated" | "outlined" | "filled";
}>;

// =============================================
// Accessibility Specifications
// =============================================
/**
 * WCAG 2.2 compliant settings
 *
 * Mirrors browser preference APIs
 */
export type AccessibilityConfig = Readonly<{
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  fontSize: number;
}>;

/**
 * User preference profile
 *
 * Combines accessibility and localization settings
 */
export type UserPreference = Readonly<{
  accessibility: AccessibilityConfig;
  locale: Locale;
  colorScheme: "light" | "dark";
}>;

// =============================================
// Context & Layout Types
// =============================================
/**
 * Global card context
 *
 * Provides theming, a11y, and analytics
 */
export interface CardContextType {
  theme: ThemeConfig;
  accessibility: AccessibilityConfig;
  trackEvent: (event: CardAnalyticsEvent) => void;
  perfMetrics: CardPerformanceMetrics;
}

/**
 * Card sizing dimensions
 *
 * @small 150px
 * @medium 300px
 * @large 450px
 * @xlarge 600px
 */
export type CardSize = "small" | "medium" | "large" | "xlarge";

/**
 * Grid position descriptor
 *
 * @deprecated Prefer CSS Grid layout - will migrate to fractional units in v2
 */
export interface GridPosition {
  rowStart: number;
  rowSpan: number;
  colStart: number;
  colSpan: number;
}

// =============================================
// Component Configuration
// =============================================
/**
 * Bento grid card definition
 *
 * @typeparam T - Component props type
 */
export interface BentoGridCard<T = Record<string, unknown>> {
  /** React component reference */
  component: React.ComponentType<T>;

  /** Component-specific props */
  props: T;

  /** Grid placement */
  position: GridPosition;

  /** Size variant */
  size: CardSize;

  /** Priority loading (above-the-fold) */
  priority?: boolean;
}

// =============================================
// Localization & Internationalization
// =============================================
/** Supported locale codes */
export type Locale = "en" | "es" | "fr" | "de" | "ja";

// =============================================
// Export Aliases
// =============================================
export type {
  BentoCardProps as CardProps,
  ContactCardProps as ContactProps,
  CardAnalyticsEvent as AnalyticsEvent,
  CardPerformanceMetrics as PerformanceMetrics,
  ThemeConfig as Theme,
  AccessibilityConfig as Accessibility,
  CardContextType as CardContext,
  GridPosition as Position,
  BentoGridCard as BentoCard,
};
