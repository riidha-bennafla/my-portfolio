import Footer from "@/components/sections/Footer/Footer";
import InformationGrid from "@/components/sections/InformationGrid/InformationGrid";
import Navbar from "@/components/sections/Navbar/Navbar";
import Portfolio from "@/components/sections/Portfolio/Portfolio";

export default function Home() {
  return (
    <>
      <div className="w-full flex items-center flex-col z-[200]">
        <div className="w-full h-full flex justify-center bg-main z-10">
          <div className="relative w-full max-w-8xl px-3 md:px-3 pb-8 flex flex-col border-b border-solid border-neutral-800 shadow-xl text-padding z-[9]">
            <Navbar />
            <main>
              <section className="relative w-full max-w-8xl grid grid-col-12 grid-gap z-10">
                <InformationGrid />
                <Portfolio />
              </section>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
