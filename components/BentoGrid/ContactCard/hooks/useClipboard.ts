// components/BentoGrid/ContactCard/hooks/useClipboard.ts
import { useCallback, useState, useEffect, useRef } from "react";
import { copyToClipboard } from "../utils/clipboard";

// =============================================
// Type Definitions
// =============================================
/**
 * Clipboard operation status
 * - idle: Initial state
 * - copying: Operation in progress
 * - success: Last copy succeeded
 * - error: Last copy failed
 */
export type ClipboardStatus = "idle" | "copying" | "success" | "error";

/**
 * Clipboard hook return interface
 *
 * @property {function} copy - Execute copy operation
 * @property {ClipboardStatus} status - Current operation state
 * @property {Error | null} error - Last error encountered
 * @property {function} reset - Reset to idle state
 */
interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  status: ClipboardStatus;
  error: Error | null;
  reset: () => void;
}

// =============================================
// Main Clipboard Hook
// =============================================
/**
 * Provides clipboard copy functionality with status tracking
 *
 * Features:
 * - Async copy operation with status feedback
 * - Error handling and reset capability
 * - Automatic success state timeout
 * - Memory leak prevention
 *
 * @returns {UseClipboardReturn} Clipboard utilities
 *
 * @example
 * const { copy, status, error, reset } = useClipboard();
 *
 * const handleCopy = async () => {
 *   const success = await copy('Text to copy');
 *   if (success) {
 *     console.log('Copied successfully!');
 *   }
 * }
 */
export const useClipboard = (): UseClipboardReturn => {
  // =============================================
  // State Management
  // =============================================
  /**
   * Tracks current clipboard operation status
   */
  const [status, setStatus] = useState<ClipboardStatus>("idle");

  /**
   * Stores last encountered error
   */
  const [error, setError] = useState<Error | null>(null);

  /**
   * Timeout reference for resetting success state
   */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =============================================
  // Lifecycle Cleanup
  // =============================================
  /**
   * Clears pending timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // =============================================
  // Core Copy Function
  // =============================================
  /**
   * Copies text to clipboard and updates status
   *
   * @param {string} text - Content to copy
   * @returns {Promise<boolean>} Copy success status
   */
  const copy = useCallback(async (text: string): Promise<boolean> => {
    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setStatus("copying");
    setError(null);

    try {
      await copyToClipboard(text);
      setStatus("success");

      // Auto-reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, 2000);

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus("error");
      return false;
    }
  }, []);

  // =============================================
  // Reset Function
  // =============================================
  /**
   * Resets clipboard status to idle
   */
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("idle");
    setError(null);
  }, []);

  // =============================================
  // Return Interface
  // =============================================
  return {
    copy,
    status,
    error,
    reset,
  };
};
