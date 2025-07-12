"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  lazy,
  Suspense,
  createContext,
  useContext,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCopyOutline, IoCloseOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "../ui/GradientBg";
import MagicButton from "../ui/MagicButton";
import { BentoCardProps } from "./types";
import type { AnimationConfigWithData } from "lottie-web";

// Lazy load Lottie for better performance
const Lottie = lazy(() => import("react-lottie"));

// =============================================
// TYPES & INTERFACES
// =============================================

interface ContactCardProps extends BentoCardProps {
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

interface ToastState {
  message: string;
  type: "error" | "success" | "info" | "warning";
  id: number;
  duration?: number;
}

interface ClipboardState {
  copied: boolean;
  loading: boolean;
  error: string | null;
  retryCount: number;
  lastCopyTime: number | null;
}

interface AnalyticsMetadata {
  timestamp: number;
  userAgent: string;
  method: "modern" | "fallback";
  retryCount: number;
  duration: number;
  preferredLanguage: string;
}

interface PerformanceConfig {
  enableMetrics: boolean;
  metricsEndpoint?: string;
  debounceMs: number;
  retryDelay: number;
}

interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  announceActions: boolean;
  keyboardNavigation: boolean;
}

interface AudioContextManager {
  context: AudioContext | null;
  isSupported: boolean;
  isEnabled: boolean;
}

// =============================================
// INTERNATIONALIZATION
// =============================================

const translations = {
  en: {
    copy: "Copy my email address",
    copying: "Copying...",
    retrying: "Retrying... ({current}/{max})",
    copied: "Email is Copied!",
    success: "Email copied to clipboard!",
    error: "Failed to copy email",
    invalidEmail: "Invalid email format",
    permissionDenied: "Please allow clipboard access or copy manually",
    httpsRequired: "Clipboard access requires HTTPS. Please copy manually",
    fallbackCopy: "Please copy manually",
    closeNotification: "Close notification",
    retryAttempt: "Retrying to copy email, attempt {count}",
    emailCopied: "Email copied to clipboard",
    copyEmailClipboard: "Copy email address to clipboard",
  },
  es: {
    copy: "Copiar mi dirección de correo",
    copying: "Copiando...",
    retrying: "Reintentando... ({current}/{max})",
    copied: "¡Correo Copiado!",
    success: "¡Correo copiado al portapapeles!",
    error: "Error al copiar correo",
    invalidEmail: "Formato de correo inválido",
    permissionDenied: "Permite acceso al portapapeles o copia manualmente",
    httpsRequired:
      "El acceso al portapapeles requiere HTTPS. Copia manualmente",
    fallbackCopy: "Por favor copia manualmente",
    closeNotification: "Cerrar notificación",
    retryAttempt: "Reintentando copiar correo, intento {count}",
    emailCopied: "Correo copiado al portapapeles",
    copyEmailClipboard: "Copiar dirección de correo al portapapeles",
  },
  fr: {
    copy: "Copier mon adresse email",
    copying: "Copie en cours...",
    retrying: "Nouvelle tentative... ({current}/{max})",
    copied: "Email Copié!",
    success: "Email copié dans le presse-papiers!",
    error: "Échec de la copie de l'email",
    invalidEmail: "Format d'email invalide",
    permissionDenied:
      "Veuillez autoriser l'accès au presse-papiers ou copier manuellement",
    httpsRequired:
      "L'accès au presse-papiers nécessite HTTPS. Veuillez copier manuellement",
    fallbackCopy: "Veuillez copier manuellement",
    closeNotification: "Fermer la notification",
    retryAttempt: "Nouvelle tentative de copie de l'email, tentative {count}",
    emailCopied: "Email copié dans le presse-papiers",
    copyEmailClipboard: "Copier l'adresse email dans le presse-papiers",
  },
} as const;

type TranslationKey = keyof typeof translations.en;
type SupportedLocale = keyof typeof translations;

// =============================================
// PERFORMANCE MONITORING
// =============================================

