"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import FAQPage from "@/components/pages/Faq";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Faq's" />
      <FAQPage />
      <Suscribe />
      <Footer />
    </div>
  );
}
