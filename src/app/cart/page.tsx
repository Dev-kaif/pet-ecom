"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import CartPage from "@/components/pages/Cart";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Cart"/>
      <CartPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