interface PerformanceMetrics {
  componentRenderTime: number;
  clipboardOperationTime: number;
  audioInitTime: number;
  animationFrameTime: number;
  memoryUsage: number;
}

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.setupObservers();
  }

  private setupObservers() {
    if (!this.config.enableMetrics || typeof window === "undefined") return;

    try {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric("longTask", entry.duration);
        }
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
      this.observers.push(longTaskObserver);

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric("layoutShift", (entry as any).value);
        }
      });
      layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(layoutShiftObserver);
    } catch (error) {
      console.warn("Performance monitoring setup failed:", error);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.config.enableMetrics) return;

    this.metrics.set(name, value);

    // Send to analytics endpoint if configured
    if (this.config.metricsEndpoint) {
      this.sendMetrics(name, value);
    }
  }

  private async sendMetrics(name: string, value: number) {
    try {
      await fetch(this.config.metricsEndpoint!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metric: name,
          value,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.warn("Failed to send metrics:", error);
    }
  }

  getMetrics(): PerformanceMetrics {
    const getMemoryUsage = () => {
      if ("memory" in performance) {
        return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }
      return 0;
    };

    return {
      componentRenderTime: this.metrics.get("componentRender") || 0,
      clipboardOperationTime: this.metrics.get("clipboardOperation") || 0,
      audioInitTime: this.metrics.get("audioInit") || 0,
      animationFrameTime: this.metrics.get("animationFrame") || 0,
      memoryUsage: getMemoryUsage(),
    };
  }

  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.metrics.clear();
  }
}

// =============================================
// GLOBAL AUDIO CONTEXT MANAGER
// =============================================

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private audioContext: AudioContext | null = null;
  private isSupported: boolean | null = null;
  private isEnabled: boolean = true;

  static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  getAudioContext(): AudioContextManager {
    if (this.isSupported === false) {
      return { context: null, isSupported: false, isEnabled: this.isEnabled };
    }

    try {
      if (!this.audioContext || this.audioContext.state === "closed") {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;

        if (!AudioContextClass) {
          this.isSupported = false;
          return {
            context: null,
            isSupported: false,
            isEnabled: this.isEnabled,
          };
        }

        this.audioContext = new AudioContextClass();
        this.isSupported = true;
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      return {
        context: this.audioContext,
        isSupported: true,
        isEnabled: this.isEnabled,
      };
    } catch (error) {
      console.warn("Audio context initialization failed:", error);
      this.isSupported = false;
      return { context: null, isSupported: false, isEnabled: this.isEnabled };
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  cleanup() {
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 254;
};

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const triggerHapticFeedback = (
  type: "success" | "error" | "light" | "medium" | "heavy",
  enabled: boolean = true
) => {
  if (!enabled) return;

  // Modern haptic feedback API
  if ("vibrate" in navigator) {
    const patterns = {
      success: [50],
      error: [100, 50, 100],
      light: [10],
      medium: [50],
      heavy: [100],
    };
    navigator.vibrate(patterns[type]);
  }

  // iOS haptic feedback
  if ("hapticFeedback" in navigator) {
    try {
      const intensity =
        type === "error" ? "heavy" : type === "success" ? "medium" : "light";
      (navigator as any).hapticFeedback.impact(intensity);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }
};

const createTextAreaForCopy = (text: string): HTMLTextAreaElement => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.cssText = `
    position: fixed;
    left: -999999px;
    top: -999999px;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  `;
  textArea.setAttribute("readonly", "");
  textArea.setAttribute("aria-hidden", "true");
  textArea.setAttribute("tabindex", "-1");
  return textArea;
};

const fallbackCopyText = async (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const textArea = createTextAreaForCopy(text);
    document.body.appendChild(textArea);

    try {
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        resolve();
      } else {
        reject(new Error("Fallback copy failed"));
      }
    } catch (error) {
      if (document.body.contains(textArea)) {
        document.body.removeChild(textArea);
      }
      reject(error);
    }
  });
};

const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};

// =============================================
// CUSTOM HOOKS
// =============================================

