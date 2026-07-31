import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import FeaturedReviews from "@/components/FeaturedReviews";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Miranda Reviews - Professional Product Review Platform
 * Design: Elevated Minimalism with Warm Sophistication
 * - Lavender purple and warm cream palette
 * - Authentic storytelling
 * - Professional credentials
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Testimonials />
        <FeaturedReviews />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
