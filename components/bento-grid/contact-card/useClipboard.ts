// useClipboard.ts

import { useState, useCallback } from "react";
import { ClipboardState } from "./types";
import { CONFIG } from "./config";
import { fallbackCopyText, isValidEmail, debounce } from "./utils";
import { useToast } from "./useToast";
import { useTranslation } from "./useTranslation";
import { triggerHapticFeedback } from "./utils";

export const useClipboard = (
  email: string,
  enableHaptics: boolean,
  locale: string,
  onCopySuccess?: (email: string) => void,
  onCopyError?: (error: string, email: string) => void
) => {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    loading: false,
    error: null,
    retryCount: 0,
    lastCopyTime: null,
  });

  const { showToast } = useToast();
  const { t } = useTranslation(locale);

  const handleSuccess = useCallback(() => {
    setState((prev) => ({
      ...prev,
      copied: true,
      loading: false,
      error: null,
      retryCount: 0,
      lastCopyTime: Date.now(),
    }));

    showToast(t("success"), "success");
    triggerHapticFeedback("success", enableHaptics);
    onCopySuccess?.(email);
  }, [showToast, email, onCopySuccess, enableHaptics, t]);

  const handleError = useCallback(
    (errorMessage: string) => {
      setState((prev) => ({
        ...prev,
        copied: false,
        loading: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1,
      }));

      showToast(t("error"), "error");
      triggerHapticFeedback("error", enableHaptics);
      onCopyError?.(errorMessage, email);
    },
    [showToast, email, onCopyError, enableHaptics, t]
  );

  const copyToClipboard = useCallback(() => {
    const debounced = debounce(async () => {
      if (!isValidEmail(email)) {
        return handleError(t("invalidEmail"));
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
          handleSuccess();
        } else {
          await fallbackCopyText(email);
          handleSuccess();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Copy failed";
        handleError(message);
      }
    }, CONFIG.DEBOUNCE_MS);

    debounced();
  }, [email, handleError, handleSuccess, t]);

  return {
    ...state,
    copyToClipboard,
  };
};
