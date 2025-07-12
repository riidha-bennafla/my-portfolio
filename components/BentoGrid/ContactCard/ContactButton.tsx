// components/contact/ContactCard/ContactButton.tsx
import React, { memo } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

type ButtonStatus = "idle" | "copying" | "copied" | "error";

interface ContactButtonProps {
  status: ButtonStatus;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const ButtonStates = {
  idle: {
    bg: "bg-blue-600 hover:bg-blue-700",
    icon: <IoCopyOutline className="w-4 h-4" />,
  },
  copying: {
    bg: "bg-gray-600",
    icon: (
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ),
  },
  copied: {
    bg: "bg-green-600",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-600 hover:bg-red-700",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const ContactButton = memo(
  ({ status, onClick, label, disabled }: ContactButtonProps) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-live="polite"
        aria-busy={status === "copying"}
        className={cn(
          "w-full flex items-center justify-center py-3 px-6 rounded-lg",
          "text-white font-medium transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          ButtonStates[status].bg,
          disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"
        )}
      >
        <span className="mr-2">{ButtonStates[status].icon}</span>
        <span>{label}</span>
      </button>
    );
  }
);
ContactButton.displayName = "ContactButton";
