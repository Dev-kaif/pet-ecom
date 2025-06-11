"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import UserProfilePage from "@/components/pages/UserProfile";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="User"/>
      <UserProfilePage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
