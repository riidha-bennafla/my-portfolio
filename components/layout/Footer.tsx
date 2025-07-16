// components/layout/Footer.tsx
import React from "react";
import Version from "@/components/ui/Version";
import SocialLinks from "@/components/ui/SocialLinks";
import ContactInfo from "@/components/ui/ContactInfo";

const Footer = () => {
  return (
    <footer className="sticky-bottom w-full flex-items-center-col bg-secondary text-text z-[1]">
      <section className="relative w-full max-w-8xl grid grid-cols-12 gap-x-3 gap-y-8 px-4 pb-10 pt-6 md:pt-8 z-10">
        <div className="col-start-1 col-end-13 mono-font md:col-start-1 md:col-end-6">
          <Version />
        </div>

        <div className="col-start-1 col-end-13 md:col-start-7 md:col-end-9">
          <SocialLinks />
        </div>

        <div className="col-start-1 col-end-13 md:col-start-9">
          <ContactInfo />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
