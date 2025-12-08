import { CategorySection } from "@/components/categorySection";
import HeroCarousel from "@/components/heroCarousel";
import OurStore from "@/components/ourStore";
import { ProductListMock } from "@/components/productList";
import StoreInfoBar from "@/components/storeInfoBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <StoreInfoBar storeName="FreshMart East" />
        <HeroCarousel/>
        <CategorySection/>
        <ProductListMock/>
        
        <OurStore/>

      </main>

    </div>
  )
}