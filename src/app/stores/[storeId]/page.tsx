"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Star,
  Package,
  Clock,
  CheckCircle2,
  MessageCircle,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getStoreById, getStoreProducts } from "@/lib/helpers/store.backend";
import { IStore, IStoreProduct } from "@/types/store";

export default function StorePublicPage() {
  const params = useParams();
  const storeId = params?.storeId as string;

  const [store, setStore] = useState<IStore | null>(null);
  const [products, setProducts] = useState<IStoreProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("beranda");

  // Hardcoded untuk tampilan
  const STORE_RATING = 4.9;
  const STORE_REVIEWS = 1578;

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      const [storeRes, productsRes] = await Promise.all([
        getStoreById(storeId),
        getStoreProducts(storeId, 1, 20),
      ]);

      if (storeRes.success && storeRes.data) {
        setStore(storeRes.data);
        setTotalProducts(productsRes.pagination?.total || 0);
        setTotalSold(2840); // Hardcoded untuk demo
      } else {
        toast.error(storeRes.message || "Gagal memuat data toko");
      }

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      } else {
        toast.error(productsRes.message || "Gagal memuat produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}rb`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Memuat toko...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Toko Tidak Ditemukan
          </h2>
          <p className="text-slate-600">Toko yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Store Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Store Avatar */}
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl font-bold">
                {store.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Store Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                  {store.name}
                </h1>
                {store.isActive && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{store.city}, {store.province}</span>
                </div>
                {store.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{store.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
            {/* Rating - Hardcoded */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold">{STORE_RATING}</span>
              </div>
              <p className="text-xs text-slate-500">
                ({formatNumber(STORE_REVIEWS)} ulasan)
              </p>
            </div>

            <div className="text-center border-l">
              <p className="text-lg font-bold text-slate-900">
                {formatNumber(totalProducts)}
              </p>
              <p className="text-xs text-slate-500">Produk</p>
            </div>

            <div className="text-center border-l">
              <p className="text-lg font-bold text-slate-900">
                {formatNumber(totalSold)}
              </p>
              <p className="text-xs text-slate-500">Terjual</p>
            </div>

            <div className="text-center border-l">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">±1 jam</span>
              </div>
              <p className="text-xs text-slate-500">Pesanan diproses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="sm:hidden bg-white border-b px-4 py-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          Follow
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="beranda">Beranda</TabsTrigger>
            <TabsTrigger value="produk">Produk</TabsTrigger>
          </TabsList>

          {/* Tab: Beranda */}
          <TabsContent value="beranda" className="space-y-6">
            {/* Store Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Toko</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Alamat</p>
                    <p className="text-sm text-slate-600">
                      {store.address}, {store.city}, {store.province} {store.postalCode}
                    </p>
                  </div>
                </div>

                {store.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Nomor Telepon</p>
                      <p className="text-sm text-slate-600">{store.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Radius Layanan</p>
                    <p className="text-sm text-slate-600">
                      Maksimal {store.maxServiceRadius} KM dari toko
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Produk Tersedia
                </h2>
                {products.length > 10 && (
                  <Button
                    variant="link"
                    className="text-primary"
                    onClick={() => setActiveTab("produk")}
                  >
                    Lihat Semua
                  </Button>
                )}
              </div>

              {products.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">Belum ada produk tersedia</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.slice(0, 10).map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      formatPrice={formatPrice} 
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Produk */}
          <TabsContent value="produk">
            {products.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Belum ada produk tersedia</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    formatPrice={formatPrice} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  formatPrice 
}: { 
  product: IStoreProduct; 
  formatPrice: (price: number) => string;
}) {
  // Generate rating berdasarkan product ID (deterministic, not random)
  const getProductRating = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = 4.5 + (hash % 6) / 10; // 4.5 - 5.0
    return rating.toFixed(1);
  };
  
  const productRating = getProductRating(product.id);

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="aspect-square bg-slate-100 relative overflow-hidden rounded-t-lg">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-16 w-16 text-slate-300" />
            </div>
          )}
          
          {/* Badge Stock */}
          {product.availableStock < 10 && product.availableStock > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              Stok {product.availableStock}
            </Badge>
          )}
          {product.availableStock === 0 && (
            <Badge className="absolute top-2 left-2 bg-slate-500">
              Habis
            </Badge>
          )}

          {/* Category Badge */}
          <Badge className="absolute top-2 right-2 bg-blue-500">
            {product.category}
          </Badge>
        </div>

        <div className="p-3 space-y-2">
          {/* Product Name */}
          <h3 className="font-medium text-sm text-slate-900 line-clamp-2 min-h-[2.5rem]">
            {product.fullName}
          </h3>

          {/* Price */}
          <p className="font-bold text-slate-900">
            {formatPrice(product.price)}
          </p>

          {/* Stats - dengan rating hardcoded */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{productRating}</span>
            </div>
            <span>{product.sold} terjual</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button 
          size="sm" 
          className="w-full"
          disabled={product.availableStock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.availableStock === 0 ? "Habis" : "Keranjang"}
        </Button>
      </CardFooter>
    </Card>
  );
}