const useTranslation = (locale: string = "en") => {
  const supportedLocale = (translations as any)[locale]
    ? (locale as SupportedLocale)
    : "en";

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      let translation = translations[supportedLocale][key];

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, String(value));
        });
      }

      return translation;
    },
    [supportedLocale]
  );

  return { t, locale: supportedLocale };
};

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    mediaQueryRef.current = media;
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
};

const usePerformanceMonitor = (config: PerformanceConfig) => {
  const monitorRef = useRef<PerformanceMonitor | null>(null);

  useEffect(() => {
    if (config.enableMetrics) {
      monitorRef.current = new PerformanceMonitor(config);
    }

    return () => {
      monitorRef.current?.cleanup();
    };
  }, [config.enableMetrics]);

  const recordMetric = useCallback((name: string, value: number) => {
    monitorRef.current?.recordMetric(name, value);
  }, []);

  const getMetrics = useCallback(() => {
    return (
      monitorRef.current?.getMetrics() || {
        componentRenderTime: 0,
        clipboardOperationTime: 0,
        audioInitTime: 0,
        animationFrameTime: 0,
        memoryUsage: 0,
      }
    );
  }, []);

  return { recordMetric, getMetrics };
};

const useClipboard = (
  text: string,
  performanceConfig: PerformanceConfig,
  onSuccess?: (email: string, metadata: AnalyticsMetadata) => void,
  onError?: (error: string, email: string, metadata: AnalyticsMetadata) => void
) => {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    loading: false,
    error: null,
    retryCount: 0,
    lastCopyTime: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { recordMetric } = usePerformanceMonitor(performanceConfig);
  const maxRetries = 3;

  const createAnalyticsMetadata = (
    method: "modern" | "fallback",
    startTime: number,
    retryCount: number
  ): AnalyticsMetadata => ({
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    method,
    retryCount,
    duration: Date.now() - startTime,
    preferredLanguage: navigator.language,
  });

  const copy = useCallback(
    async (isRetry: boolean = false) => {
      if (state.loading) return;

      // Rate limiting check
      if (state.lastCopyTime && Date.now() - state.lastCopyTime < 1000) {
        return;
      }

      const startTime = Date.now();

      if (!isValidEmail(text)) {
        const errorMsg = "Invalid email format";
        const metadata = createAnalyticsMetadata("modern", startTime, 0);
        setState((prev) => ({ ...prev, error: errorMsg }));
        onError?.(errorMsg, text, metadata);
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        lastCopyTime: Date.now(),
      }));

      try {
        let copySuccessful = false;
        let lastError: Error | null = null;
        let method: "modern" | "fallback" = "modern";

        // Try modern clipboard API first
        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(text);
            copySuccessful = true;
            method = "modern";
          } catch (error) {
            lastError = error as Error;
            console.warn("Modern clipboard API failed:", error);
          }
        }

        // Fallback to legacy method if modern API failed
        if (!copySuccessful) {
          try {
            await fallbackCopyText(text);
            copySuccessful = true;
            method = "fallback";
          } catch (error) {
            lastError = error as Error;
          }
        }

        if (copySuccessful) {
          const metadata = createAnalyticsMetadata(
            method,
            startTime,
            state.retryCount
          );
          recordMetric("clipboardOperation", Date.now() - startTime);

          setState((prev) => ({
            ...prev,
            copied: true,
            retryCount: 0,
            lastCopyTime: Date.now(),
          }));

          onSuccess?.(text, metadata);

          // Reset copied state after 3 seconds
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setState((prev) => ({ ...prev, copied: false }));
          }, 3000);
        } else {
          throw lastError || new Error("All copy methods failed");
        }
      } catch (error) {
        console.error("Failed to copy:", error);

        // Attempt retry if not already retrying and under max retries
        if (!isRetry && state.retryCount < maxRetries) {
          setState((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }));
          setTimeout(() => copy(true), performanceConfig.retryDelay);
          return;
        }

        // Generate user-friendly error message
        let errorMessage = "Failed to copy email. ";
        if (error instanceof Error) {
          if (
            error.message.includes("permissions") ||
            error.message.includes("denied")
          ) {
            errorMessage += "Please allow clipboard access or copy manually: ";
          } else if (
            error.message.includes("secure") ||
            error.message.includes("https")
          ) {
            errorMessage +=
              "Clipboard access requires HTTPS. Please copy manually: ";
          } else {
            errorMessage += "Please copy manually: ";
          }
        } else {
          errorMessage += "Please copy manually: ";
        }

        const finalError = `${errorMessage}${text}`;
        const metadata = createAnalyticsMetadata(
          "modern",
          startTime,
          state.retryCount
        );

        setState((prev) => ({
          ...prev,
          error: finalError,
          retryCount: 0,
          lastCopyTime: Date.now(),
        }));

        onError?.(finalError, text, metadata);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      text,
      state.loading,
      state.retryCount,
      state.lastCopyTime,
      onSuccess,
      onError,
      performanceConfig.retryDelay,
      recordMetric,
    ]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    copy: () => copy(false),
    ...state,
  };
};

