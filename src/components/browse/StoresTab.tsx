import Link from "next/link";
import { Store as StoreIcon, MapPin, Phone, Star, Loader2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface Store {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    phone?: string;
    totalProducts?: number;
}

export default function StoresTab({
    stores,
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
}: {
    stores: Store[];
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
}) {
    return (
        <>
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
                                    <Link key={store.id} href={`/browse/store/${generateSlug(store.name)}`}>
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
                                                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="leading-relaxed">{store.address}</p>
                                                                    <p className="font-medium text-gray-700 mt-1">{store.city}, {store.province}</p>
                                                                </div>
                                                            </div>
                                                            {store.phone && (
                                                                <div className="flex items-center gap-2.5">
                                                                    <Phone className="h-4 w-4 shrink-0 text-amber-500" />
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
        </>
    );
}