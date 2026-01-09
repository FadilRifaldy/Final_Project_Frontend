'use client'

import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';

interface StoreData {
    id: string;
    name: string;
    city: string;
    isActive: boolean;
}

interface StoreSelectorProps {
    selectedStoreId: string | null;
    onStoreChange: (storeId: string) => void;
    userRole: string;
}

export default function StoreSelector({
    selectedStoreId,
    onStoreChange,
    userRole
}: StoreSelectorProps) {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState<string>('all');

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await api.get('/stores', {
                    params: { isActive: true }
                });

                setStores(response.data.data || []);

                // Auto-select first store if none selected
                if (!selectedStoreId && response.data.data?.length > 0) {
                    onStoreChange(response.data.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    // Auto-select first store when city filter changes
    useEffect(() => {
        if (userRole === 'SUPER_ADMIN' && stores.length > 0) {
            const filteredStores = selectedCity === 'all'
                ? stores
                : stores.filter(s => s.city === selectedCity);

            if (filteredStores.length > 0 && !filteredStores.find(s => s.id === selectedStoreId)) {
                onStoreChange(filteredStores[0].id);
            }
        }
    }, [selectedCity, stores, userRole, selectedStoreId, onStoreChange]);

    if (loading) {
        return (
            <div className="space-y-2">
                <Label>Store</Label>
                <div className="h-10 bg-muted animate-pulse rounded-md" />
            </div>
        );
    }

    if (stores.length === 0) {
        return (
            <div className="space-y-2">
                <Label>Store</Label>
                <div className="text-sm text-muted-foreground">
                    No active stores found
                </div>
            </div>
        );
    }

    // Extract unique cities
    const cities = [...new Set(stores.map(s => s.city))].filter(Boolean).sort();

    // Filter stores by city
    const filteredStores = selectedCity === 'all'
        ? stores
        : stores.filter(s => s.city === selectedCity);

    // Store Admin - show assigned store only (read-only)
    if (userRole === 'STORE_ADMIN' && stores.length > 0) {
        const assignedStore = stores[0]; // Assuming first store is assigned
        return (
            <div className="space-y-2">
                <Label htmlFor="store">Store</Label>
                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="font-medium">{assignedStore.name}</p>
                        <p className="text-xs text-muted-foreground">{assignedStore.city}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Super Admin - show dropdown with city filter
    return (
        <div className="flex flex-col gap-4">
            {/* City Filter (SUPER_ADMIN only) */}
            {userRole === 'SUPER_ADMIN' && cities.length > 1 && (
                <div className="space-y-2">
                    <Label htmlFor="city">Filter by City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger id="city">
                            <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                    {city}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Store Selector */}
            <div className="space-y-2">
                <Label htmlFor="store">Filter by Store</Label>
                <Select value={selectedStoreId || ''} onValueChange={onStoreChange}>
                    <SelectTrigger id="store">
                        <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredStores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                                <div className="flex items-center gap-2">
                                    <Store className="h-4 w-4" />
                                    <span>{store.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({store.city})
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
