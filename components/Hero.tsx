import { Spotlight } from "./ui/Spotlight";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  return (
    <div className="pb-20 pt-32">
      {/* Spotlights */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      {/* Grid Background */}
      <div className="absolute top-0 left-0 flex h-screen min-w-screen w-full items-center justify-center bg-white dark:bg-black-100">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:60px_60px]",
            "dark:[background-image:linear-gradient(to_right,#e4e4e706_2px,transparent_2px),linear-gradient(to_bottom,#e4e4e706_2px,transparent_2px)]",
            "[background-image:linear-gradient(to_right,#26262606_2px,transparent_2px),linear-gradient(to_bottom,#26262606_2px,transparent_2px)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100" />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className=" uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Dynamic Web Magic with Next.js
          </h2>
          <TextGenerateEffect
            className="text-center text-[40px] sm:text-[60px] md:text-5xl lg:text-6xl"
            words="Transforming Concepts into Seamless Experiences"
          />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi, I&apos;m Ridha, a Next.js Developer based in Algeria
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
