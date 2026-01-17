import Link from "next/link";
import { Badge, MapPin, Package, ShoppingCart, Star, Loader2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";


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

export default function ProductsTab({
    products,
    loading,
    activeTab,
    searchTerm,
    selectedCity,
    setSearchTerm,
    setPage,
    fetchData,
    hasMore,
    handleLoadMore,
    generateSlug,
    formatPrice,
}: {
    products: Product[];
    loading: boolean;
    activeTab: string;
    searchTerm: string;
    selectedCity: string;
    setSearchTerm: (term: string) => void;
    setPage: (page: number) => void;
    fetchData: () => void;
    hasMore: boolean;
    handleLoadMore: () => void;
    generateSlug: (name: string) => string;
    formatPrice: (price: number) => string;
}) {
    return (
        <>
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
                                    const slug = generateSlug(product.name);

                                    // Debug: Check product data
                                    console.log('Product:', product.name, 'Stock:', product.availableStock);

                                    return (
                                        <Card key={product.id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full border-0 shadow-lg overflow-hidden bg-white">
                                            <Link href={`/browse/${slug}`} className={product.availableStock === 0 ? "pointer-events-none" : ""}>
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
                                                            <div className="flex flex-col gap-1">
                                                                {/* Stock Badges - Using custom span to avoid Badge variant override */}
                                                                {(() => {
                                                                    const stock = product.availableStock ?? 0;

                                                                    if (stock === 0) {
                                                                        return (
                                                                            <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-500 text-white shadow-md w-fit">
                                                                                Habis
                                                                            </span>
                                                                        );
                                                                    } else if (stock < 10) {
                                                                        return (
                                                                            <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white shadow-md w-fit">
                                                                                Sisa {stock}
                                                                            </span>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </div>

                                                            {product.category && (
                                                                <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-500/90 backdrop-blur-sm text-white shadow-md">
                                                                    {product.category.name}
                                                                </span>
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
                                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
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
                                                        {/* <button onClick alert feature to be added */}
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            alert('Feature to be added');
                                                        }}>
                                                            <span className='flex items-center gap-2'>
                                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                                {product.availableStock === 0 ? 'Stok Habis' : 'Add to cart'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </CardFooter>
                                            </Link>
                                        </Card>
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
        </>
    )
}