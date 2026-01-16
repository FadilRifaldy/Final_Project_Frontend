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
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-20 z-10">
        <div className="container mx-auto px-4 py-6">
          {/* City Selector */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-amber-600" />
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger className="w-[200px] border-amber-500 focus:ring-amber-500">
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

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari produk atau toko..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-24 h-14 text-base rounded-2xl border-2 border-gray-200 focus:border-amber-500 shadow-sm"
              />
              <Button 
                onClick={handleSearch} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl h-10"
              >
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => {
              setActiveTab(v as 'products' | 'stores');
              setPage(1);
            }}
            className="max-w-md mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="products" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Package className="h-4 w-4" />
                <span className="font-medium">Produk</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stores" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <StoreIcon className="h-4 w-4" />
                <span className="font-medium">Toko</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        {!loading && totalItems > 0 && (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm.trim() 
                ? `Hasil untuk "${searchTerm}"` 
                : `Semua ${activeTab === 'products' ? 'Produk' : 'Toko'}`
              } di {selectedCity}
            </h2>
            <p className="text-gray-600">
              Ditemukan <span className="font-semibold text-amber-600">{totalItems}</span> hasil
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && page === 1 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-amber-500 mb-4" />
            <p className="text-gray-600 text-lg">Mencari {activeTab === 'products' ? 'produk' : 'toko'}...</p>
          </div>
        )}

        {/* Products Tab */}
        {!loading && activeTab === 'products' && (
          <>
            {products.length === 0 ? (
              <Card className="max-w-md mx-auto shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Produk Tidak Ditemukan</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? `Tidak ada produk "${searchTerm}" di ${selectedCity}`
                      : `Belum ada produk tersedia di ${selectedCity}`}
                  </p>
                  <Button 
                    onClick={() => { setSearchTerm(''); setPage(1); fetchData(); }}
                    variant="outline"
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Tampilkan Semua Produk
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                  {products.map((product) => {
                    const primaryImage = product.images.find(img => img.order === 0) || product.images[0];
                    const lowestPrice = product.lowestPrice || 0;
                    const slug = product.variants[0]?.slug || generateProductSlug(product.name);

                    return (
                      <Link key={product.id} href={`/browse/${slug}`}>
                        <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full border-0 shadow-md overflow-hidden">
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                              {primaryImage ? (
                                <img
                                  src={primaryImage.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Package className="h-16 w-16 text-gray-300" />
                                </div>
                              )}

                              {/* Badges */}
                              <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                                {product.availableStock !== undefined && product.availableStock < 10 && product.availableStock > 0 && (
                                  <Badge className="bg-orange-500 text-white shadow-md">
                                    Stok {product.availableStock}
                                  </Badge>
                                )}
                                {product.availableStock === 0 && (
                                  <Badge className="bg-red-500 text-white shadow-md">
                                    Habis
                                  </Badge>
                                )}
                                {product.availableStock && product.availableStock >= 10 && <div></div>}
                                
                                {product.category && (
                                  <Badge className="bg-blue-500 text-white shadow-md">
                                    {product.category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="p-3 space-y-2">
                              <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 min-h-10 leading-tight">
                                {product.name}
                              </h3>

                              <p className="font-bold text-lg text-amber-600">
                                {formatPrice(lowestPrice)}
                              </p>

                              <div className="text-xs text-gray-600 space-y-0.5">
                                <p className="truncate font-medium">{product.storeName || 'Toko'}</p>
                                <p className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {product.storeCity || selectedCity}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 text-xs pt-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="font-semibold">4.5</span>
                                <span className="text-gray-400">(120)</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-3 pt-0">
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                              disabled={product.availableStock === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.availableStock === 0 ? 'Stok Habis' : 'Lihat Detail'}
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg px-8"
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
              <Card className="max-w-md mx-auto shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <StoreIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Toko Tidak Ditemukan</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? `Tidak ada toko dengan produk "${searchTerm}" di ${selectedCity}`
                      : `Belum ada toko tersedia di ${selectedCity}`}
                  </p>
                  <Button 
                    onClick={() => { setSearchTerm(''); setPage(1); fetchData(); }}
                    variant="outline"
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Tampilkan Semua Toko
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store) => (
                    <Link key={store.id} href={`/store/${generateStoreSlug(store.name)}`}>
                      <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full border-0 shadow-md overflow-hidden">
                        <CardContent className="p-0">
                          <div className="h-48 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <StoreIcon className="h-10 w-10 text-amber-500" />
                              </div>
                            </div>
                          </div>

                          <div className="p-5 space-y-4">
                            <div>
                              <h3 className="font-bold text-xl text-gray-800 mb-2">{store.name}</h3>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                                  <div>
                                    <p className="leading-relaxed">{store.address}</p>
                                    <p className="font-medium text-gray-700">{store.city}, {store.province}</p>
                                  </div>
                                </div>
                                {store.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-amber-500" />
                                    <p>{store.phone}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-gray-800">4.5</span>
                                <span className="text-gray-500 text-sm">(248)</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold text-amber-600">{store.totalProducts || 0}</span> produk
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-5 pt-0">
                          <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                          >
                            Kunjungi Toko
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg px-8"
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