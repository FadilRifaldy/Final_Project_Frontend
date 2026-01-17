'use client';

import { useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  Loader2,
  Package,
  Store as StoreIcon,
  ArrowLeft,
} from 'lucide-react';
import ProductsTab from '@/components/browse/ProductsTab';
import StoresTab from '@/components/browse/StoresTab';
import { useBrowseData } from '@/hooks/useBrowseData';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Types
interface Product {
  id: string;
  name: string;
  description?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    imageUrl: string;
    order: number;
  }>;
  variants: Array<{
    id: string;
    slug: string;
    price: number;
    isActive: boolean;
  }>;
  storeName?: string;
  storeCity?: string;
  storeId?: string;
  availableStock?: number;
  lowestPrice?: number;
}

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  totalProducts?: number;
}

export default function BrowsePage() {
  const router = useRouter();
  const {
    // Data
    products,
    stores,

    // UI States
    loading,
    citiesLoading,
    activeTab,

    // Search & Filter
    searchTerm,
    setSearchTerm,
    availableCities,
    selectedCity,

    // Pagination
    hasMore,
    totalItems,

    // Handlers
    handleSearch,
    handleCityChange,
    handleTabChange,
    handleLoadMore,
    handleReset,
    setPage,

    // Utilities
    generateSlug,
    formatPrice,
  } = useBrowseData();

  // ==================== LOADING STATE ====================
  if (citiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat...</h3>
          <p className="text-gray-600">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header dengan gradient */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">

          {/* Header Row: Back + Logo + Title */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 self-start md:self-auto z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 hover:text-white rounded-full"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <img
                src="/grosirin-navbar-footer.svg"
                className="h-14 w-auto object-contain bg-white rounded-xl p-2 shadow-md"
                alt="Logo"
              />
            </div>

            <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 w-full md:w-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Jelajahi Produk & Toko
              </h1>
              <p className="text-amber-50">Temukan penawaran terbaik di sekitar Anda</p>
            </div>
          </div>

          {/* Integrated Compact Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">

              {/* 1. Type Switcher (Tabs) */}
              <div className="shrink-0 bg-gray-100 rounded-xl p-1">
                <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as 'products' | 'stores')} className="w-full md:w-auto">
                  <TabsList className="h-10 bg-transparent p-0 w-full md:w-auto grid grid-cols-2 md:flex">
                    <TabsTrigger
                      value="products"
                      className="rounded-lg px-4 h-full data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Produk
                    </TabsTrigger>
                    <TabsTrigger
                      value="stores"
                      className="rounded-lg px-4 h-full data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <StoreIcon className="h-4 w-4" />
                      Toko
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Divider (Desktop) */}
              <div className="hidden md:block w-px bg-gray-200 my-2" />

              {/* 2. City Selection */}
              <div className="flex items-center px-2 shrink-0 md:w-[200px]">
                <div className="flex items-center gap-2 w-full bg-gray-50 md:bg-transparent rounded-xl md:rounded-none px-3 md:px-0 h-10 md:h-auto">
                  <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                  <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 bg-transparent p-0 h-auto font-medium text-gray-700 text-sm">
                      <SelectValue placeholder="Pilih Kota" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city: string) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Divider (Desktop) */}
              <div className="hidden md:block w-px bg-gray-200 my-2" />

              {/* 3. Search Input & Button */}
              <div className="flex-1 relative flex gap-2 flex-col md:flex-row">
                <div className="flex items-center w-full bg-gray-50 md:bg-transparent rounded-xl md:rounded-none h-10 md:h-full px-3 md:px-0">
                  <Search className="h-4 w-4 text-gray-400 shrink-0 mr-2" />
                  <Input
                    type="text"
                    placeholder={activeTab === 'products' ? "Cari produk..." : "Cari toko..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-full text-base placeholder:text-gray-400"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow-md h-10 px-6 shrink-0"
                >
                  Search
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Content dengan padding yang lebih baik */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        {!loading && totalItems > 0 && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800">
              {searchTerm.trim()
                ? `Hasil "${searchTerm}"`
                : `Semua ${activeTab === 'products' ? 'Produk' : 'Toko'}`
              }
            </h2>

            {/* Right Side Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                {selectedCity}
              </div>
              <div className="text-sm font-medium text-gray-600 pl-2 border-l border-gray-200">
                <span className="font-bold text-amber-600">{totalItems}</span> hasil
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-amber-500 mb-4 mx-auto" />
              <p className="text-gray-700 text-lg font-medium">Mencari {activeTab === 'products' ? 'produk' : 'toko'}...</p>
              <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        <ProductsTab
          products={products}
          loading={loading}
          activeTab={activeTab}
          searchTerm={searchTerm}
          selectedCity={selectedCity}
          setSearchTerm={setSearchTerm}
          setPage={setPage}
          fetchData={handleReset}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
          generateSlug={generateSlug}
          formatPrice={formatPrice}
        />

        {/* Stores Tab */}
        <StoresTab
          stores={stores}
          loading={loading}
          activeTab={activeTab}
          searchTerm={searchTerm}
          selectedCity={selectedCity}
          setSearchTerm={setSearchTerm}
          setPage={setPage}
          fetchData={handleReset}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
          generateSlug={generateSlug}
        />
      </div>
    </div >
  );
}