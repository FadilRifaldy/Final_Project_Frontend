import { CategorySection } from "@/components/categorySection";
import HeroCarousel from "@/components/heroCarousel";
import OurStore from "@/components/ourStore";
import { ProductList } from "@/components/productList";
import StoreInfoBar from "@/components/storeInfoBar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Navbar />
        <StoreInfoBar storeName="FreshMart East" />
        <HeroCarousel />
        <CategorySection />
        <ProductList />

        <OurStore />
        <Footer />

      </main>

    </div>
  )
}