'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Loader2, 
  Package, 
  Star, 
  Store as StoreIcon,
  ChevronRight,
  Phone,
  ShoppingCart,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api/axios';
import { getAvailableCities } from '@/lib/helpers/search.backend';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  const storeIdParam = searchParams.get('store') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  
  // City states
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || '');
  const [citiesLoading, setCitiesLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Load available cities
  useEffect(() => {
    const loadCities = async () => {
      try {
        const cities = await getAvailableCities();
        setAvailableCities(cities);
        
        // Set default city if not selected
        if (!selectedCity && cities.length > 0) {
          setSelectedCity(cities[0]);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        toast.error('Gagal memuat daftar kota');
      } finally {
        setCitiesLoading(false);
      }
    };

    loadCities();
  }, []);

  // Fetch data when city or search changes
  useEffect(() => {
    if (!citiesLoading && selectedCity) {
      fetchData();
    }
  }, [citiesLoading, selectedCity, searchTerm, activeTab, page, storeIdParam]);

  const fetchData = async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const response = await api.get('/search/products', {
          params: {
            search: searchTerm.trim() || undefined,
            city: selectedCity,
            storeId: storeIdParam || undefined,
            page,
            limit: 20,
          },
        });

        if (response.data.success) {
          setProducts(response.data.data);
          setHasMore(response.data.pagination.hasNext);
          setTotalItems(response.data.pagination.totalItems);
        }
      } else {
        const response = await api.get('/search/stores', {
          params: {
            hasProduct: searchTerm.trim() || undefined,
            city: selectedCity,
            page,
            limit: 20,
          },
        });

        if (response.data.success) {
          setStores(response.data.data);
          setHasMore(response.data.pagination.hasNext);
          setTotalItems(response.data.pagination.totalItems);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    setPage(1);
    
    // Update URL with city parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('city', newCity);
    if (searchTerm) params.set('q', searchTerm);
    router.push(`/browse?${params.toString()}`);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const generateProductSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const generateStoreSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30">
      {/* Header dengan gradient */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Jelajahi Produk & Toko
            </h1>
            <p className="text-amber-50 text-sm md:text-base">
              Temukan produk terbaik di kota Anda
            </p>
          </div>

          {/* City Selector & Search dalam satu container */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* City Selector */}
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-[180px] border-0 focus:ring-0 font-medium text-gray-700">
                    <SelectValue placeholder="Pilih Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari produk atau toko..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-14 pr-32 h-16 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button 
                    onClick={handleSearch} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl h-12 px-6 shadow-md"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Cari
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => {
                  setActiveTab(v as 'products' | 'stores');
                  setPage(1);
                }}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-2 h-14 bg-white/95 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg">
                  <TabsTrigger 
                    value="products" 
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                  >
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">Produk</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="stores" 
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                  >
                    <StoreIcon className="h-4 w-4" />
                    <span className="font-semibold">Toko</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Content dengan padding yang lebih baik */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        {!loading && totalItems > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {searchTerm.trim() 
                  ? `Hasil pencarian "${searchTerm}"` 
                  : `Semua ${activeTab === 'products' ? 'Produk' : 'Toko'}`
                }
              </h2>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>di {selectedCity}</span>
                <span className="text-gray-400">•</span>
                <span>
                  <span className="font-bold text-amber-600">{totalItems}</span> hasil ditemukan
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && page === 1 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-amber-500 mb-4 mx-auto" />
              <p className="text-gray-700 text-lg font-medium">Mencari {activeTab === 'products' ? 'produk' : 'toko'}...</p>
              <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {!loading && activeTab === 'products' && (
          <>
            {products.length === 0 ? (
              <div className="max-w-md mx-auto mt-12">
                <Card className="shadow-xl border-0 overflow-hidden">
                  <CardContent className="py-16 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-12 w-12 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Produk Tidak Ditemukan</h3>
                    <p className="text-gray-600 mb-6 px-4">
                      {searchTerm
                        ? `Tidak ada produk "${searchTerm}" di ${selectedCity}`
                        : `Belum ada produk tersedia di ${selectedCity}`}
                    </p>
                    <Button 
                      onClick={() => { setSearchTerm(''); setPage(1); fetchData(); }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                    >
                      Tampilkan Semua Produk
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {products.map((product) => {
                    const primaryImage = product.images.find(img => img.order === 0) || product.images[0];
                    const lowestPrice = product.lowestPrice || 0;
                    const slug = generateProductSlug(product.name);

                    return (
                      <Link key={product.id} href={`/browse/${slug}`} className={product.availableStock === 0 ? "pointer-events-none" : ""}>
                        <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full border-0 shadow-lg overflow-hidden bg-white">
                          <CardContent className="p-0">
                            {/* Image Container dengan aspect ratio tetap */}
                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                              {primaryImage ? (
                                <img
                                  src={primaryImage.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Package className="h-16 w-16 text-gray-300" />
                                </div>
                              )}

                              {/* Badges - Fixed positioning */}
                              <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                                <div>
                                  {product.availableStock !== undefined && product.availableStock < 10 && product.availableStock > 0 && (
                                    <Badge className="bg-orange-500 text-white shadow-md text-xs">
                                      Stok {product.availableStock}
                                    </Badge>
                                  )}
                                  {product.availableStock === 0 && (
                                    <Badge className="bg-red-500 text-white shadow-md text-xs">
                                      Habis
                                    </Badge>
                                  )}
                                </div>
                                
                                {product.category && (
                                  <Badge className="bg-blue-500/90 backdrop-blur-sm text-white shadow-md text-xs">
                                    {product.category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Product Info - Fixed height untuk consistency */}
                            <div className="p-4 space-y-2.5">
                              <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 h-10 leading-tight">
                                {product.name}
                              </h3>

                              <p className="font-bold text-lg text-amber-600">
                                {formatPrice(lowestPrice)}
                              </p>

                              <div className="space-y-1 text-xs text-gray-600">
                                <p className="truncate font-medium">{product.storeName || 'Toko'}</p>
                                <p className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{product.storeCity || selectedCity}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-1 pt-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-xs">4.5</span>
                                <span className="text-gray-400 text-xs">(120)</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-4 pt-0">
                            <div
                              className={cn(
                                buttonVariants({ size: "sm" }),
                                "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md h-10 cursor-pointer",
                                product.availableStock === 0 && "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed opacity-70"
                              )}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.availableStock === 0 ? 'Stok Habis' : 'Lihat Detail'}
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl px-10 h-14 text-base rounded-2xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Memuat...
                        </>
                      ) : (
                        <>
                          Muat Lebih Banyak
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Stores Tab */}
        {!loading && activeTab === 'stores' && (
          <>
            {stores.length === 0 ? (
              <div className="max-w-md mx-auto mt-12">
                <Card className="shadow-xl border-0 overflow-hidden">
                  <CardContent className="py-16 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <StoreIcon className="h-12 w-12 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Toko Tidak Ditemukan</h3>
                    <p className="text-gray-600 mb-6 px-4">
                      {searchTerm
                        ? `Tidak ada toko dengan produk "${searchTerm}" di ${selectedCity}`
                        : `Belum ada toko tersedia di ${selectedCity}`}
                    </p>
                    <Button 
                      onClick={() => { setSearchTerm(''); setPage(1); fetchData(); }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                    >
                      Tampilkan Semua Toko
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store) => (
                    <Link key={store.id} href={`/browse/store/${generateStoreSlug(store.name)}`}>
                      <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full border-0 shadow-lg overflow-hidden bg-white">
                        <CardContent className="p-0">
                          <div className="h-40 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <StoreIcon className="h-10 w-10 text-amber-500" />
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>

                          <div className="p-5 space-y-4">
                            <div>
                              <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                                {store.name}
                              </h3>
                              <div className="space-y-2.5 text-sm text-gray-600">
                                <div className="flex items-start gap-2.5">
                                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                                  <div className="flex-1 min-w-0">
                                    <p className="leading-relaxed">{store.address}</p>
                                    <p className="font-medium text-gray-700 mt-1">{store.city}, {store.province}</p>
                                  </div>
                                </div>
                                {store.phone && (
                                  <div className="flex items-center gap-2.5">
                                    <Phone className="h-4 w-4 flex-shrink-0 text-amber-500" />
                                    <p>{store.phone}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-1.5">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-gray-800">4.5</span>
                                <span className="text-gray-500 text-sm">(248)</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-bold text-amber-600">{store.totalProducts || 0}</span>
                                <span className="text-gray-600 ml-1">produk</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-5 pt-0">
                          <div
                            className={cn(
                              buttonVariants({ size: "lg" }),
                              "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md h-12 cursor-pointer"
                            )}
                          >
                            Kunjungi Toko
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl px-10 h-14 text-base rounded-2xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Memuat...
                        </>
                      ) : (
                        <>
                          Muat Lebih Banyak
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}