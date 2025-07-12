// =============================================
// Component Imports
// =============================================
"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useTranslation } from "./hooks/useTranslation";
import { useAudioFeedback } from "./hooks/useAudioFeedback";
import { ContactButton } from "./ContactButton";
import Toast from "./Toast";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./context/AccessibilityContext";
import { copyToClipboard } from "./utils/clipboard";
import { triggerHapticFeedback } from "./utils/haptics";
import { DEFAULT_EMAIL, TOAST_DURATION } from "./utils/constants";
import type { BentoCardProps } from "./types";
import type { Locale } from "./hooks/useTranslation";

// =============================================
// Type Definitions
// =============================================
interface ContactCardProps extends BentoCardProps {
  email?: string;
  enableAudio?: boolean;
  enableHaptics?: boolean;
  locale?: string;
  onCopySuccess?: (email: string, method: "modern" | "legacy") => void;
  onCopyError?: (error: string, email: string) => void;
}

type ClipboardStatus = "idle" | "copying" | "copied" | "error";

// =============================================
// Main Component
// =============================================
/**
 * Contact card component with email copy functionality
 *
 * @param {Object} props - Component properties
 * @param {string} [props.email=DEFAULT_EMAIL] - Email address to copy
 * @param {boolean} [props.enableAudio=true] - Enable sound feedback
 * @param {boolean} [props.enableHaptics=true] - Enable vibration feedback
 * @param {Locale} [props.locale="en"] - Localization language
 * @param {function} [props.onCopySuccess] - Success callback
 * @param {function} [props.onCopyError] - Error callback
 * @param {string} [props.className] - Additional CSS classes
 * @param {string | React.ReactNode} [props.title] - Card title
 * @param {string | React.ReactNode} [props.description] - Card description
 * @param {BentoCardProps} [cardProps] - Additional bento card properties
 *
 * @returns {JSX.Element} Contact card component UI
 */
export const ContactCard = ({
  className,
  title,
  description,
  email = DEFAULT_EMAIL,
  enableAudio = true,
  enableHaptics = true,
  locale = "en",
  onCopySuccess,
  onCopyError,
  ...cardProps
}: ContactCardProps) => {
  // =============================================
  // State & Refs Management
  // =============================================
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const { t } = useTranslation(locale as Locale);
  const [status, setStatus] = useState<ClipboardStatus>("idle");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Custom hooks initialization
  const { playSound } = useAudioFeedback(enableAudio);
  const prefersReducedMotion = usePrefersReducedMotion();

  // =============================================
  // Lifecycle & Cleanup
  // =============================================
  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // =============================================
  // Event Handlers
  // =============================================
  /**
   * Handles the email copy process with:
   * - Clipboard interaction
   * - Multi-sensory feedback (audio/haptic)
   * - Toast notifications
   * - Callback execution
   */
  const handleCopy = useCallback(async () => {
    // Prevent duplicate copy operations
    if (status === "copying") return;

    setStatus("copying");
    try {
      // Execute clipboard copy
      const method = await copyToClipboard(email);

      // Update UI state
      setStatus("copied");

      // Provide user feedback
      playSound("success");
      triggerHapticFeedback("success", enableHaptics);
      setToast({ message: t("success"), type: "success" });

      // Execute success callback
      onCopySuccess?.(email, method);
    } catch (error) {
      // Handle copy errors
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      setStatus("error");

      // Provide error feedback
      playSound("error");
      triggerHapticFeedback("error", enableHaptics);
      setToast({ message: t("error", { email }), type: "error" });

      // Execute error callback
      onCopyError?.(errorMessage, email);
    } finally {
      // Set timeout based on status
      const timeout =
        status === "copied" ? TOAST_DURATION.SUCCESS : TOAST_DURATION.ERROR;

      // Reset state after timeout
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setStatus("idle");
          setToast(null);
        }
      }, timeout);
    }
  }, [email, enableHaptics, playSound, t, onCopySuccess, onCopyError, status]);

  // =============================================
  // Memoized Values
  // =============================================
  /**
   * Generates button text based on current status
   * using translation keys
   */
  const buttonText = useMemo(() => {
    switch (status) {
      case "copying":
        return t("copying");
      case "copied":
        return t("copied");
      case "error":
        return t("error_short");
      default:
        return t("copy");
    }
  }, [status, t]);

  // =============================================
  // Component Rendering
  // =============================================
  return (
    <div
      className={cn(
        // Base card styling
        "relative overflow-hidden rounded-3xl border border-white/[0.1] p-5",
        "bg-gradient-to-br from-slate-900 to-slate-800",
        "transition-all duration-300 hover:shadow-xl",
        className
      )}
      aria-labelledby="contact-card-title"
      {...cardProps}
    >
      <div className="relative z-10">
        {/* Card title */}
        <h2
          id="contact-card-title"
          className="text-lg font-semibold text-white mb-2"
        >
          {title}
        </h2>

        {/* Card description */}
        {description && (
          <p className="text-white/70 text-sm mb-4">{description}</p>
        )}

        {/* Copy button */}
        <div className="mt-4">
          <ContactButton
            status={status}
            onClick={handleCopy}
            label={buttonText}
            disabled={status === "copying"}
            aria-label={t("copyEmailClipboard")}
          />
        </div>
      </div>

      {/* Toast notification */}
      {toast && !prefersReducedMotion && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          locale={locale}
        />
      )}
    </div>
  );
};

export default ContactCard;
