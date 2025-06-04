"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import AboutPage from "@/components/pages/About";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="about Us" />
      <AboutPage />

      <Footer />
    </div>
  );
}
