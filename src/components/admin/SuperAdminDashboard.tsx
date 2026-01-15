"use client";

import StatsCard from "./StatsCard";
import {
  Box,
  ClockAlert,
  Percent,
  ShoppingCart,
  FolderTree,
  ArrowRight,
  Store,
  Users,
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
import { getStores } from "@/lib/helpers/store.backend";
import { getStoreAdmins } from "@/lib/helpers/assign-store-admin.backend";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { useProductStore } from "@/lib/store/productStore";

export default function SuperAdminDashboard() {
  const { categories, fetchCategories, loading: catLoading } = useCategoryStore();
  const { products, fetchProducts, loading: prodLoading } = useProductStore();
  const [storesCount, setStoresCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      fetchCategories();
      fetchProducts();

      try {
        const [storesRes, adminsRes] = await Promise.all([
          getStores(),
          getStoreAdmins()
        ]);

        if (storesRes.success && storesRes.data) {
          setStoresCount(storesRes.data.length);
        }

        if (adminsRes.success && adminsRes.data) {
          setAdminsCount(adminsRes.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchCategories, fetchProducts]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard Super Admin</h1>
        <p className="text-muted-foreground">Overview statistik dan manajemen toko Anda.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Stores"
          value={loading ? "..." : storesCount.toString()}
          icon={Store}
        />
        <StatsCard
          title="Total Admins"
          value={loading ? "..." : adminsCount.toString()}
          icon={Users}
        />
        <StatsCard
          title="Categories"
          value={catLoading ? "..." : categories.length.toString()}
          icon={FolderTree}
        />
        <StatsCard
          title="Products"
          value={prodLoading ? "..." : products.length.toString()}
          icon={ShoppingCart}
        />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h2>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Categories Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FolderTree className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Atur kategori produk untuk toko Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products/categories">
              <Button className="w-full justify-between group">
                Kelola Kategori
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Product Management Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Tambah, edit, dan atur stok produk</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-between group border-blue-200 hover:bg-blue-50 hover:text-blue-600 text-blue-600">
                Kelola Produk
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Store Management Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Store className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Store Management</CardTitle>
                <CardDescription>Kelola cabang toko dan lokasi</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/stores">
              <Button variant="outline" className="w-full justify-between group border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 text-emerald-600">
                Lihat Daftar Toko
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Store Admin List */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Store Admins</CardTitle>
                <CardDescription>Daftar pegawai dan penugasan toko</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/stores/admin-list">
              <Button variant="outline" className="w-full justify-between group border-purple-200 hover:bg-purple-50 hover:text-purple-600 text-purple-600">
                Kelola Admin
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
