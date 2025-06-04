"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import About from "@/components/sections/About";
import Banner from "@/components/sections/Hero";
import Blog from "@/components/sections/Blog";
import Instagram from "@/components/sections/Instagram";
import Services from "@/components/sections/Services";
import Team from "@/components/sections/Team";
import Marquee from "@/components/sections/Marquee";
import WhyUsSection from "@/components/sections/WhyUsSection";
import StatsSection from "@/components/sections/Counter";
import TestimonialSection from "@/components/sections/Testimonial";
import ScrollToTopButton from "@/components/layout/scrollToTop";

export default function Page() {
  return (
    <div className="overflow-x-hidden">
      <Header isHomePage />
      <Banner />
      <About />
      <Marquee />
      <Services />
      <WhyUsSection />
      <StatsSection />
      <Team />
      <TestimonialSection />
      <Blog />
      <Instagram />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
