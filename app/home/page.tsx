import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "./components/AboutSection";

export default function Home() {
  return (
    <>
      <Container>
        <Navbar />
        <main className="min-h-[150dvh]">
          <section className="relative w-full max-w-8xl grid grid-cols-12 grid-gap">
            <AboutSection />
          </section>
        </main>
      </Container>
      <Footer />
    </>
  );
}
