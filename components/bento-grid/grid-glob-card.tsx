"use client";
import { cn } from "@/lib/utils";
import { BentoCardProps } from "./types";
import { GlobeDemo } from "../ui/GridGlobe";

export const GridGlobeCard = ({
  className,
  title,
  description,
  titleClassName,
}: BentoCardProps) => {
  const renderContent = () => (
    <div
      className={cn(
        titleClassName,
        "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
      )}
    >
      <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
        {description}
      </div>
      <div className="font-sans text-lg lg:text-3xl font-bold z-10 ">
        {title}
      </div>
    </div>
  );

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
      <div className="h-full">{renderContent()}</div>
      <GlobeDemo />
    </div>
  );
};
