"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, TrendingUp, TrendingDown, Package, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { getStockJournalMonthlySummary, IStockJournalSummary } from "@/lib/helpers/stockJournal.backend";
import { getStores } from "@/lib/helpers/store.backend";
import api from "@/lib/api/axios";

export default function ReportsPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [stockData, setStockData] = useState<IStockJournalSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string>("");
    const [isStoreAdmin, setIsStoreAdmin] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalItems: 0,
    });

    // Generate month options (last 12 months)
    const generateMonthOptions = () => {
        const months = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const label = date.toLocaleDateString("id-ID", { year: "numeric", month: "long" });
            months.push({ value, label });
        }
        return months;
    };

    const monthOptions = generateMonthOptions();

    useEffect(() => {
        fetchUserInfo();
        fetchStores();
        // Set default month to current month
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        setSelectedMonth(currentMonth);
    }, []);

    const fetchUserInfo = async () => {
        try {
            const res = await api.get("/auth/dashboard");
            const userData = res.data.user;
            setUserRole(userData.role);

            if (userData.role === "STORE_ADMIN" && userData.assignedStoreId) {
                setIsStoreAdmin(true);
                setSelectedStoreId(userData.assignedStoreId);
            }
        } catch (error) {
            console.error("Failed to fetch user info", error);
        }
    };

    const fetchStores = async () => {
        try {
            const res = await getStores();
            if (res.success && res.data) {
                setStores(res.data);
                // Auto-select first store if only one available
                if (res.data.length === 1) {
                    setSelectedStoreId(res.data[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch stores", error);
        }
    };

    const fetchStockReport = async (page: number = 1) => {
        if (!selectedStoreId || !selectedMonth) {
            toast.error("Please select store and month");
            return;
        }

        setLoading(true);
        try {
            // Calculate start and end date for the selected month
            const [year, month] = selectedMonth.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

            const res = await getStockJournalMonthlySummary(
                selectedStoreId,
                startDate.toISOString(),
                endDate.toISOString(),
                page,
                20
            );

            if (res.success && res.data) {
                setStockData(res.data);
                if (res.pagination) {
                    setPagination({
                        page: res.pagination.page,
                        totalPages: res.pagination.totalPages,
                        totalItems: res.pagination.total,
                    });
                }
            } else {
                toast.error(res.message || "Failed to fetch stock report");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading stock report");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        fetchStockReport(1);
    };

    const calculateTotals = () => {
        return stockData.reduce(
            (acc, item) => ({
                totalIn: acc.totalIn + item.totalIn,
                totalOut: acc.totalOut + item.totalOut,
            }),
            { totalIn: 0, totalOut: 0 }
        );
    };

    const totals = calculateTotals();

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight ">
                            Stock Report
                        </h1>
                        <p className="text-sm ">
                            Laporan ringkasan stok bulanan per produk
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Laporan</CardTitle>
                        <CardDescription>Pilih toko dan bulan untuk melihat laporan stok</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Store Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Toko</label>
                                <Select
                                    value={selectedStoreId}
                                    onValueChange={setSelectedStoreId}
                                    disabled={isStoreAdmin}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih toko..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stores.map((store) => (
                                            <SelectItem key={store.id} value={store.id}>
                                                {store.name} - {store.city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Month Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bulan</label>
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih bulan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthOptions.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Generate Button */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium opacity-0">Action</label>
                                <Button
                                    onClick={handleGenerateReport}
                                    disabled={loading || !selectedStoreId || !selectedMonth}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Generate Report
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                {stockData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Produk</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">
                                            {pagination.totalItems}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-slate-100 rounded-full">
                                        <Package className="h-5 w-5 text-slate-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Stock IN</p>
                                        <p className="text-2xl font-bold text-green-600 mt-1">
                                            +{totals.totalIn.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-full">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Stock OUT</p>
                                        <p className="text-2xl font-bold text-red-600 mt-1">
                                            -{totals.totalOut.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-full">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Report Table */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white/50">
                        <div className="flex items-center justify-between">
                            <CardTitle>Laporan Stok Bulanan</CardTitle>
                            {stockData.length > 0 && (
                                <Button variant="outline" size="sm" disabled>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Excel
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Produk</TableHead>
                                    <TableHead className="text-right">Stok Awal</TableHead>
                                    <TableHead className="text-right">Stock IN</TableHead>
                                    <TableHead className="text-right">Stock OUT</TableHead>
                                    <TableHead className="text-right">Stok Akhir</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                                Loading report...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : stockData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                            Pilih toko dan bulan, lalu klik "Generate Report" untuk melihat data.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stockData.map((item) => {
                                        const stockChange = item.stockEnd - item.stockStart;
                                        const isIncrease = stockChange > 0;
                                        const isDecrease = stockChange < 0;

                                        return (
                                            <TableRow key={item.productVariantId} className="hover:bg-slate-50/50">
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{item.productName}</p>
                                                        <p className="text-xs text-slate-500">{item.variantName}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {item.stockStart.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-green-600">
                                                    +{item.totalIn.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-red-600">
                                                    -{item.totalOut.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right font-mono font-bold">
                                                    {item.stockEnd.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {isIncrease && (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                            <TrendingUp className="h-3 w-3 mr-1" />
                                                            +{stockChange}
                                                        </Badge>
                                                    )}
                                                    {isDecrease && (
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                                            <TrendingDown className="h-3 w-3 mr-1" />
                                                            {stockChange}
                                                        </Badge>
                                                    )}
                                                    {!isIncrease && !isDecrease && (
                                                        <Badge variant="secondary">Stabil</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {stockData.length > 0 && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                                <p className="text-sm text-slate-500">
                                    Showing {stockData.length} of {pagination.totalItems} products
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchStockReport(pagination.page - 1)}
                                        disabled={pagination.page === 1 || loading}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchStockReport(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages || loading}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
