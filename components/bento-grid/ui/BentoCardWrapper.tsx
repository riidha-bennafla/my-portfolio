// components/bento-grid/ui/BentoCardWrapper.tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { BentoCardProps } from "../types";

export const BentoCardWrapper = ({
  className,
  id,
  img,
  imgClassName,
  spareImg,
  children,
}: BentoCardProps & { children?: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className="w-full h-full absolute">
        {img && (
          <img
            src={img}
            alt="background"
            className={cn(imgClassName, "object-cover object-center")}
          />
        )}
      </div>
      <div
        className={`absolute right-0 -bottom-5 ${
          id === 5 ? "w-full opacity-80" : ""
        }`}
      >
        {spareImg && (
          <img
            src={spareImg}
            alt="overlay"
            className="object-cover object-center w-full h-full"
          />
        )}
      </div>

      {children}
    </div>
  );
};
