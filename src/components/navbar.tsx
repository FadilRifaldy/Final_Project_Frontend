"use client";

import { useState } from "react";
import {
  MapPin,
  User,
  Search,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#products" },
    { name: "Category", href: "#category" },
    { name: "Promo", href: "#promo" },
    { name: "About Us", href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-fresh flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                F
              </span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Fresh<span className="text-primary">Mart</span>
            </span>
          </a>

          {/* Location Badge - Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-secondary/80 transition-colors">
            <MapPin size={18} className="text-primary" />
            <span className="text-sm text-foreground font-medium">
              Jakarta Selatan
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-green-500 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search - Desktop */}
            <button className="hidden md:flex p-3 cursor-pointer rounded-lg hover:bg-amber-400 transition-colors">
              <Search size={20} />
            </button>

            {/* Search - Mobile */}
            <button className="md:hidden p-2 rounded-lg hover:bg-amber-300 transition-colors">
              <Search size={22} />
            </button>

            {/* Cart */}
            <button className="cursor-pointer relative p-3 rounded-lg hover:bg-amber-400 transition-colors">
              <ShoppingCart size={20} />

              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Login Button - Desktop */}
            <button className="cursor-pointer hidden md:flex btn-primary rounded-full px-4 py-2 items-center bg-green-400 hover:scale-105 transition-transform duration-300">
              <User size={16} className="mr-2" />
              Masuk
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            {/* Location - Mobile */}
            <div className="flex items-center mx-4 gap-2 bg-gray-100 px-4 py-3 rounded-xl mb-4">
              <MapPin size={18} className="text-primary" />
              <span className="text-sm text-foreground font-medium">
                Jakarta Selatan
              </span>
            </div>

            {/* Search - Mobile */}
            <div className="flex items-center gap-3 mx-4 mb-4 bg-gray-100 px-4 py-3 rounded-xl">
              <Search size={20} />
              <span className="text-sm text-muted-foreground">
                Cari produk segar...
              </span>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-green-500 font-medium py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex justify-center">
              <button className="mt-4 flex items-center gap-3 mx-4 mb-4 bg-green-400 px-4 py-3 rounded-xl">
                <User size={16} />
                Masuk / Daftar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
