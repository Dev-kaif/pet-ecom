"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import Team from "@/components/sections/Team";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Team"/>
      <Team/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
