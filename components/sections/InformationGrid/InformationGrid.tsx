import React from "react";
import About from "./About";
import Experience from "./Experience";
import { ContentSegment, ExperienceItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "exp-1",
    title: "Frontend Teacher",
    period: "2024 summer",
    description: (
      <>
        Taught students aged between 10 and 16 web development basics, allowing
        them to be able to create basic websites using HTML and CSS, and
        introducing them to the web dev world.
      </>
    ),
  },
];
const ABOUT_ITEMS: ContentSegment[] = [
  {
    id: uuidv4(),
    type: "text",
    content:
      "Ridha is a self-taught Frontend developer and UI designer, who loves making modern and aesthetic interfaces while keeping them functional and user-friendly.",
  },
  {
    id: uuidv4(),
    type: "break line",
    content: "",
  },
  {
    id: uuidv4(),
    type: "break line",
    content: "",
  },
  {
    id: uuidv4(),
    type: "text",
    content: "He is currently studying at ",
  },
  {
    id: uuidv4(),
    type: "link",
    content: "Hassiba Benbouali University",
    link: "https://www.univ-chlef.dz/fle/",
    target: "_blank",
    sup: true,
    supText: "↗",
    arrowIcon: true,
  },
  {
    id: uuidv4(),
    type: "text",
    content: " as an English language student.",
  },
];
const InformationGrid = () => {
  return (
    <section className="my-6 grid-layout">
      <About title="About" content={ABOUT_ITEMS} />
      <Experience items={EXPERIENCE_ITEMS} />
    </section>
  );
};

export default InformationGrid;
