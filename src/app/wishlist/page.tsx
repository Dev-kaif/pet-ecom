"use client"
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Lable from "@/components/layout/Lable";
import Suscribe from "@/components/layout/Suscribe";
import WishlistPage from "@/components/pages/Wishlist";

export default function Page() {
  return (
    <div>
      <Header />
      <Lable lableName="Wishlist"/>
      <WishlistPage/>
      <Suscribe/>
      <Footer />
    </div>
  );
}
