'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Search, Filter, Loader2, Package, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Placeholder types - sesuaikan dengan types yang ada
interface Product {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
    storeName: string;
    storeCity: string;
    availableStock: number;
}

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const categoryFilter = searchParams.get('category') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'all');
    const [userCity, setUserCity] = useState<string>('');

    // Get user location (geolocation)
    useEffect(() => {
        // TODO: Implement geolocation to get user city
        // For now, use localStorage or default
        const savedCity = localStorage.getItem('userCity') || 'Jakarta';
        setUserCity(savedCity);
    }, []);

    // Fetch products based on filters
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // TODO: Implement API call to fetch products
                // GET /api/products?city=${userCity}&search=${searchTerm}&category=${selectedCategory}

                // Placeholder data
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProducts([]);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userCity) {
            fetchProducts();
        }
    }, [userCity, searchTerm, selectedCategory]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger search
    };

    // Generate product slug
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    {/* Location Display */}
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                            Menampilkan produk di sekitar: <span className="text-primary">{userCity}</span>
                        </span>
                        <Button variant="link" size="sm" className="text-xs">
                            Ubah Lokasi
                        </Button>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </form>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                <SelectItem value="electronics">Elektronik</SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="food">Makanan & Minuman</SelectItem>
                                <SelectItem value="health">Kesehatan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-6">
                {/* Results Header */}
                {searchTerm && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">
                            Hasil pencarian untuk: &quot;{searchTerm}&quot;
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {products.length} produk ditemukan
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Memuat produk...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Tidak ada produk ditemukan</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm
                                    ? `Tidak ada produk yang cocok dengan pencarian "${searchTerm}"`
                                    : 'Belum ada produk tersedia di area Anda'}
                            </p>
                            <Button variant="outline" onClick={() => setSearchTerm('')}>
                                Reset Pencarian
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/browse/${generateSlug(product.name)}`}
                                className="block"
                            >
                                <Card className="group hover:shadow-lg transition-shadow h-full">
                                    <CardContent className="p-0">
                                        {/* Product Image */}
                                        <div className="aspect-square bg-muted relative overflow-hidden rounded-t-lg">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Package className="h-16 w-16 text-muted-foreground" />
                                                </div>
                                            )}

                                            {/* Stock Badge */}
                                            {product.availableStock < 10 && product.availableStock > 0 && (
                                                <Badge className="absolute top-2 left-2 bg-orange-500">
                                                    Stok {product.availableStock}
                                                </Badge>
                                            )}
                                            {product.availableStock === 0 && (
                                                <Badge className="absolute top-2 left-2 bg-red-500">
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
                                            <h3 className="font-medium text-sm line-clamp-2 min-h-10">
                                                {product.name}
                                            </h3>

                                            {/* Price */}
                                            <p className="font-bold text-primary">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </p>

                                            {/* Store Info */}
                                            <div className="text-xs text-muted-foreground">
                                                <p className="truncate">{product.storeName}</p>
                                                <p>{product.storeCity}</p>
                                            </div>

                                            {/* Rating - Placeholder */}
                                            <div className="flex items-center gap-1 text-xs">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span>4.5</span>
                                                <span className="text-muted-foreground">(120)</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-3 pt-0">
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            disabled={product.availableStock === 0}
                                        >
                                            {product.availableStock === 0 ? 'Habis' : 'Lihat Detail'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}