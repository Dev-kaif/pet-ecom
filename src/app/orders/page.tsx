"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import MyOrdersPage from "@/components/pages/MyOrdersPage";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="My Order"/>
      <MyOrdersPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
