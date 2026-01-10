'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, AlertTriangle, XCircle, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import StoreSelector from '@/components/inventory/StoreSelector';
import InventoryTable from '@/components/inventory/InventoryTable';
import { StatBadge } from '@/components/inventory/StatBadge';
import { AdvancedFiltersPopover } from '@/components/inventory/AdvancedFiltersPopover';
import { ErrorCard } from '@/components/inventory/ErrorCard';
import { useProgressBar } from '@/hooks/useProgressBar';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface InventoryItem {
    productVariantId: string;
    storeId: string;
    quantity: number;
    reserved: number;
    available: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        price: number;
        product: {
            name: string;
            category: {
                name: string;
            };
        };
    };
}

interface Category {
    id: string;
    name: string;
}

interface FilterState {
    search: string;
    categoryId: string;
    stockStatus: string;
    sortBy: string;
}

export default function InventoryPage() {
    const [role, setRole] = useState<string>('');
    const [assignedStoreId, setAssignedStoreId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [storeDetails, setStoreDetails] = useState<{ adminName: string } | null>(null);
    const [inventories, setInventories] = useState<InventoryItem[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categoryId: 'all',
        stockStatus: 'all',
        sortBy: 'name-asc'
    });
    const router = useRouter();

    // Progress bar using custom hook
    const progress = useProgressBar(loading);

    // fetch role and assigned store
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await api.get('/auth/dashboard');
                const userData = response.data.user;
                setRole(userData.role);

                // For STORE_ADMIN, get assigned store
                if (userData.role === 'STORE_ADMIN') {
                    setAssignedStoreId(userData.assignedStoreId || null);
                }
            } catch (error) {
                console.error('Error fetching role:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchRole();
    }, [router]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/categories');
                setCategories(response.data.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch store details when store is selected
    useEffect(() => {
        const fetchStoreDetails = async () => {
            if (!selectedStoreId) {
                setStoreDetails(null);
                return;
            }

            try {
                const response = await api.get(`/stores/${selectedStoreId}`);
                const store = response.data.data;

                // Get admin name from STORE_ADMIN user assigned to this store
                const adminName = store.admin?.name || 'No admin assigned';
                setStoreDetails({ adminName });
            } catch (error) {
                console.error('Error fetching store details:', error);
                setStoreDetails(null);
            }
        };

        fetchStoreDetails();
    }, [selectedStoreId]);

    // Redirect CUSTOMER
    useEffect(() => {
        if (role === 'CUSTOMER') {
            router.push('/');
        }
    }, [role, router]);

    // Fetch inventory when store or filters change
    useEffect(() => {
        if (selectedStoreId) {
            fetchInventory();
        }
    }, [selectedStoreId, filters]);

    // Calculate stats
    const inStockCount = inventories.filter(i => i.available > 10).length;
    const lowStockCount = inventories.filter(i => i.available > 0 && i.available <= 10).length;
    const outOfStockCount = inventories.filter(i => i.available === 0).length;

    // Calculate active filter count
    const activeFilterCount = [
        filters.categoryId !== 'all',
        filters.sortBy !== 'name-asc'
    ].filter(Boolean).length;

    const fetchInventory = async () => {
        if (!selectedStoreId) return;

        setInventoryLoading(true);
        try {
            // Use new endpoint that shows ALL variants (including stock 0)
            const response = await api.get(
                `/api/inventory/store/${selectedStoreId}/all-variants`,
                {
                    params: {
                        page: 1,
                        limit: 100,
                        search: filters.search || undefined,
                        categoryId: filters.categoryId !== 'all' ? filters.categoryId : undefined,
                        stockStatus: filters.stockStatus !== 'all' ? filters.stockStatus : undefined,
                        sortBy: filters.sortBy || undefined
                    }
                }
            );

            setInventories(response.data.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setInventoryLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen progress={progress} message="Loading inventory..." />;
    }

    // Check if STORE_ADMIN has assigned store
    if (role === 'STORE_ADMIN' && !assignedStoreId) {
        return (
            <ErrorCard
                title="No Store Assigned"
                description="You haven't been assigned to any store yet. Please contact your Super Admin to assign you to a store before you can access inventory management."
                buttonText="Go to Dashboard"
                buttonPath="/dashboard"
                variant="warning"
            />
        );
    }

    // Check authorization
    if (role !== 'SUPER_ADMIN' && role !== 'STORE_ADMIN') {
        return (
            <ErrorCard
                title="Unauthorized Access"
                description="You don't have permission to access this page."
                buttonText="Go to Homepage"
                buttonPath="/"
                variant="error"
            />
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="border-b bg-background px-6 py-3">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <div className="flex items-center justify-between">
                    {/* Left: Store selector */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">

                            <span>Store details:</span>
                        </div>
                        <StoreSelector
                            selectedStoreId={selectedStoreId}
                            onStoreChange={setSelectedStoreId}
                            userRole={role}
                            compact={true}
                        />

                        {/* Store Admin Info */}
                        {storeDetails && (
                            <>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Admin:</span>
                                    <span>{storeDetails.adminName}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: Stats + Actions */}
                    {selectedStoreId && (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-4 text-sm">
                                <StatBadge color="green" label="In Stock" value={inStockCount} />
                                <StatBadge color="amber" label="Low" value={lowStockCount} />
                                <StatBadge color="red" label="Out" value={outOfStockCount} />
                            </div>

                            <Separator orientation="vertical" className="h-6 hidden md:block" />

                            <Button variant="ghost" size="sm" onClick={fetchInventory} disabled={inventoryLoading}>
                                <RefreshCw className={cn("h-4 w-4", inventoryLoading && "animate-spin")} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Unified Filter Bar - Phase 2 */}
            {selectedStoreId && (
                <div className="shrink-0 border-b bg-muted/30 px-6 py-3">
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products, SKU..."
                                className="pl-9 h-9"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        {/* Quick filters */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden sm:inline">Quick:</span>
                            <Button
                                variant={filters.stockStatus === 'all' ? 'default' : 'outline'}
                                size="sm"
                                className="h-9"
                                onClick={() => setFilters({ ...filters, stockStatus: 'all' })}
                            >
                                All
                            </Button>
                            <Button
                                variant={filters.stockStatus === 'low-stock' ? 'default' : 'outline'}
                                size="sm"
                                className="h-9"
                                onClick={() => setFilters({ ...filters, stockStatus: 'low-stock' })}
                            >
                                <AlertTriangle className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">Low</span>
                            </Button>
                            <Button
                                variant={filters.stockStatus === 'out-of-stock' ? 'default' : 'outline'}
                                size="sm"
                                className="h-9"
                                onClick={() => setFilters({ ...filters, stockStatus: 'out-of-stock' })}
                            >
                                <XCircle className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">Out</span>
                            </Button>
                        </div>

                        {/* Advanced filters */}
                        <AdvancedFiltersPopover
                            filters={filters}
                            categories={categories}
                            onFilterChange={setFilters}
                            activeCount={activeFilterCount}
                        />
                    </div>
                </div>
            )}

            {/* Table - Immediate visibility */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-6 px-4">
                    {selectedStoreId && (
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>Inventory List</CardTitle>
                                <CardDescription>
                                    View stock levels and update inventory
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <InventoryTable
                                    storeId={selectedStoreId}
                                    inventories={inventories}
                                    loading={inventoryLoading}
                                    onRefresh={fetchInventory}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
