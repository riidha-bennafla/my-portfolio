import {
  BentoGrid,
  BasicCard,
  TechStackCard,
  ContactCard,
  BentoCardProps,
  GridGlobeCard,
} from "./bento-grid";
import { gridItems } from "../data";

const Grid = () => {
  const renderGridItem = (item: BentoCardProps) => {
    switch (item.id) {
      case 2:
        return <GridGlobeCard key={item.id} {...item} />;
      case 3:
        return <TechStackCard key={item.id} {...item} />;
      case 6:
        return <ContactCard key={item.id} {...item} />;
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
