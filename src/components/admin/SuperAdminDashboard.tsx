import StatsCard from "./StatsCard";
import { Box, ClockAlert, Percent, ShoppingCart } from "lucide-react";

export default function SuperAdminDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard Super Admin</h1>
            <p className="text-gray-600">Selamat datang di halaman dashboard!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 border-gray-300 border rounded-lg p-4">
                <StatsCard title="Total Produk" value="1200" trend={{ value: 10, isPositive: true }} icon={ShoppingCart} />
                <StatsCard title="Total Stok" value="10,000" trend={{ value: 10, isPositive: true }} icon={Box} />
                <StatsCard title="Diskon Aktif" value="96" icon={Percent} />
                <StatsCard title="Pending Order" value="184" icon={ClockAlert} />
            </div>
        </div>
    )
}