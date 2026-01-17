import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Grosirin - E-Commerce Platform",
    template: "%s | Grosirin"
  },
  description: "Platform e-commerce modern dengan multi-store management, inventory tracking, dan sistem diskon yang lengkap",
  keywords: ["e-commerce", "online shop", "toko online", "belanja online", "multi-store"],
  authors: [{ name: "Grosirin Team" }],
  creator: "Grosirin",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://grosirin.com",
    title: "Grosirin - E-Commerce Platform",
    description: "Platform e-commerce modern dengan multi-store management",
    siteName: "Grosirin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Navbar/> */}
        {children}
        {/* <Footer/> */}
        <Toaster richColors />
      </body>
    </html>
  );
}