const useAudio = (
  enabled: boolean = true,
  performanceConfig: PerformanceConfig
) => {
  const audioManager = GlobalAudioManager.getInstance();
  const { recordMetric } = usePerformanceMonitor(performanceConfig);

  const createOscillator = useCallback((audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return { oscillator, gainNode };
  }, []);

  const playSound = useCallback(
    (type: "error" | "success" | "info") => {
      if (!enabled) return;

      const startTime = Date.now();
      const { context: audioContext, isSupported } =
        audioManager.getAudioContext();

      if (!audioContext || !isSupported) return;

      try {
        const { oscillator, gainNode } = createOscillator(audioContext);
        const currentTime = audioContext.currentTime;

        switch (type) {
          case "error":
            oscillator.frequency.setValueAtTime(400, currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              200,
              currentTime + 0.15
            );
            gainNode.gain.setValueAtTime(0.1, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              currentTime + 0.15
            );
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.15);
            break;

          case "success":
            oscillator.frequency.setValueAtTime(523.25, currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.08, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.3);
            break;

          case "info":
            oscillator.frequency.setValueAtTime(880, currentTime); // A5
            gainNode.gain.setValueAtTime(0.05, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.1);
            break;
        }

        recordMetric("audioInit", Date.now() - startTime);
      } catch (error) {
        console.warn("Audio playback failed:", error);
      }
    },
    [enabled, audioManager, createOscillator, recordMetric]
  );

  return { playSound };
};

const useToast = (locale: string = "en") => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const toastIdRef = useRef(0);
  const { t } = useTranslation(locale);

  const showToast = useCallback(
    (
      message: string,
      type: ToastState["type"] = "error",
      duration?: number
    ) => {
      const id = ++toastIdRef.current;
      const defaultDuration =
        type === "success" ? 3000 : type === "error" ? 5000 : 4000;

      setToast({
        message,
        type,
        id,
        duration: duration || defaultDuration,
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, duration || defaultDuration);
    },
    []
  );

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { toast, showToast, hideToast };
};

// =============================================
// CONFIGURATION
// =============================================

