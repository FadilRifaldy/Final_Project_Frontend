import { MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IStoreInventory } from "@/types/inventory";
import { IProductVariant } from "@/types/product";

interface StoreAvailabilityCardProps {
    inventory: IStoreInventory;
    variant: IProductVariant;
    isSelected: boolean;
    onSelect: () => void;
}

export function StoreAvailabilityCard({
    inventory,
    variant,
    isSelected,
    onSelect,
}: StoreAvailabilityCardProps) {
    const { store, quantity, reserved } = inventory;
    const availableStock = quantity - reserved;

    // Determine stock status
    const getStockStatus = () => {
        if (availableStock === 0) {
            return { label: "Habis", color: "bg-red-500" };
        } else if (availableStock <= 10) {
            return { label: `Stok Terbatas (${availableStock})`, color: "bg-orange-500" };
        } else {
            return { label: `Tersedia (${availableStock})`, color: "bg-green-500" };
        }
    };

    const stockStatus = getStockStatus();
    const isOutOfStock = availableStock === 0;

    return (
        <Card
            className={`cursor-pointer transition-all ${isSelected
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
                } ${isOutOfStock ? "opacity-60" : ""}`}
            onClick={!isOutOfStock ? onSelect : undefined}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Store Info */}
                    <div className="flex-1 space-y-2">
                        {/* Store Name */}
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary shrink-0" />
                            <h4 className="font-semibold text-sm">{store.name}</h4>
                            {isSelected && (
                                <Badge variant="default" className="ml-auto">
                                    Dipilih
                                </Badge>
                            )}
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                                <p>{store.city}, {store.province}</p>
                                <p className="text-xs line-clamp-1">{store.address}</p>
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="flex items-center gap-3 pt-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Harga</p>
                                <p className="font-bold text-primary">
                                    Rp {Number(variant.price).toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <p className="text-xs text-muted-foreground">Stok</p>
                                <Badge className={stockStatus.color}>
                                    {stockStatus.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Select Button */}
                    {!isSelected && !isOutOfStock && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect();
                            }}
                        >
                            Pilih
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
