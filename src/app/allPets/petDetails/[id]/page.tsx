"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import PetDetailPage from "@/components/pages/PetDetails";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Pet Details"/>
      <PetDetailPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