const CONFIG = {
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 4000,
    WARNING: 4500,
  },
  ANIMATION: {
    COPIED_STATE_DURATION: 3000,
    CONFETTI_DELAY: 100,
    SPRING_CONFIG: {
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
  STYLES: {
    BUTTON_BG: "!bg-[#161A31]",
    CARD_BG: "rgb(4,7,29)",
    CARD_GRADIENT:
      "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
    HIGH_CONTRAST: {
      BUTTON_BG: "!bg-black",
      CARD_BG: "rgb(0,0,0)",
      CARD_GRADIENT:
        "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(40,40,40,1) 100%)",
    },
  },
  MEDIA_QUERIES: {
    REDUCED_MOTION: "(prefers-reduced-motion: reduce)",
    HIGH_CONTRAST: "(prefers-contrast: high)",
    MOBILE: "(max-width: 768px)",
    TABLET: "(max-width: 1024px)",
  },
  DEFAULT_EMAIL: "bennafla.riidha@gmail.com",
  MAX_RETRIES: 3,
  DEBOUNCE_MS: 300,
  RETRY_DELAY: 800,
} as const;

// =============================================
// COMPONENTS
// =============================================

const Toast = memo(
  ({
    message,
    type = "error",
    onClose,
    locale = "en",
  }: {
    message: string;
    type?: ToastState["type"];
    onClose: () => void;
    locale?: string;
  }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { t } = useTranslation(locale);

    const handleClose = useCallback(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, [onClose]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [handleClose]);

    useEffect(() => {
      // Announce to screen readers
      announceToScreenReader(
        message,
        type === "error" ? "assertive" : "polite"
      );
    }, [message, type]);

    if (!isVisible) return null;

    const toastStyles = {
      error: "bg-red-500/90 text-white border-red-400/50 shadow-red-500/25",
      success:
        "bg-green-500/90 text-white border-green-400/50 shadow-green-500/25",
      info: "bg-blue-500/90 text-white border-blue-400/50 shadow-blue-500/25",
      warning:
        "bg-yellow-500/90 text-white border-yellow-400/50 shadow-yellow-500/25",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={CONFIG.ANIMATION.SPRING_CONFIG}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.div
          initial={{ boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)" }}
          animate={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative px-6 py-4 rounded-xl border backdrop-blur-sm shadow-xl",
            "min-w-[320px] max-w-[90vw] mx-auto",
            "flex items-center justify-between gap-4",
            toastStyles[type]
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {type === "error" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {type === "success" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {type === "info" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {type === "warning" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium leading-5 break-words">
              {message}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={t("closeNotification")}
          >
            <IoCloseOutline className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    );
  }
);

Toast.displayName = "Toast";

// =============================================
// ANALYTICS & PERFORMANCE ENHANCEMENT
// =============================================

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;
  private endpoint?: string;

  constructor(enabled: boolean = false, endpoint?: string) {
    this.isEnabled = enabled;
    this.endpoint = endpoint;
  }

  track(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    this.sendEvent(analyticsEvent);
  }

  private async sendEvent(event: AnalyticsEvent) {
    if (!this.endpoint) return;

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn("Analytics event failed to send:", error);
    }
  }

  getEvents() {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// =============================================
// ENHANCED CONFETTI COMPONENT
// =============================================

const ConfettiAnimation = memo(
  ({
    trigger,
    enabled = true,
    reducedMotion = false,
  }: {
    trigger: boolean;
    enabled?: boolean;
    reducedMotion?: boolean;
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>();
    const particlesRef = useRef<any[]>([]);

    const createParticle = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const colors = [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#ffeaa7",
        "#dda0dd",
      ];
      const shapes = ["circle", "square", "triangle"];

      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        gravity: 0.1,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
      };
    }, []);

    const drawParticle = useCallback(
      (ctx: CanvasRenderingContext2D, particle: any) => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        switch (particle.shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "square":
            ctx.fillRect(
              -particle.size / 2,
              -particle.size / 2,
              particle.size,
              particle.size
            );
            break;
          case "triangle":
            ctx.beginPath();
            ctx.moveTo(0, -particle.size / 2);
            ctx.lineTo(-particle.size / 2, particle.size / 2);
            ctx.lineTo(particle.size / 2, particle.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      },
      []
    );

    const animate = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.life -= particle.decay;

        if (particle.life > 0 && particle.y < canvas.height + 20) {
          drawParticle(ctx, particle);
          return true;
        }
        return false;
      });

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }, [drawParticle]);

    const startConfetti = useCallback(() => {
      if (!enabled || reducedMotion) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Create burst of particles
      for (let i = 0; i < 50; i++) {
        const particle = createParticle();
        if (particle) {
          particlesRef.current.push(particle);
        }
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animate();
    }, [enabled, reducedMotion, createParticle, animate]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (trigger) {
        startConfetti();
      }
    }, [trigger, startConfetti]);

    if (!enabled || reducedMotion) return null;

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ background: "transparent" }}
      />
    );
  }
);

