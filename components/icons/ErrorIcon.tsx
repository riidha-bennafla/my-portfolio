// components/icons/ErrorIcon.tsx
import React, { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Error alert icon
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Error alert SVG
 */
export const ErrorIcon = memo(
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
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )
);

ErrorIcon.displayName = "ErrorIcon";
