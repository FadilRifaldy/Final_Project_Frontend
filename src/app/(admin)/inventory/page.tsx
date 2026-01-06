'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import StoreSelector from '@/components/inventory/StoreSelector';
import InventoryTable from '@/components/inventory/InventoryTable';

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

export default function InventoryPage() {
    const [role, setRole] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [inventories, setInventories] = useState<InventoryItem[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await api.get('/auth/dashboard');
                setRole(response.data.user.role);
            } catch (error) {
                console.error('Error fetching role:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchRole();
    }, [router]);

    // Redirect CUSTOMER
    useEffect(() => {
        if (role === 'CUSTOMER') {
            router.push('/');
        }
    }, [role, router]);

    // Fetch inventory when store selected
    useEffect(() => {
        if (selectedStoreId) {
            fetchInventory();
        }
    }, [selectedStoreId]);

    const fetchInventory = async () => {
        if (!selectedStoreId) return;

        setInventoryLoading(true);
        try {
            // Use new endpoint that shows ALL variants (including stock 0)
            const response = await api.get(
                `/api/inventory/store/${selectedStoreId}/all-variants`,
                {
                    params: { page: 1, limit: 100 }
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
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-3xl font-bold">Inventory Management</h2>
                            <p className="text-muted-foreground">
                                Manage stock levels and track inventory movements
                            </p>
                        </div>
                    </div>
                    {selectedStoreId && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchInventory}
                            disabled={inventoryLoading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${inventoryLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* Store Selector */}
                <Card>
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

                {/* Inventory Table */}
                {selectedStoreId && (
                    <Card>
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
    );
}
