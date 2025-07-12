// useToast.ts

import { useState, useCallback } from "react";
import { ToastState } from "./types";
import { CONFIG } from "./config";

let toastIdCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastState["type"] = "info",
      duration: number = CONFIG.TOAST_DURATION.INFO
    ) => {
      const id = ++toastIdCounter;

      const newToast: ToastState = {
        message,
        type,
        id,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const clearToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    clearToast,
  };
};
