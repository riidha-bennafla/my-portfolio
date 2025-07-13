// components/BentoGrid/ContactCard/ContactButton.tsx

// =============================================
// Component Imports
// =============================================
import React, { memo } from "react";
import { cn } from "@/lib/utils";
import {
  CopyIcon,
  CopyingIcon,
  SuccessIcon,
  ErrorIcon,
} from "@/components/icons";

// =============================================
// Type Definitions
// =============================================
export type ButtonStatus = "idle" | "copying" | "copied" | "error";

interface ContactButtonProps {
  status: ButtonStatus;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

// =============================================
// Button State Configuration
// =============================================
const ButtonStates = {
  idle: {
    bg: "bg-blue-600 hover:bg-blue-700",
    icon: <CopyIcon />,
    ariaLabel: "Copy email address",
  },
  copying: {
    bg: "bg-gray-600",
    icon: <CopyingIcon />,
    ariaLabel: "Copying in progress",
  },
  copied: {
    bg: "bg-green-600",
    icon: <SuccessIcon />,
    ariaLabel: "Email copied",
  },
  error: {
    bg: "bg-red-600 hover:bg-red-700",
    icon: <ErrorIcon />,
    ariaLabel: "Copy error occurred",
  },
} satisfies Record<
  ButtonStatus,
  {
    bg: string;
    icon: React.ReactNode;
    ariaLabel: string;
  }
>;

// =============================================
// Main Component
// =============================================
/**
 * Interactive button component for contact actions with visual state feedback
 *
 * @param {ButtonStatus} status - Current button state
 * @param {function} onClick - Click handler function
 * @param {string} label - Button text content
 * @param {boolean} [disabled] - Disabled state flag
 *
 * @returns {JSX.Element} Stateful button UI
 */
export const ContactButton = memo(
  ({ status, onClick, label, disabled }: ContactButtonProps) => {
    const stateConfig = ButtonStates[status] || ButtonStates.idle;

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        aria-live="polite"
        aria-busy={status === "copying"}
        aria-label={stateConfig.ariaLabel}
        className={cn(
          "relative inline-flex h-12 w-full max-w-80 mx-auto overflow-hidden rounded-lg p-[1px] sm:mt-3 md:mt-7 focus:outline-none cursor-pointer",
          disabled
            ? "cursor-not-allowed opacity-80 grayscale"
            : "cursor-pointer hover:scale-[1.02] transition-transform"
        )}
      >
        {/* Spinning gradient background */}
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full items-center justify-center rounded-lg bg-slate-950 px-7 md:px-12 text-sm font-medium text-white backdrop-blur-3xl gap-2">
          <span className="mr-2">{stateConfig.icon}</span>
          <span>{label}</span>
        </span>
      </button>
    );
  }
);

ContactButton.displayName = "ContactButton";
