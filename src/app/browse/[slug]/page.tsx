"use client";

import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { useProductDetail } from "@/hooks/useProductDetail";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { VariantSelector } from "@/components/products/VariantSelector";
import { ProductBreadcrumb } from "@/components/products/ProductBreadcrumb";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { StoreAvailabilityCard } from "@/components/products/StoreAvailabilityCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    // Gunakan custom hook untuk semua business logic
    const {
        product,
        variants,
        selectedVariant,
        selectedVariantId,
        quantity,
        loading,
        error,
        handleQuantityChange,
        handleAddToCart,
        handleVariantChange,
        setQuantity,
        setSelectedVariantId,
        storeInventories,
        selectedStoreId,
        setSelectedStoreId,
    } = useProductDetail(slug);

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

                        {/* Store Availability Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">
                                    Tersedia di {storeInventories.length} Toko
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Pilih toko untuk melihat ketersediaan dan melakukan pembelian
                                </p>
                            </div>

                            {storeInventories.length === 0 ? (
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <p className="text-muted-foreground">
                                            Produk ini belum tersedia di toko manapun
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {storeInventories.map((inventory) => (
                                        <StoreAvailabilityCard
                                            key={inventory.id}
                                            inventory={inventory}
                                            variant={selectedVariant!}
                                            isSelected={selectedStoreId === inventory.storeId}
                                            onSelect={() => setSelectedStoreId(inventory.storeId)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quantity & Add to Cart - Only show if store selected */}
                        {selectedStoreId && selectedVariant && (
                            <div className="space-y-4 border-t pt-4">
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
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Tambah ke Keranjang
                                </Button>
                            </div>
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

