import Container from "@/components/layout/Container";
import Footer from "@/components/sections/Footer/Footer";
import InformationGrid from "@/components/sections/InformationGrid/InformationGrid";
import Navbar from "@/components/sections/Navbar/Navbar";
import Portfolio from "@/components/sections/Portfolio/Portfolio";

export default function Home() {
  return (
    <>
      <Container>
        <Navbar />
        <main>
          <section className="relative w-full max-w-8xl grid grid-col-12 grid-gap z-10">
            <InformationGrid />
            <Portfolio />
          </section>
        </main>
      </Container>
      <Footer />
    </>
  );
}
