"use client";
import { cn } from "@/lib/utils";
import { BentoCardProps } from "./types";

export const BasicCard = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: BentoCardProps) => {
  const renderBackgroundImages = () => (
    <>
      <div className="w-full h-full absolute">
        {img && (
          <img
            src={img}
            alt={img}
            className={cn(imgClassName, "object-cover object-center")}
          />
        )}
      </div>
      <div
        className={`absolute right-0 -bottom-5 ${
          id === 5 && "w-full opacity-80"
        }`}
      >
        {spareImg && (
          <img
            src={spareImg}
            alt={spareImg}
            className="object-cover object-center w-full h-full"
          />
        )}
      </div>
    </>
  );

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
      <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
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
      <div className="h-full">
        {renderBackgroundImages()}
        {renderContent()}
      </div>
    </div>
  );
};
