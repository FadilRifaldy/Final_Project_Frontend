"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";

import getProducts, { getProductById, getVariantsByProductId } from "@/lib/helpers/product.backend";
import { checkStockAvailability } from "@/lib/helpers/inventory.backend";
import { IProduct, IProductVariant } from "@/types/product";
import { IStockCheckResponse } from "@/types/inventory";

import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { VariantSelector } from "@/components/products/VariantSelector";
import { StockBadge } from "@/components/products/StockBadge";
import { StoreInfo } from "@/components/products/StoreInfo";
import { ProductBreadcrumb } from "@/components/products/ProductBreadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<IProduct | null>(null);
    const [variants, setVariants] = useState<IProductVariant[]>([]);
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");
    const [stockInfo, setStockInfo] = useState<IStockCheckResponse | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get store ID from localStorage (assumed to be set from homepage)
    const [storeId, setStoreId] = useState<string>("");

    useEffect(() => {
        // Get store ID from localStorage
        const savedStoreId = localStorage.getItem("selectedStoreId");
        if (savedStoreId) {
            setStoreId(savedStoreId);
        } else {
            // If no store selected, redirect to homepage
            // For now, we'll just show an error
            setError("Silakan pilih toko terlebih dahulu");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!slug || !storeId) return;

        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Extract product slug from URL
                // Slug format: "iphone-17-pro"
                // We need to find product by matching slug generated from product name

                // WORKAROUND: Since backend doesn't have slug field on Product,
                // we'll fetch all products and find the one that matches the slug
                // TODO: Add slug field to Product model in backend for better performance

                const generateSlug = (name: string) => {
                    return name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "");
                };

                // Fetch products and find matching slug
                const productsResponse = await getProducts(1, 100); // Fetch more products
                const matchedProduct = productsResponse.data.find(
                    (p: IProduct) => generateSlug(p.name) === slug
                );

                if (!matchedProduct) {
                    throw new Error("Product not found");
                }

                const productId = matchedProduct.id;

                // Fetch full product details with variants
                const productData = await getProductById(productId);
                setProduct(productData);

                // Fetch variants
                const variantsData = await getVariantsByProductId(productId);
                setVariants(variantsData);

                // Select first variant by default
                if (variantsData.length > 0) {
                    setSelectedVariantId(variantsData[0].id);
                }
            } catch (err: any) {
                console.error("Error fetching product:", err);
                setError(err.message || "Gagal memuat produk");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [slug, storeId]);

    // Fetch stock info when variant changes
    useEffect(() => {
        if (!selectedVariantId || !storeId) return;

        const fetchStockInfo = async () => {
            try {
                const stock = await checkStockAvailability(
                    storeId,
                    selectedVariantId,
                    quantity
                );
                setStockInfo(stock);
            } catch (err: any) {
                console.error("Error checking stock:", err);
                // Set stock as unavailable if error
                setStockInfo({
                    available: false,
                    reason: "Gagal mengecek stok",
                    inventory: null,
                });
            }
        };

        fetchStockInfo();
    }, [selectedVariantId, storeId, quantity]);

    const selectedVariant = variants.find((v) => v.id === selectedVariantId);

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        // For now, just show alert
        alert("Feature to be added");
    };

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h2>
                    <p className="text-muted-foreground mb-4">
                        {error || "Produk yang Anda cari tidak tersedia"}
                    </p>
                    <Button onClick={() => router.push("/")}>Kembali ke Beranda</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <ProductBreadcrumb
                items={[
                    ...(product.category
                        ? [
                            {
                                label: product.category.name,
                                href: `/browse?category=${product.category.slug}`,
                            },
                        ]
                        : []),
                    { label: product.name },
                ]}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image Gallery */}
                    <div>
                        <ProductImageGallery
                            images={product.images || []}
                            productName={product.name}
                        />
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        {product.category && (
                            <Badge variant="secondary">{product.category.name}</Badge>
                        )}

                        {/* Product Name */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            {selectedVariant && (
                                <p className="text-2xl font-bold text-primary">
                                    Rp {Number(selectedVariant.price).toLocaleString("id-ID")}
                                </p>
                            )}
                        </div>

                        {/* Variant Selector */}
                        {variants.length > 0 && (
                            <VariantSelector
                                variants={variants}
                                selectedVariantId={selectedVariantId}
                                onVariantChange={setSelectedVariantId}
                                productImages={product.images}
                            />
                        )}

                        {/* Stock Info */}
                        {stockInfo && stockInfo.inventory && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">Ketersediaan:</span>
                                <StockBadge
                                    quantity={stockInfo.inventory.quantity}
                                    reserved={stockInfo.inventory.reserved}
                                />
                            </div>
                        )}

                        {/* Store Info */}
                        {stockInfo?.inventory?.store && (
                            <StoreInfo
                                storeName={stockInfo.inventory.store.name}
                                city={stockInfo.inventory.store.name.split(" ")[1] || ""}
                            />
                        )}

                        {/* Quantity Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jumlah</label>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="w-16 text-center">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            if (val >= 1 && val <= 99) setQuantity(val);
                                        }}
                                        className="w-full text-center border rounded px-2 py-1"
                                        min="1"
                                        max="99"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= 99}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!stockInfo?.available}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            {stockInfo?.available
                                ? "Tambah ke Keranjang"
                                : "Stok Tidak Tersedia"}
                        </Button>

                        {!stockInfo?.available && stockInfo?.reason && (
                            <p className="text-sm text-destructive text-center">
                                {stockInfo.reason}
                            </p>
                        )}
                    </div>
                </div>

                {/* Product Description */}
                {product.description && (
                    <Card className="mt-8 p-6">
                        <h2 className="text-xl font-bold mb-4">Deskripsi Produk</h2>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

// Loading Skeleton Component
function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-3">
                    <Skeleton className="h-5 w-64" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="w-full aspect-square rounded-lg" />
                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-md" />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
