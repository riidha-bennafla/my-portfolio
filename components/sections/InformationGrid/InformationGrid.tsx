import React from "react";
import About from "./About";
import Experience from "./Experience";

const InformationGrid = () => {
  return (
    <section className="my-6 grid-layout">
      <About />
      <Experience />
    </section>
  );
};

export default InformationGrid;
