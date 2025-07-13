// components/BentoGrid/ContactCard/Toast.tsx
"use client";
// =============================================
// Component Imports
// =============================================
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { useTranslation, type LocaleType } from "./hooks/useTranslation";

// =============================================
// Animation & Timing Constants
// =============================================
const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
};

const ANIMATION_DURATION = 0.3;

// =============================================
// Type Definitions
// =============================================
interface ToastProps {
  /** Notification content text */
  message: string;
  /** Visual style variant */
  type: "success" | "error";
  /** Cleanup callback after animation */
  onClose: () => void;
  /** Translation language */
  locale?: LocaleType;
}

// =============================================
// Main Component
// =============================================
/**
 * Displays ephemeral notification toast with animations
 *
 * Features:
 * - Auto-dismiss after type-specific duration
 * - Framer Motion enter/exit animations
 * - Localized accessibility labels
 * - Contextual styling by type
 *
 * @param {ToastProps} props - Component configuration
 * @returns {JSX.Element} Toast notification UI
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  locale = "en",
}) => {
  // =============================================
  // State Management
  // =============================================
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation(locale);

  // =============================================
  // Auto-dismiss Effect
  // =============================================
  useEffect(() => {
    const timer = setTimeout(
      () => handleClose(),
      type === "success" ? TOAST_DURATION.SUCCESS : TOAST_DURATION.ERROR
    );

    return () => clearTimeout(timer);
  }, [type]);

  // =============================================
  // Event Handlers
  // =============================================
  const handleClose = () => {
    setIsVisible(false);
  };

  // =============================================
  // Visual Configuration
  // =============================================
  const toastStyles = {
    success: "bg-green-600 border-green-500",
    error: "bg-red-600 border-red-500",
  };

  const typeLabel = type === "success" ? t("success") : t("error_short");

  // =============================================
  // Animation Definitions
  // =============================================
  const toastVariants = {
    initial: { opacity: 0, y: -50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: ANIMATION_DURATION },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: ANIMATION_DURATION,
        onComplete: () => onClose(),
      },
    },
  };

  // =============================================
  // Component Rendering
  // =============================================
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 min-w-[300px] max-w-[90vw] z-[9999]"
          role="alert"
          aria-live="assertive"
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div
            className={cn(
              "flex items-center justify-between p-4 rounded-lg shadow-lg",
              "border border-opacity-50 text-white",
              toastStyles[type]
            )}
          >
            <div className="flex flex-col">
              <h3 className="sr-only">{typeLabel}</h3>
              <p id="toast-message">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 p-1 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              aria-label={t("closeNotification")}
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
