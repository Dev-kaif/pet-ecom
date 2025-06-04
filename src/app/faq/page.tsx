'use client'
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import FAQPage from "@/components/pages/Faq";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Faq's" />
      <FAQPage/>
      <Footer />
    </div>
  );
}
