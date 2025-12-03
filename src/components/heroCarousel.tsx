"use client"

import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Truck, Timer, ShieldCheck } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Belanja Segar, Diantar Cepat!",
    subtitle: "Gratis ongkir untuk pembelian pertama",
    discount: "Diskon 20%",
    image: "/banner1.png",
    accentColor: "bg-primary",
  },
  {
    id: 2,
    title: "Promo Mingguan",
    subtitle: "Beli 1 Gratis 1 untuk produk pilihan",
    discount: "Buy 1 Get 1",
    image: "/images/sayur.jpg",
    accentColor: "bg-accent",
  },
  {
    id: 3,
    title: "Sayur & Buah Segar",
    subtitle: "Langsung dari petani lokal",
    discount: "Hingga 30%",
    image: "/banner3.png",
    accentColor: "bg-primary",
  },
]

const features = [
  {
    icon: <Truck className="w-6 h-6 text-primary" />,
    text: "Gratis Ongkir",
    subtext: "Min. belanja Rp100rb",
  },
  {
    icon: <Timer className="w-6 h-6 text-primary" />,
    text: "Pengiriman Cepat",
    subtext: "Dalam 2 jam",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    text: "Produk Terjamin",
    subtext: "100% Fresh",
  },
]

export default function HeroCarousel() {
  return (
    <section className="relative overflow-hidden">
      <Carousel
        className="w-full relative"
        opts={{ loop: true }} 
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          }),
        ]}
      >
        <CarouselContent>

          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div
                className="relative h-[70vh] md:h-[80vh] w-full bg-center bg-cover bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 text-center text-white px-6 max-w-xl space-y-6">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${slide.accentColor} text-white`}
                  >
                    {slide.discount}
                  </span>

                  <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>

                  <p className="text-lg opacity-90">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                    <button className="rounded-full px-8 py-4 text-lg bg-primary text-primary-foreground hover:opacity-90 transition">
                      Belanja Sekarang
                    </button>
                    <button className="rounded-full px-8 py-4 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition">
                      Lihat Promo
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}

        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="bg-card border-y border-border mt-10">
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl hover:bg-secondary transition"
              >
                <div className="w-12 h-12 rounded-full bg-fresh-green-light flex items-center justify-center">
                  {f.icon}
                </div>

                <div>
                  <p className="font-semibold text-foreground">{f.text}</p>
                  <p className="text-sm text-muted-foreground">{f.subtext}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

    </section>
  )
}
