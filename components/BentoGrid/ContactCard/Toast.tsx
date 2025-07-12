// components/contact/ContactCard/Toast.tsx
"use client";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { useTranslation } from "./hooks/useTranslation";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  locale?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  locale = "en",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation(locale);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        handleClose();
      },
      type === "success" ? 3000 : 5000
    );

    return () => clearTimeout(timer);
  }, [type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const toastStyles = {
    success: "bg-green-600 border-green-500",
    error: "bg-red-600 border-red-500",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2",
        "min-w-[300px] max-w-[90vw] z-50",
        "transition-all duration-300",
        isVisible ? "animate-fade-in-up" : "animate-fade-out-down"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-lg shadow-lg",
          "border border-opacity-50 text-white",
          toastStyles[type]
        )}
      >
        <div className="flex items-center">
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label={t("closeNotification")}
        >
          <IoCloseOutline className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
