import StatsCard from "./StatsCard";
import { Box, ClockAlert, Percent, ShoppingCart } from "lucide-react";
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
        <div className="p-4 md:p-8">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 border-gray-300 border rounded-lg p-4">
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
        </div>

    )
}