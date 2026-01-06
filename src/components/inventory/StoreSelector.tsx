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

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await api.get('/stores/get-stores', {
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

    // Store Admin - show assigned store only (read-only)
    if (userRole === 'STORE_ADMIN' && stores.length > 0) {
        const assignedStore = stores[0]; // Assuming first store is assigned
        return (
            <div className="space-y-2">
                <Label>Store</Label>
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

    // Super Admin - show dropdown
    return (
        <div className="space-y-2">
            <Label htmlFor="store-select">Select Store</Label>
            <Select value={selectedStoreId || undefined} onValueChange={onStoreChange}>
                <SelectTrigger id="store-select">
                    <SelectValue placeholder="Choose a store" />
                </SelectTrigger>
                <SelectContent>
                    {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4" />
                                <span>{store.name}</span>
                                <span className="text-xs text-muted-foreground">({store.city})</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
