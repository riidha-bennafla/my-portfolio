import About from "@/components/layout/About";
import Experience from "@/components/layout/Experience";
import { ABOUT_ITEMS, EXPERIENCE_ITEMS } from "@/content/aboutSection";

const AboutSection = () => {
  return (
    <section className="my-6 grid-layout">
      <About title="About" content={ABOUT_ITEMS} />
      <Experience items={EXPERIENCE_ITEMS} />
    </section>
  );
};

export default AboutSection;
