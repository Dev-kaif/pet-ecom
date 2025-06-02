"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import About from "@/components/sections/About";
import Banner from "@/components/sections/Hero";
import Blog from "@/components/sections/Blog";
import CallToAction from "@/components/sections/CallToAction";
import Counter from "@/components/sections/Counter";
import Instagram from "@/components/sections/Instagram";
import Services from "@/components/sections/Services";
import Team from "@/components/sections/Team";

export default function Page() {
  return (
    <>
      <Header />
      <Banner />
      <Services />
      <About />
      <Counter />
      <Team />
      <CallToAction />
      <Blog />
      <Instagram />
      <Footer />
    </>
  );
}
