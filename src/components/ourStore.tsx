import { Truck, Timer, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-6 h-6 text-primary" />,
    text: "Ongkir Fleksibel",
    subtext: "Min. belanja Rp100rb",
  },
  {
    icon: <Timer className="w-6 h-6 text-primary" />,
    text: "Pengiriman Tentative",
    subtext: "Dalam 24 jam",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    text: "Produk Terjamin",
    subtext: "100% Fresh",
  },
];

export default function OurStore() {
  return (
    <section>
      {/* Features */}
      <div className="bg-card border-y border-border mt-6">
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-4 p-4 rounded-xl hover:bg-secondary transition"
              >
                <div className="w-12 h-12 rounded-full bg-fresh-green-light flex items-center justify-center flex-shrink-0">
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
  );
}
