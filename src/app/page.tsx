import dynamic from "next/dynamic"; // Import dynamic for lazy loading
import Header from "@/components/layout/header";
import Hero from "@/components/sections/Hero";
import ScrollToTopButton from "@/components/layout/scrollToTop"; 

// Dynamically import components that are likely below the fold
// We will assume these are client components for now,
// but if they can be pure server components, you can remove ssr: false
const About = dynamic(() => import("@/components/sections/About"));
const Marquee = dynamic(() => import("@/components/sections/Marquee"));
const Services = dynamic(() => import("@/components/sections/Services"));
const WhyUsSection = dynamic(() => import("@/components/sections/WhyUsSection"));
const StatsSection = dynamic(() => import("@/components/sections/Counter")); // Your StatsSection is here!
const Team = dynamic(() => import("@/components/sections/Team"));
const TestimonialSection = dynamic(() => import("@/components/sections/Testimonial"));
// const Blog = dynamic(() => import("@/components/sections/Blog"));
// const Instagram = dynamic(() => import("@/components/sections/Instagram"));
const Footer = dynamic(() => import("@/components/layout/footer"));


export default function Page() {
  return (
    <div className="overflow-x-hidden">
      <Header isHomePage />
      <Hero />
      <About />
      <Marquee />
      <Services />
      <WhyUsSection />
      <StatsSection />
      <Team />
      <TestimonialSection />
      {/* <Blog /> */}
      {/* <Instagram /> */}
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}