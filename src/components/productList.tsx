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
  city = "Jakarta", // ← TAMBAH default city
}: ProductListProps) {
  // ... existing state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts(1, limit, city); // ← Pass city

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
  }, [limit, categoryId, city]); // ← Tambah city ke dependency

  // ... rest of component
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
