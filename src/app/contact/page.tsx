"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import ContactPage from "@/components/pages/Contact";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Contact"/>
      <ContactPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
