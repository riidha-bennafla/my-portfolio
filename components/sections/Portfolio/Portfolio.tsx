// src/components/sections/Portfolio/Portfolio.tsx
import GridRow from "./GridRow";

const Portfolio = () => {
  return (
    <div className="grid relative z-10 col-start-1 col-end-13 md:grid-cols-3 grid-gap">
      <GridRow />
      <GridRow />
      <GridRow />
    </div>
  );
};

export default Portfolio;
