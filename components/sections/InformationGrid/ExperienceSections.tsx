// src/components/sections/InformationGrid/ExperienceSections.tsx
import { cn } from "@/lib/utils";
import { ExperienceTitleProps, ExperienceDescriptionProps } from "@/types";

export const ExperienceTitle = ({
  title,
  period,
  className,
}: ExperienceTitleProps) => (
  <h3 className={cn("col-span-2 col-start-1 col-end-3 row-auto", className)}>
    <span className="experience-title-font">{title}</span>
    {period && (
      <span className="experience-period-font block mt-1">{period}</span>
    )}
  </h3>
);

export const ExperienceDescription = ({
  description,
  className,
}: ExperienceDescriptionProps) => (
  <div
    className={cn(
      "col-span-4 col-start-3 experience-description-font",
      className
    )}
  >
    {description}
  </div>
);
