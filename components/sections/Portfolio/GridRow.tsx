// src/components/sections/Portfolio/GridRow.tsx
import PortfolioProject from "@/components/ui/PortfolioProject";
import { projects } from "@/data/projects";

const GridRow = () => {
  return (
    <>
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <PortfolioProject key={project.link} {...project} />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <PortfolioProject key={project.link} {...project} />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <PortfolioProject key={project.link} {...project} />
        ))}
      </div>
    </>
  );
};

export default GridRow;
