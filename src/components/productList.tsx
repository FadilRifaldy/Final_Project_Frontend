"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./productCard";
import { IProduct } from "@/types/product";
import getProducts from "@/lib/helpers/product.backend";
import { Skeleton } from "./ui/skeleton";

interface ProductListProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  categoryId?: string;
}

export function ProductList({
  title = "Fresh Products",
  subtitle = "Discover our selection of fresh groceries",
  limit = 8,
  categoryId,
}: ProductListProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts(1, limit);

        // Filter by category if provided
        let filteredProducts = response.data;
        if (categoryId) {
          filteredProducts = response.data.filter(
            (p) => p.categoryId === categoryId
          );
        }

        setProducts(filteredProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, categoryId]);

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center p-8 bg-destructive/10 rounded-lg">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(limit)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Tidak ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Loading skeleton for product card
function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
