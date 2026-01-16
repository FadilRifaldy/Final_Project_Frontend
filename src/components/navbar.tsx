"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  User,
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Store,
  Package,
  Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { getMe, logoutUser } from "@/lib/helpers/auth.backend";
import { getSearchSuggestions, SearchSuggestion } from "@/lib/helpers/search.backend";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    role: "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN";
  }>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      const res = await getMe();

      if (!mounted) return;

      if (res.success) {
        setUser(res.user);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(searchQuery.trim());
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "product") {
      router.push(`/browse?q=${encodeURIComponent(suggestion.name)}`);
    } else {
      const storeSlug = suggestion.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      router.push(`/store/${storeSlug}`);
    }
    setShowSuggestions(false);
    setSearchQuery("");
  };

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

  if (loading) {
    return (
      <header className="h-20 bg-white border-b flex items-center px-6">
        <div className="animate-pulse h-8 w-32 bg-gray-200 rounded" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
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
                <DropdownMenuItem onClick={() => router.push('/browse')}>
                  Semua Produk
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/browse?category=minuman')}>
                  Minuman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/browse?category=makanan')}>
                  Makanan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/browse?category=kebutuhan-rumah')}>
                  Kebutuhan Rumah
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CENTER — SEARCH WITH SUGGESTIONS */}
          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchRef}>
            <div className="w-full">
              <div className="flex w-full items-center bg-white shadow-sm rounded-xl border overflow-hidden">
                <Input
                  placeholder="Cari produk atau toko..."
                  className="border-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                />
                <Button 
                  onClick={handleSearch}
                  className="rounded-none rounded-r-xl px-4 bg-amber-500 hover:bg-amber-600"
                >
                  <Search size={18} />
                </Button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
                {loadingSuggestions ? (
                  <div className="p-4 flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mencari...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.type}-${suggestion.id}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition"
                      >
                        {suggestion.type === "product" ? (
                          <>
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              {suggestion.image ? (
                                <img 
                                  src={suggestion.image} 
                                  alt={suggestion.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{suggestion.name}</div>
                              {suggestion.category && (
                                <div className="text-xs text-gray-500">{suggestion.category}</div>
                              )}
                            </div>
                            <Package className="h-4 w-4 text-gray-400" />
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center flex-shrink-0">
                              <Store className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{suggestion.name}</div>
                              {suggestion.city && (
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {suggestion.city}
                                </div>
                              )}
                            </div>
                            <Store className="h-4 w-4 text-gray-400" />
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Tidak ada hasil ditemukan
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — CART + AUTH */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button className="relative p-2 rounded-lg hover:bg-amber-50 transition">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {!user && (
              <>
                <Link
                  href="/signInPage"
                  className="hidden md:flex border border-amber-500 text-amber-500 px-4 py-2 rounded-xl hover:bg-amber-50 transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/signUpPage"
                  className="hidden md:flex bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-2 border rounded-xl hover:bg-gray-100">
                  <User size={20} />
                  <span className="hidden md:block">{user.name}</span>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  {(user?.role === "SUPER_ADMIN" ||
                    user?.role === "STORE_ADMIN") && (
                      <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                        Dashboard
                      </DropdownMenuItem>
                    )}

                  <DropdownMenuItem onClick={() => router.push("/userProfile")}>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500"
                  >
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
            {/* Mobile Search */}
            <div className="mx-4">
              <div className="flex w-auto items-center bg-white shadow-sm rounded-xl border overflow-hidden">
                <Input
                  placeholder="Cari produk atau toko..."
                  className="border-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <Button onClick={handleSearch} className="rounded-none rounded-r-xl px-4 bg-amber-500">
                  <Search size={18} />
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-2 px-4">
              <Link href="/" className="py-2 px-3 rounded-lg hover:bg-gray-100 transition">
                Home
              </Link>
              <Link href="/browse" className="py-2 px-3 rounded-lg hover:bg-gray-100 transition">
                Produk
              </Link>
            </nav>

            {/* Mobile Auth */}
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