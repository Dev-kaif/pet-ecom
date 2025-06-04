"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import PricingSection from "@/components/pages/Pricing";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Pricing"/>
      <PricingSection />
      <Suscribe/>
      <Footer />
    </div>
  );
}
