// components/types.ts

/**
 * Base properties for all Bento grid cards
 *
 * Follows atomic design principles with strict type safety
 * Supports all Next.js image optimization features
 */
export interface BentoCardProps {
  /**
   * Unique identifier for the card
   * Used for analytics tracking and DOM identification
   */
  id?: string;

  /**
   * Main heading for the card
   * Should be concise (under 60 characters)
   */
  title?: string;

  /**
   * Supporting description content
   * Can be longer text explaining the card's purpose
   */
  description?: string | React.ReactNode;

  /**
   * Main visual element for the card
   * Accepts static imports for Next.js optimized images
   * Example:
   *   import cardImage from '@/public/card.jpg'
   *   <BentoCard img={cardImage} />
   */
  img?: StaticImageData | string;

  /**
   * Additional image for decorative purposes
   * Displayed subtly in the background
   */
  spareImg?: StaticImageData | string;

  /**
   * Custom class names for the image container
   * Allows position/size adjustments
   */
  imgClassName?: string;

  /**
   * Custom class names for the title element
   * Allows typography customization
   */
  titleClassName?: string;

  /**
   * Root container class names
   * For layout and visual customization
   */
  className?: string;

  /**
   * Header component slot
   * Replaces default title/description rendering
   */
  header?: React.ReactNode;

  /**
   * Footer component slot
   * Rendered at the bottom of the card
   */
  footer?: React.ReactNode;

  /**
   * Click handler for the entire card
   * Use for navigation or expansion
   */
  onClick?: () => void;

  /**
   * Animation variant for card entrance
   * Default: 'fadeIn'
   */
  animation?: "fadeIn" | "slideUp" | "scaleIn" | "none";

  /**
   * Visual emphasis level
   * Default: 'base'
   */
  emphasis?: "base" | "medium" | "high";

  /**
   * ARIA role attribute
   * Default: 'region'
   */
  role?: string;

  /**
   * Tab index for keyboard navigation
   * Default: 0
   */
  tabIndex?: number;
}

/**
 * Type for contact-specific card properties
 * Extends the base BentoCardProps
 */
export interface ContactCardProps extends BentoCardProps {
  /**
   * Email address to display and copy
   * Default: 'contact@example.com'
   */
  email?: string;

  /**
   * Enable audio feedback on interactions
   * Default: true
   */
  enableAudio?: boolean;

  /**
   * Enable haptic feedback on interactions
   * Default: true on supported devices
   */
  enableHaptics?: boolean;

  /**
   * Localization key
   * Supports 'en', 'es', 'fr' out of the box
   * Default: 'en'
   */
  locale?: string;

  /**
   * Callback for successful copy action
   * @param email - The copied email address
   * @param method - The clipboard method used
   */
  onCopySuccess?: (email: string, method: "modern" | "legacy") => void;

  /**
   * Callback for failed copy action
   * @param error - Error message
   * @param email - The attempted email address
   */
  onCopyError?: (error: string, email: string) => void;
}

/**
 * Type for analytics events from bento cards
 */
export interface CardAnalyticsEvent {
  /** Component name where event originated */
  component: string;

  /** Event name/type */
  event: string;

  /** ISO timestamp */
  timestamp: string;

  /** Additional event metadata */
  metadata?: Record<string, any>;

  /** User device context */
  device: {
    type: "mobile" | "tablet" | "desktop";
    os: string;
    browser: string;
  };
}

/**
 * Type for performance metrics
 */
export interface CardPerformanceMetrics {
  /** Component load time in ms */
  loadTime: number;

  /** First contentful paint in ms */
  fcp?: number;

  /** Largest contentful paint in ms */
  lcp?: number;

  /** Cumulative layout shift score */
  cls?: number;

  /** Memory usage in MB */
  memory?: number;
}

// Image optimization types
export type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

/**
 * Type for theme configuration
 */
export type ThemeConfig = {
  /** Color mode */
  mode: "light" | "dark" | "system";

  /** Primary color palette */
  primary: string;

  /** Secondary color palette */
  secondary: string;

  /** Card style variant */
  cardVariant: "elevated" | "outlined" | "filled";
};

/**
 * Type for accessibility settings
 */
export type AccessibilityConfig = {
  /** Reduce motion preference */
  reducedMotion: boolean;

  /** High contrast mode */
  highContrast: boolean;

  /** Screen reader announcements */
  screenReader: boolean;

  /** Font scaling percentage */
  fontSize: number;
};

/**
 * Context type for card container
 */
export interface CardContextType {
  /** Current theme configuration */
  theme: ThemeConfig;

  /** Accessibility settings */
  accessibility: AccessibilityConfig;

  /** Analytics handler */
  trackEvent: (event: CardAnalyticsEvent) => void;

  /** Performance measurement */
  perfMetrics: CardPerformanceMetrics;
}

// Card size variants
export type CardSize = "small" | "medium" | "large" | "xlarge";

/**
 * Grid position descriptor
 */
export interface GridPosition {
  /** Row start position */
  rowStart: number;

  /** Row span */
  rowSpan: number;

  /** Column start position */
  colStart: number;

  /** Column span */
  colSpan: number;
}

/**
 * Bento grid card configuration
 */
export interface BentoGridCard {
  /** Component to render */
  component: React.ComponentType<any>;

  /** Props to pass to component */
  props: Record<string, any>;

  /** Grid positioning */
  position: GridPosition;

  /** Size variant */
  size: CardSize;

  /** Priority loading (above-the-fold) */
  priority?: boolean;
}

// Export all types
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
