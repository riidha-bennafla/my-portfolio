// components/icons/CopyIcon.tsx
import React, { memo } from "react";
import { IoCopyOutline } from "react-icons/io5";

/**
 * Copy icon component
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Copy icon SVG
 */
export const CopyIcon = memo(
  ({ className = "size-4" }: { className?: string }) => (
    <IoCopyOutline className={className} />
  )
);

CopyIcon.displayName = "CopyIcon";
