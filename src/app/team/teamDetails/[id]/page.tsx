"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import TeamDetails from "@/components/pages/TeamDetails";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Team Details"/>
      <TeamDetails/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
