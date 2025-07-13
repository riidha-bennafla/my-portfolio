// components/icons/CopyingIcon.tsx
import { cn } from "@/lib/utils";
import { JSX } from "react";

/**
 * Loading spinner icon for copying state
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Animated spinner
 */
export const CopyingIcon = ({
  className,
}: {
  className?: string;
}): JSX.Element => (
  <div
    className={cn(
      "size-4 border-2 border-white/30 border-t-white rounded-full animate-spin",
      className
    )}
  />
);
