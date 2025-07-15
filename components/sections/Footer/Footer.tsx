import DottedLink from "@/components/ui/DottedLink";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center bg-sub dot-grid z-[1] w-full sticky bottom-0 text-zinc-100">
      <section className="w-full grid grid-cols-12 grid-gap relative z-10 max-w-8xl text-padding pb-10 pt-6 md:pb-10 md:pt-8 gap-y-8">
        <div className="flex-col space-y-2 col-start-1 col-end-13 font-fira-code text-[13px] tracking-[0.08em] leading-[160%] md:col-start-1 md:col-end-6">
          <span className="flex flex-row space-x-2 align-middle">
            <p className="self-center w-min px-2 pt-1 pb-[2px] font-fira-code lowercase text-yellow-300 border-yellow-300 border border-solid rounded-full">
              v2.0
            </p>
            <p className="self-center px-2 pt-1 pb-[2px] font-fira-code uppercase text-zinc-600">
              Last updated 2025-07-15
            </p>
          </span>
        </div>
        <span className="flex flex-col space-y-1 col-start-1 col-end-13 md:col-start-7 md:col-end-9">
          <p>
            <DottedLink
              link="https://github.com/JoHim"
              title="github"
              sup
              supText="1"
            />
          </p>
          <p>
            <DottedLink
              link="https://twitter.com/JoHim"
              title="twitter"
              sup
              supText="2"
            />
          </p>
          <p>
            <DottedLink
              link="https://www.linkedin.com/in/jo-him/"
              title="linkedin"
              sup
              supText="3"
            />
          </p>
          <p>
            <DottedLink
              link="https://www.instagram.com/jo_him/"
              title="instagram"
              sup
              supText="4"
            />
          </p>
          <p>
            <DottedLink
              link="https://www.youtube.com/@JoHim"
              title="youtube"
              sup
              supText="5"
            />
          </p>
        </span>
        <div className="flex flex-col space-y-1 col-start-1 col-end-13 md:col-start-9">
          <p>let&#39;s build something together</p>
          <span>
            <DottedLink
              link="mailto:bennafla.riidha@gmail.com"
              title="bennafla.riidha@gmail.com"
              sup
              supText="3"
            />
          </span>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
