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
            title="Contact"
            description="Available for freelance work and collaborations"
            email="work@yourportfolio.com"
            locale="fr" // French localization
            enableHaptics={false} // Disable vibration on mobile
            className="border-2 border-purple-500/30 rounded-3xl"
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
