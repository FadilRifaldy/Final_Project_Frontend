"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

import { verifyToken } from "@/lib/helpers/auth.backend";
import { logoutUser } from "@/lib/helpers/auth.backend";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<null | { name: string; email: string }>(
    null
  );
  const router = useRouter();

  // 🔥 Check login state saat navbar dirender
  useEffect(() => {
    async function fetchUser() {
      const res = await verifyToken();

      if (res.loggedIn) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  // 🔥 Logout handler
  async function handleLogout() {
    const res = await logoutUser();
    if (res.success) {
      toast.success("Logout successful");
      setUser(null);
      router.refresh();
      router.push("/");
    } else {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* LEFT — LOGO + CATEGORY */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/klik.png"
                className="h-10 object-contain"
                alt="Klik Logo"
              />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[16px] text-gray-700 hover:text-black">
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

          {/* CENTER — SEARCH */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full items-center bg-white shadow-sm rounded-xl border overflow-hidden">
              <Input
                placeholder="Search Products..."
                className="border-0 focus-visible:ring-0"
              />
              <Button className="rounded-none rounded-r-xl px-4 bg-amber-500 hover:bg-amber-600 cursor-pointer">
                <Search size={18} />
              </Button>
            </div>
          </div>

          {/* RIGHT — CART + AUTH */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button className="relative p-2 rounded-lg hover:bg-amber-500 transition cursor-pointer">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* 🔥 Jika user BELUM login → tampilkan Sign In / Sign Up */}
            {!user && (
              <>
                <Link
                  href="/signInPage"
                  className="cursor-pointer hidden md:flex border border-amber-500 text-amber-500 px-4 py-2 rounded-xl hover:bg-amber-50 transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/signUpPage"
                  className="cursor-pointer hidden md:flex bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* 🔥 Jika user SUDAH login → tampilkan PROFILE DROPDOWN */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer p-2 border rounded-xl hover:bg-gray-100">
                  <User size={20} />
                  <span className="hidden md:block">{user.name}</span>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Search */}
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
              <a className="py-2 px-3 rounded-lg hover:bg-gray-100 transition">
                Home
              </a>
              <a className="py-2 px-3 rounded-lg hover:bg-gray-100 transition">
                Produk
              </a>
              <a className="py-2 px-3 rounded-lg hover:bg-gray-100 transition">
                Promo
              </a>
            </nav>

            {/* 🔥 Mobile — kondisi login  */}
            {!user && (
              <div className="flex flex-col gap-3 px-4">
                <Link
                  href="/signInPage"
                  className="border border-amber-500 text-amber-500 px-4 py-2 rounded-xl flex items-center justify-center"
                >
                  Sign In
                </Link>

                <Link
                  href="/signUpPage"
                  className="bg-amber-500 text-white px-4 py-2 rounded-xl flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {user && (
              <div className="flex flex-col gap-3 px-4">
                <div className="py-2 px-3 rounded-lg bg-gray-100 text-center font-medium">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
