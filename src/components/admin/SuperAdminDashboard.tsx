"use client";

import StatsCard from "./StatsCard";
import {
  Box,
  ClockAlert,
  Percent,
  ShoppingCart,
  FolderTree,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { useProductStore } from "@/lib/store/productStore";

export default function SuperAdminDashboard() {
  const { categories, fetchCategories, loading } = useCategoryStore();
  const { products, fetchProducts, loading: productsLoading } = useProductStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Dashboard Super Admin</h1>
      <p className="text-gray-600 mb-8">Selamat datang di halaman dashboard!</p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Categories Card */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderTree className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Kelola kategori produk Anda</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">
                  {loading ? "..." : categories.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total kategori aktif
                </p>
              </div>
              <Link href="/products/categories">
                <Button className="gap-2">
                  Kelola Kategori
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Product Management Card */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Kelola produk dan gambar</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">
                  {productsLoading ? "..." : products.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total produk aktif
                </p>
              </div>
              <Link href="/products">
                <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
                  Kelola Produk
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
