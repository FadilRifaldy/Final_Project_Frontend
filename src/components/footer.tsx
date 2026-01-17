import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "Tentang Kami", href: "#" },
      { name: "Karir", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
    ],
    support: [
      { name: "Pusat Bantuan", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Hubungi Kami", href: "#" },
      { name: "Pengiriman", href: "#" },
    ],
    legal: [
      { name: "Syarat & Ketentuan", href: "#" },
      { name: "Kebijakan Privasi", href: "#" },
      { name: "Pengembalian", href: "#" },
    ],
  };

  const storeInfo = [
    { icon: MapPin, text: "Jl. Asia Afrika No.133-137 lt.9, Kota Bandung, Jawa Barat" },
    { icon: Phone, text: "+62 21 1234 5678" },
    { icon: Mail, text: "hello@grosirin.id" },
    { icon: Clock, text: "Setiap hari 24 Jam" },
  ];

  return (
    <footer id="footer" className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#" className="inline-block mb-8">
              <div className="bg-white p-4 rounded-3xl shadow-md inline-flex items-center justify-center">
                <img
                  src="/grosirin-navbar-footer.svg"
                  className="h-12 w-auto object-contain"
                  alt="Grosirin Logo"
                />
              </div>
            </a>
            <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed">
              Belanja kebutuhan sehari-hari lebih mudah dan cepat. Produk segar berkualitas langsung dari petani lokal.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-4">Info Toko</h4>
            <ul className="space-y-3">
              {storeInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/70">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-sm text-primary-foreground/60 text-center">
              © 2026 Grosirin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
