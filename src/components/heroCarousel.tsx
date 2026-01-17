"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


const slides = [
  { id: 1, image: "/images/banner1.png" },
  { id: 2, image: "/images/banner2.png" },
  { id: 3, image: "/images/banner3.png" },
];

export default function HeroCarousel() {
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">

        {/* Carousel */}
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]}
          className="relative"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative aspect-[16/5] md:aspect-[256/85] w-full rounded-3xl overflow-hidden">
                  <Image
                    src={slide.image}
                    alt="banner"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-black border-0 shadow-md" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white text-black border-0 shadow-md" />
        </Carousel>
      </div>
    </section>
  );
}