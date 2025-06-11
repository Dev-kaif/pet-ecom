"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import Gallery from "@/components/pages/Gallery";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Our Gallery"/>
      <Gallery />
      <Suscribe/>
      <Footer />
    </div>
  );
}
