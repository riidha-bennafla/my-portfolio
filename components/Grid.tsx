"use client";

import {
  BentoGrid,
  BasicCard,
  TechStackCard,
  BentoCardProps,
  GridGlobeCard,
} from "./bento-grid";
import { ContactCard } from "./BentoGrid/ContactCard";
import { gridItems } from "../data";

const Grid = () => {
  const renderGridItem = (item: BentoCardProps) => {
    switch (item.id) {
      case 2:
        return <GridGlobeCard key={item.id} {...item} />;
      case 3:
        return <TechStackCard key={item.id} {...item} />;
      case 6:
        return (
          <ContactCard
            title="Do you want to start a project together?"
            enableHaptics={true}
            className="md:col-span-6 lg:col-span-2 lg:row-span-3"
            titleClassName="text-xl font-bold text-purple-300"
            onCopySuccess={(email) => console.log("Copied:", email)}
          />
        );
      default:
        return <BasicCard key={item.id} {...item} />;
    }
  };

  return (
    <section id="about">
      <BentoGrid>{gridItems.map(renderGridItem)}</BentoGrid>
    </section>
  );
};

export default Grid;