ConfettiAnimation.displayName = "ConfettiAnimation";

// =============================================
// ENHANCED LOTTIE ANIMATION COMPONENT
// =============================================

const LottieAnimation = memo(
  ({
    animationData,
    trigger,
    enabled = true,
    reducedMotion = false,
  }: {
    animationData: any;
    trigger: boolean;
    enabled?: boolean;
    reducedMotion?: boolean;
  }) => {
    const [shouldPlay, setShouldPlay] = useState(false);

    useEffect(() => {
      if (trigger && enabled && !reducedMotion) {
        setShouldPlay(true);
        const timer = setTimeout(() => setShouldPlay(false), 2000);
        return () => clearTimeout(timer);
      }
    }, [trigger, enabled, reducedMotion]);

    if (!enabled || reducedMotion || !shouldPlay) return null;

    const defaultOptions: AnimationConfigWithData = {
      loop: false,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
      },
    };

    return (
      <div className="fixed inset-0 pointer-events-none z-[9998] flex items-center justify-center">
        <Suspense fallback={null}>
          <Lottie
            options={defaultOptions}
            height={200}
            width={200}
            isStopped={!shouldPlay}
            isPaused={!shouldPlay}
          />
        </Suspense>
      </div>
    );
  }
);

LottieAnimation.displayName = "LottieAnimation";

// =============================================
// ACCESSIBILITY CONTEXT
// =============================================

const AccessibilityContext = createContext<{
  highContrast: boolean;
  reducedMotion: boolean;
  announceActions: boolean;
  keyboardNavigation: boolean;
}>({
  highContrast: false,
  reducedMotion: false,
  announceActions: true,
  keyboardNavigation: true,
});

// =============================================
// MAIN CONTACT CARD COMPONENT
// =============================================

