"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import ProductDetailsPage from "@/components/pages/ProducDetails";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Product Details"/>
      <ProductDetailsPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
