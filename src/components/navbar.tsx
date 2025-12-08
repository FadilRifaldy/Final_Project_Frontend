"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  User,
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* LEFT — LOGO + CATEGORY DROPDOWN */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/klik.png"
                className="h-10 object-contain"
                alt="Klik Logo"
              />
            </Link>

            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[16px] text-gray-700 hover:text-black focus:outline-none">
                Category <ChevronDown size={18} />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem>Semua Produk</DropdownMenuItem>
                <DropdownMenuItem>Minuman</DropdownMenuItem>
                <DropdownMenuItem>Makanan</DropdownMenuItem>
                <DropdownMenuItem>Kebutuhan Rumah</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CENTER — SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full items-center bg-white shadow-sm rounded-xl border overflow-hidden">
              <Input
                placeholder="Search Products..."
                className="border-0 focus-visible:ring-0"
              />
              <Button className="rounded-none rounded-r-xl px-4 bg-amber-500 cursor-pointer hover:bg-amber-600">
                <Search size={18} />
              </Button>
            </div>
          </div>

          {/* RIGHT — CART + LOGIN + REGISTER */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button className="relative p-2 rounded-lg hover:bg-amber-500 transition cursor-pointer">
              <ShoppingCart size={22} />

              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Login */}
            <Link
              href="/signInPage"
              className="cursor-pointer hidden md:flex border border-amber-500 text-amber-500 px-4 py-2 rounded-xl hover:bg-amber-50 transition"
            >
              Sign In
            </Link>

            {/* Register */}
            <Link
              href="/signUpPage"
              className="cursor-pointer hidden md:flex bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Search Mobile */}
            <div className="mx-4 flex w-auto items-center bg-white shadow-sm rounded-xl border overflow-hidden">
              <Input
                placeholder="Search Products..."
                className="border-0 focus-visible:ring-0"
              />
              <Button className="rounded-none rounded-r-xl px-4 bg-amber-500">
                <Search size={18} />
              </Button>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-2 px-4">
              <a
                href="#"
                className="py-2 px-3 rounded-lg hover:bg-gray-100 transition"
              >
                Home
              </a>
              <a
                href="#"
                className="py-2 px-3 rounded-lg hover:bg-gray-100 transition"
              >
                Produk
              </a>
              <a
                href="#"
                className="py-2 px-3 rounded-lg hover:bg-gray-100 transition"
              >
                Promo
              </a>
            </nav>

            <div className="flex flex-col gap-3 px-4">
              <Link
                href="/signInPage"
                className="border border-amber-500 text-amber-500 px-4 py-2 rounded-xl
               flex items-center justify-center"
              >
                Sign In
              </Link>

              <Link
                href="/signUpPage"
                className="bg-amber-500 text-white px-4 py-2 rounded-xl
               flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
