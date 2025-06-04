"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import PetsPage from "@/components/pages/AllPets";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="All pets"/>
      <PetsPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
