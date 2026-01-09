'use client'

import { useEffect, useState } from 'react';
import api from '@/lib/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface StoreInfo {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    phone: string | null;
    isActive: boolean;
    admin?: {
        name: string;
        email: string;
    };
}

interface StoreInfoCardProps {
    storeId: string;
}

export default function StoreInfoCard({ storeId }: StoreInfoCardProps) {
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (!storeId) return;

            setLoading(true);
            try {
                const response = await api.get(`/stores/${storeId}`);
                setStoreInfo(response.data.data);
            } catch (error) {
                console.error('Error fetching store info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreInfo();
    }, [storeId]);

    if (loading) {
        return (
            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!storeInfo) {
        return null;
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent>
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6 items-start">
                    {/* Store Admin */}
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 p-2 rounded-lg bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Store Admin</p>
                            {storeInfo.admin ? (
                                <>
                                    <p className="font-medium truncate">{storeInfo.admin.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {storeInfo.admin.email}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">No admin assigned</p>
                            )}
                        </div>
                    </div>

                    {/* Store Address */}
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 p-2 rounded-lg bg-primary/10">
                            <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium">{storeInfo.address}</p>
                            <p className="text-sm text-muted-foreground">
                                {storeInfo.city}, {storeInfo.province}
                            </p>
                            {storeInfo.phone && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {storeInfo.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Store Status */}
                    <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <Badge variant={storeInfo.isActive ? "default" : "secondary"} className="mt-1">
                                {storeInfo.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
