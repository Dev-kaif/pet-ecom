"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import OrderDetailsPage from "@/components/pages/orderDetails";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Order Details"/>
      <OrderDetailsPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
