'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import StoreSelector from '@/components/inventory/StoreSelector';
import InventoryTable from '@/components/inventory/InventoryTable';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import StoreInfoCard from '@/components/inventory/StoreInfoCard';

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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span>Loading...</span>
            </div>
        );
    }

    // Check if STORE_ADMIN has assigned store
    if (role === 'STORE_ADMIN' && !assignedStoreId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <CardTitle>No Store Assigned</CardTitle>
                        </div>
                        <CardDescription>
                            You haven't been assigned to any store yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Please contact your Super Admin to assign you to a store before you can access inventory management.
                        </p>
                        <Button onClick={() => router.push('/dashboard')} className="w-full">
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (role !== 'SUPER_ADMIN' && role !== 'STORE_ADMIN') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <CardTitle>Unauthorized Access</CardTitle>
                        </div>
                        <CardDescription>
                            You don't have permission to access this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push('/')} className="w-full">
                            Go to Homepage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">

            {/* Header - Fixed */}
            <div className="shrink-0 border-b bg-background px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Inventory Management</h2>
                        <p className="text-muted-foreground">
                            Manage stock levels and track inventory movements
                        </p>
                    </div>
                    {selectedStoreId && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={fetchInventory}
                            disabled={inventoryLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${inventoryLoading ? 'animate-spin' : ''} md:mr-2`} />
                            <span className="hidden md:inline">Refresh</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-6 px-4">

                    {/* Store Information */}
                    {selectedStoreId && (
                        <StoreInfoCard storeId={selectedStoreId} />
                    )}

                    <div className="space-y-6 mt-6">
                        {/* Store Selector & Filters - Horizontal on desktop, Vertical on mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Store Selector */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>Select Store</CardTitle>
                                    <CardDescription>
                                        Choose a store to view and manage its inventory
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <StoreSelector
                                        selectedStoreId={selectedStoreId}
                                        onStoreChange={setSelectedStoreId}
                                        userRole={role}
                                    />
                                </CardContent>
                            </Card>

                            {/* Inventory Filters */}
                            {selectedStoreId && (
                                <InventoryFilters
                                    onFilterChange={setFilters}
                                    categories={categories}
                                />
                            )}
                        </div>



                        {/* Inventory Table */}
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
        </div>
    );
}
