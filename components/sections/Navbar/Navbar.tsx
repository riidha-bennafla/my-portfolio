import { personalInfo } from "@/data/personal";
import React from "react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 py-4 grid-layout body text-sm lg:text-[15px] font-medium bg-main text-white border-b border-solid border-white/10 z-[100]">
      <a
        href=""
        className="col-span-4 col-start-1 hover:text-yellow-300 duration-300 transition-color"
      >
        <h1>{personalInfo.name}</h1>
      </a>
      <p className="col-span-6 md:col-span-3 lg:col-span-2 md:col-start-7 lg:col-start-7">
        {personalInfo.title}
      </p>
      <p className="hidden col-span-3 lg:inline md:col-start-9">
        {personalInfo.location}
      </p>
    </nav>
  );
};

export default Navbar;
