import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "../data";

const Grid = () => {
  return (
    <section id="about">
      <BentoGrid>
        {gridItems.map(
          ({
            id,
            title,
            description,
            className,
            img,
            spareImg,
            titleClassName,
            imgClassName,
          }) => (
            <BentoGridItem
              id={id}
              key={id}
              title={title}
              description={description}
              className={className}
              img={img}
              spareImg={spareImg}
              titleClassName={titleClassName}
              imgClassName={imgClassName}
            />
          )
        )}
      </BentoGrid>
    </section>
  );
};

export default Grid;
