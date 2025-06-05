"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import Shop from "@/components/pages/Shop";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="All Products"/>
      <Shop/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
