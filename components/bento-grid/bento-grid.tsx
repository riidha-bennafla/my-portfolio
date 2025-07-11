"use client";
import { cn } from "@/lib/utils";
import { BentoGridProps } from "./types";

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 grid-rows-7 md:grid-rows-6 lg:grid-rows-4 gap-4 lg:gap-8 mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};