const ContactCard = memo<ContactCardProps>(
  ({
    className,
    title,
    description,
    id,
    img,
    imgClassName,
    titleClassName,
    spareImg,
    email = CONFIG.DEFAULT_EMAIL,
    enableAudio = true,
    enableHaptics = true,
    enableConfetti = true,
    enableAnalytics = false,
    theme = "auto",
    locale = "en",
    onCopySuccess,
    onCopyError,
    performanceConfig = {
      enableMetrics: false,
      debounceMs: CONFIG.DEBOUNCE_MS,
      retryDelay: CONFIG.RETRY_DELAY,
    },
    accessibilityConfig = {
      highContrast: false,
      reducedMotion: false,
      announceActions: true,
      keyboardNavigation: true,
    },
  }) => {
    // =============================================
    // HOOKS & STATE
    // =============================================

    const { t } = useTranslation(locale);
    const [confettiTrigger, setConfettiTrigger] = useState(false);
    const [lottieData, setLottieData] = useState<any>(null);
    const [lottieTrigger, setLottieTrigger] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Media queries
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const prefersReducedMotion = useMediaQuery(
      CONFIG.MEDIA_QUERIES.REDUCED_MOTION
    );
    const prefersHighContrast = useMediaQuery(
      CONFIG.MEDIA_QUERIES.HIGH_CONTRAST
    );
    const isMobile = useMediaQuery(CONFIG.MEDIA_QUERIES.MOBILE);

    // Performance monitoring
    const { recordMetric } = usePerformanceMonitor(performanceConfig);

    // Analytics
    const analyticsManager = useMemo(
      () => new AnalyticsManager(enableAnalytics),
      [enableAnalytics]
    );

    // Accessibility context
    const accessibilityContext = useMemo(
      () => ({
        highContrast: accessibilityConfig.highContrast || prefersHighContrast,
        reducedMotion:
          accessibilityConfig.reducedMotion || prefersReducedMotion,
        announceActions: accessibilityConfig.announceActions,
        keyboardNavigation: accessibilityConfig.keyboardNavigation,
      }),
      [accessibilityConfig, prefersHighContrast, prefersReducedMotion]
    );

    // Theme resolution
    const resolvedTheme = useMemo(() => {
      if (theme === "auto") {
        return prefersDarkMode ? "dark" : "light";
      }
      return theme;
    }, [theme, prefersDarkMode]);

    // Audio hook
    const { playSound } = useAudio(enableAudio, performanceConfig);

    // Toast hook
    const { toast, showToast, hideToast } = useToast(locale);

    // Enhanced success/error handlers
    const handleCopySuccess = useCallback(
      (email: string, metadata: AnalyticsMetadata) => {
        const startTime = Date.now();

        playSound("success");
        triggerHapticFeedback("success", enableHaptics);

        if (enableConfetti) {
          setTimeout(
            () => setConfettiTrigger((prev) => !prev),
            CONFIG.ANIMATION.CONFETTI_DELAY
          );
        }

        showToast(t("success"), "success");

        if (accessibilityContext.announceActions) {
          announceToScreenReader(t("emailCopied"), "polite");
        }

        analyticsManager.track("email_copy_success", {
          method: metadata.method,
          duration: metadata.duration,
          retryCount: metadata.retryCount,
          email: email,
        });

        recordMetric("copySuccess", Date.now() - startTime);
        onCopySuccess?.(email, metadata);
      },
      [
        playSound,
        enableHaptics,
        enableConfetti,
        showToast,
        t,
        accessibilityContext.announceActions,
        analyticsManager,
        recordMetric,
        onCopySuccess,
      ]
    );

    const handleCopyError = useCallback(
      (error: string, email: string, metadata: AnalyticsMetadata) => {
        playSound("error");
        triggerHapticFeedback("error", enableHaptics);
        showToast(error, "error");

        if (accessibilityContext.announceActions) {
          announceToScreenReader(error, "assertive");
        }

        analyticsManager.track("email_copy_error", {
          error: error,
          email: email,
          method: metadata.method,
          retryCount: metadata.retryCount,
        });

        onCopyError?.(error, email, metadata);
      },
      [
        playSound,
        enableHaptics,
        showToast,
        accessibilityContext.announceActions,
        analyticsManager,
        onCopyError,
      ]
    );

    // Clipboard hook
    const { copy, copied, loading, error, retryCount } = useClipboard(
      email,
      performanceConfig,
      handleCopySuccess,
      handleCopyError
    );

    // Debounced copy function
    const debouncedCopy = useMemo(
      () => debounce(copy, performanceConfig.debounceMs),
      [copy, performanceConfig.debounceMs]
    );

    // Load Lottie animation data
    useEffect(() => {
      if (enableConfetti && !accessibilityContext.reducedMotion) {
        import("@/data/confetti.json")
          .then((data) => setLottieData(data))
          .catch((err) =>
            console.warn("Failed to load Lottie animation:", err)
          );
      }
    }, [enableConfetti, accessibilityContext.reducedMotion]);

    // Keyboard handlers
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!accessibilityContext.keyboardNavigation) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsPressed(true);
          debouncedCopy();

          analyticsManager.track("email_copy_keyboard", {
            key: e.key,
            email: email,
          });
        }
      },
      [
        accessibilityContext.keyboardNavigation,
        debouncedCopy,
        analyticsManager,
        email,
      ]
    );

    const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsPressed(false);
      }
    }, []);

    // Mouse handlers
    const handleMouseDown = useCallback(() => {
      setIsPressed(true);
    }, []);

    const handleMouseUp = useCallback(() => {
      setIsPressed(false);
    }, []);

    const handleClick = useCallback(() => {
      debouncedCopy();
      analyticsManager.track("email_copy_click", {
        email: email,
        isMobile: isMobile,
      });
    }, [debouncedCopy, analyticsManager, email, isMobile]);

    // Focus handlers
    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      setIsPressed(false);
    }, []);

    // Hover handlers
    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      setIsPressed(false);
    }, []);

    // Button state and styling
    const buttonText = useMemo(() => {
      if (loading) {
        return retryCount > 0
          ? t("retrying", { current: retryCount, max: 3 })
          : t("copying");
      }
      return copied ? t("copied") : t("copy");
    }, [loading, retryCount, copied, t]);

    const buttonStyles = useMemo(() => {
      const baseStyles = accessibilityContext.highContrast
        ? CONFIG.STYLES.HIGH_CONTRAST.BUTTON_BG
        : CONFIG.STYLES.BUTTON_BG;

      return cn(
        baseStyles,
        "relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "scale-105": isHovered && !loading,
          "scale-95": isPressed,
          "ring-2 ring-blue-500 ring-offset-2": isFocused,
        }
      );
    }, [
      accessibilityContext.highContrast,
      isHovered,
      isPressed,
      isFocused,
      loading,
    ]);

    const cardStyles = useMemo(() => {
      const baseGradient = accessibilityContext.highContrast
        ? CONFIG.STYLES.HIGH_CONTRAST.CARD_GRADIENT
        : CONFIG.STYLES.CARD_GRADIENT;

      return {
        background: baseGradient,
      };
    }, [accessibilityContext.highContrast]);

    // Component render
    return (
      <AccessibilityContext.Provider value={accessibilityContext}>
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none",
            "flex flex-col space-y-4 p-5 h-full min-h-[6rem]",
            className
          )}
          style={cardStyles}
          id={id}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <BackgroundGradientAnimation />
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-1 flex flex-col justify-center">
                {img && (
                  <div className={cn("flex justify-center mb-4", imgClassName)}>
                    <img
                      src={img}
                      alt=""
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </div>
                )}

                <div className="text-center space-y-2">
                  <h3
                    className={cn(
                      "text-lg font-semibold text-white",
                      titleClassName
                    )}
                  >
                    {title}
                  </h3>

                  {description && (
                    <p className="text-white/70 text-sm leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  className={buttonStyles}
                  onClick={handleClick}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  disabled={loading}
                  aria-label={t("copyEmailClipboard")}
                  aria-describedby={error ? `${id}-error` : undefined}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 group-hover/bento:bg-slate-800 transition-colors">
                    {!loading && <IoCopyOutline className="w-4 h-4" />}
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {buttonText}
                  </span>
                </button>

                {error && (
                  <div
                    id={`${id}-error`}
                    className="mt-2 text-red-400 text-xs text-center"
                    role="alert"
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spare Image */}
          {spareImg && (
            <div className="absolute -bottom-5 -right-5 opacity-20">
              <img src={spareImg} alt="" className="w-32 h-32 object-cover" />
            </div>
          )}
        </div>

        {/* Toast Notifications */}
        <AnimatePresence mode="wait">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
              locale={locale}
            />
          )}
        </AnimatePresence>

        {/* Confetti Animation */}
        <ConfettiAnimation
          trigger={confettiTrigger}
          enabled={enableConfetti}
          reducedMotion={accessibilityContext.reducedMotion}
        />

        {/* Lottie Animation */}
        {lottieData && (
          <LottieAnimation
            animationData={lottieData}
            trigger={lottieTrigger}
            enabled={enableConfetti}
            reducedMotion={accessibilityContext.reducedMotion}
          />
        )}
      </AccessibilityContext.Provider>
    );
  }
);

ContactCard.displayName = "ContactCard";

// =============================================
// EXPORTS
// =============================================

export default ContactCard;
export {
  ContactCard,
  Toast,
  ConfettiAnimation,
  LottieAnimation,
  AnalyticsManager,
  PerformanceMonitor,
  GlobalAudioManager,
  AccessibilityContext,
  useTranslation,
  useMediaQuery,
  usePerformanceMonitor,
  useClipboard,
  useAudio,
  useToast,
  type ContactCardProps,
  type ToastState,
  type AnalyticsMetadata,
  type PerformanceConfig,
  type AccessibilityConfig,
  type PerformanceMetrics,
};
