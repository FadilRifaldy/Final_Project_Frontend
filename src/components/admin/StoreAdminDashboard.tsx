import StatsCard from "./StatsCard";
import {
    Box,
    ClockAlert,
    Percent,
    ShoppingCart,
    Package,
    ArrowRight,
    FileText
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
import { getInventoryByStore } from "@/lib/helpers/inventory.backend";
import { getAllDiscounts } from "@/lib/helpers/discounts.backend";
import api from "@/lib/api/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { Discount } from "@/types/discount";

// Interface untuk response inventory
interface InventoryItem {
    id: string;
    storeId: string;
    productVariantId: string;
    quantity: number;
    reserved: number;
    productVariant?: {
        id: string;
        name: string;
        sku: string;
        price: number;
    };
}

interface InventoryResponse {
    data: InventoryItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface DiscountsResponse {
    data: Discount[];
}


export default function StoreAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [assignedStoreId, setAssignedStoreId] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStock: 0,
        activeDiscounts: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Get user's assigned store
                const userRes = await api.get('/auth/dashboard');
                const storeId = userRes.data.user.assignedStoreId;

                if (!storeId) {
                    toast.error("Anda belum di-assign ke toko manapun");
                    setLoading(false);
                    return;
                }

                setAssignedStoreId(storeId);

                // 2. Fetch all data in parallel
                const [inventoryRes, discountsRes] = await Promise.all([
                    getInventoryByStore(storeId, 1, 1000) as Promise<InventoryResponse>, // Get all inventory
                    getAllDiscounts() as Promise<DiscountsResponse>,
                ]);

                // 3. Calculate stats
                const totalProducts = inventoryRes.pagination?.total || 0;
                const totalStock = inventoryRes.data?.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ) || 0;

                const activeDiscounts = discountsRes.data?.filter(
                    (d) => d.isActive && (d.storeId === storeId || d.storeId === null)
                ).length || 0;

                setStats({
                    totalProducts,
                    totalStock,
                    activeDiscounts,
                    pendingOrders: 0, // Placeholder
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast.error("Gagal memuat data dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard Store Admin</h1>
                <p className="text-muted-foreground">Overview statistik dan manajemen toko Anda.</p>
            </div>

            {/* Stats Overview */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Produk"
                        value={stats.totalProducts.toString()}
                        icon={ShoppingCart}
                    />
                    <StatsCard
                        title="Total Stok"
                        value={stats.totalStock.toLocaleString('id-ID')}
                        icon={Box}
                    />
                    <StatsCard
                        title="Diskon Aktif"
                        value={stats.activeDiscounts.toString()}
                        icon={Percent}
                    />
                    <StatsCard
                        title="Pending Order"
                        value="-"
                        icon={ClockAlert}
                    />
                </div>
            )}

            {!loading && !assignedStoreId && (
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                        Anda belum di-assign ke toko manapun. Hubungi Super Admin untuk assignment.
                    </p>
                </div>
            )}

            {/* Quick Actions Panel */}
            {!loading && assignedStoreId && (
                <>
                    <h2 className="text-xl font-semibold">Quick Actions</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Inventory Management Card */}
                        <Card className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Package className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <CardTitle>Inventory Management</CardTitle>
                                        <CardDescription>Kelola stok produk di toko Anda</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Link href="/admin/inventory">
                                    <Button className="w-full justify-between group">
                                        Kelola Inventory
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Discount Management Card */}
                        <Card className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                                        <Percent className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Discount Management</CardTitle>
                                        <CardDescription>Atur diskon dan promo untuk toko</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Link href="/admin/discounts">
                                    <Button variant="outline" className="w-full justify-between group border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 text-emerald-600">
                                        Kelola Diskon
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Orders Card */}
                        <Card className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <FileText className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Orders</CardTitle>
                                        <CardDescription>Lihat dan proses pesanan masuk</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Link href="/admin/orders">
                                    <Button variant="outline" className="w-full justify-between group border-amber-200 hover:bg-amber-50 hover:text-amber-600 text-amber-600">
                                        Lihat Pesanan
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Stock Journal Card */}
                        <Card className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl">
                                        <Box className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Stock Journal</CardTitle>
                                        <CardDescription>Riwayat perubahan stok produk</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Link href="/admin/stock-journal">
                                    <Button variant="outline" className="w-full justify-between group border-purple-200 hover:bg-purple-50 hover:text-purple-600 text-purple-600">
                                        Lihat Riwayat
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>

    )
}