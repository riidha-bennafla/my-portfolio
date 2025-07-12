// components/contact/ContactCard/hooks/useToast.ts
"use client";
import { useRef, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const toastId = useRef(0);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { message, type, id }]);

    // Auto-remove after delay
    setTimeout(
      () => {
        removeToast(id);
      },
      type === "success" ? 3000 : 5000
    );
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};
