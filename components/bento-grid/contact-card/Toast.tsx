// Toast.tsx

import React from "react";
import { ToastState } from "./types";
import { cn } from "@/lib/utils";

interface ToastProps {
  toasts: ToastState[];
  onClose: (id: number) => void;
}

export const Toast = ({ toasts, onClose }: ToastProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-[1000] space-y-2 w-[300px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn("rounded-lg p-4 shadow-md text-sm text-white", {
            "bg-green-600": toast.type === "success",
            "bg-red-600": toast.type === "error",
            "bg-blue-600": toast.type === "info",
            "bg-yellow-500 text-black": toast.type === "warning",
          })}
        >
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button
              onClick={() => onClose(toast.id)}
              className="ml-2 text-white/80 hover:text-white"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
