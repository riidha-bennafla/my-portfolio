// src/components/sections/InformationGrid/Experience.tsx
import { ExperienceTitle, ExperienceDescription } from "./ExperienceSections";
import { cn } from "@/utils/helpers";
import { ExperienceProps } from "@/types";
import { TextMono } from "@/components/ui/Text";

const Experience = ({ items, className }: ExperienceProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-6 col-start-1 col-end-13 gap-3 md:col-start-7",
        className
      )}
    >
      <TextMono
        text="Experience"
        className="col-span-2 col-start-1"
        aria-label="Experience section"
      />
      <TextMono
        text="Description"
        className="col-span-4 col-start-3"
        aria-label="Description section"
      />

      {items.map((item) => (
        <div key={item.id} className="contents group">
          <ExperienceTitle title={item.title} period={item.period} />
          <ExperienceDescription description={item.description} />
        </div>
      ))}
    </div>
  );
};

export default Experience;
