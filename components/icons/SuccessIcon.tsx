// components/icons/SuccessIcon.tsx
import React, { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Success checkmark icon
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Success checkmark SVG
 */
export const SuccessIcon = memo(
  ({ className = "size-4" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
);

SuccessIcon.displayName = "SuccessIcon";
