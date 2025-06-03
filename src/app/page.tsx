"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import About from "@/components/sections/About";
import Banner from "@/components/sections/Hero";
import Blog from "@/components/sections/Blog";
import CallToAction from "@/components/sections/CallToAction";
import Instagram from "@/components/sections/Instagram";
import Services from "@/components/sections/Services";
import Team from "@/components/sections/Team";
import Marquee from "@/components/sections/Marquee";
import WhyUsSection from "@/components/sections/WhyUsSection";
import StatsSection from "@/components/sections/Counter";

export default function Page() {
  return (
    <>
      <Header />
      <Banner />
      <About />
      <Marquee />
      <Services />
      <WhyUsSection />
      <StatsSection/>
      <Team />
      <CallToAction />
      <Blog />
      <Instagram />
      <Footer />
    </>
  );
}
