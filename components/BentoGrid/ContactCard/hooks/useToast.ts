// components/BentoGrid/ContactCard/hooks/useToast.ts
"use client";
// =============================================
// Component Imports
// =============================================
import { useRef, useState, useEffect } from "react";

// =============================================
// Type Definitions
// =============================================
/**
 * Supported toast variants
 * - success: Positive confirmation
 * - error: Critical failure notice
 * - info: Neutral information
 * - warning: Important caution
 */
export type ToastType = "success" | "error" | "info" | "warning";

/**
 * Toast configuration options
 *
 * @property {number} [duration] - Visibility time (ms)
 * @property {object} [meta] - Additional contextual data
 */
interface ToastOptions {
  duration?: number;
  meta?: Record<string, unknown>;
}

/**
 * Active toast instance
 *
 * @property {string} message - Display content
 * @property {ToastType} type - Visual style variant
 * @property {number} id - Unique identifier
 * @property {ToastOptions} [options] - Configuration
 */
export interface ToastState {
  message: string;
  type: ToastType;
  id: number;
  options?: ToastOptions;
}

// =============================================
// Duration Constants
// =============================================
/**
 * Default visibility durations (ms)
 */
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  info: 4000,
  warning: 4500,
};

// =============================================
// Main Toast Hook
// =============================================
/**
 * Manages toast notifications with auto-dismissal
 *
 * Features:
 * - Customizable per-toast durations
 * - Automatic cleanup of timeouts
 * - Unique ID generation
 * - Memory leak prevention
 *
 * @returns {Object} Toast management utilities
 * @property {ToastState[]} toasts - Active toasts
 * @property {function} showToast - Display new toast
 * @property {function} removeToast - Dismiss specific toast
 */
export const useToast = () => {
  // =============================================
  // State Management
  // =============================================
  /**
   * Active toast notifications
   */
  const [toasts, setToasts] = useState<ToastState[]>([]);

  /**
   * Auto-dismissal timeouts
   */
  const timeoutRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

  /**
   * Toast ID counter
   */
  const toastId = useRef(0);

  // =============================================
  // Lifecycle Cleanup
  // =============================================
  /**
   * Clears all pending timeouts on unmount
   */
  useEffect(() => {
    // Capture current ref value for cleanup
    const currentTimeoutMap = timeoutRefs.current;

    return () => {
      currentTimeoutMap.forEach((timeout) => clearTimeout(timeout));
      currentTimeoutMap.clear();
    };
  }, []);

  // =============================================
  // Toast Display Function
  // =============================================
  /**
   * Displays a new toast notification
   *
   * @param {string} message - Notification content
   * @param {ToastType} [type="info"] - Visual style
   * @param {ToastOptions} [options] - Configuration
   *
   * @example
   * showToast('Operation successful', 'success', {
   *   duration: 5000,
   *   meta: { userId: 123 }
   * })
   */
  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions
  ) => {
    const id = ++toastId.current;

    // Add to active toasts
    setToasts((prev) => [...prev, { message, type, id, options }]);

    // Determine duration (custom or default)
    const duration = options?.duration || DEFAULT_DURATIONS[type];

    // Set auto-dismiss timeout
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, duration);

    // Track timeout for cleanup
    timeoutRefs.current.set(id, timeoutId);
  };

  // =============================================
  // Toast Removal Function
  // =============================================
  /**
   * Dismisses a specific toast
   *
   * @param {number} id - Toast ID to remove
   */
  const removeToast = (id: number) => {
    // Clear associated timeout
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    // Remove from active toasts
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // =============================================
  // Return Interface
  // =============================================
  return {
    toasts,
    showToast,
    removeToast,
  };
};
