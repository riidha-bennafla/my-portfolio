import { cn } from "@/lib/utils";
import { ExperienceTitleProps, ExperienceDescriptionProps } from "@/types";

export const ExperienceTitle = ({
  title,
  period,
  className,
}: ExperienceTitleProps) => {
  const br = <br />;
  const isPeriod = period !== undefined;
  return (
    <h3
      className={cn("col-span-2 col-start-1 col-end-3 text-white", className)}
    >
      {title} {isPeriod && br} {isPeriod && period}
    </h3>
  );
};

export const ExperienceDescription = ({
  description,
  className,
}: ExperienceDescriptionProps) => {
  return (
    <p className={cn("col-span-4 col-start-3 text-white", className)}>
      {description}
    </p>
  );
};
