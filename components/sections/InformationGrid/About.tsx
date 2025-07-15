import Caption from "@/components/ui/Caption";
import DottedLink from "@/components/ui/DottedLink";
import React from "react";

const About = () => {
  return (
    <div className="flex flex-col col-start-1 col-end-13 md:col-end-5 gap-3">
      <Caption text="About" />
      <p className="col-start-1  md:col-start-1 md:col-span-5 col-end-13 mb-4 md:mb-0 text-white z-1000">
        Jo (He/Him) designs interfaces. He thrives in complex, ambiguous problem
        spaces focused around interactive media, digital tooling, and multimodal
        interaction. He studied{" "}
        <DottedLink
          link="https://design.cmu.edu/"
          target="_blank"
          title="computer science design"
          sup
          supText="↗"
        />{" "}
        at{" "}
        <DottedLink
          link="https://www.cmu.edu/"
          target="_blank"
          title="Carnegie Mellon University"
          sup
          supText="↗"
        />
      </p>
    </div>
  );
};

export default About;
