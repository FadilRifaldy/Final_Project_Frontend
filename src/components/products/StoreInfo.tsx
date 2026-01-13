import { MapPin, Store } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StoreInfoProps {
    storeName: string;
    city: string;
    distance?: number; // dalam KM
}

export function StoreInfo({ storeName, city, distance }: StoreInfoProps) {
    return (
        <Card className="p-4 bg-muted/50">
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Dikirim dari</h3>
                    <p className="text-sm font-medium">{storeName}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{city}</span>
                        {distance && (
                            <>
                                <span className="mx-1">•</span>
                                <span>{distance.toFixed(1)} km dari lokasi Anda</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
