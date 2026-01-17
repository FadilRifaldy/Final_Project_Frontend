"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Store, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { IStoreInventory } from "@/types/inventory";
import { IProductVariant } from "@/types/product";

interface StoreComboboxProps {
    stores: IStoreInventory[];
    variant: IProductVariant;
    selectedStoreId: string | null;
    onStoreSelect: (storeId: string) => void;
    isLoading?: boolean;
}

export function StoreCombobox({
    stores,
    variant,
    selectedStoreId,
    onStoreSelect,
    isLoading = false,
}: StoreComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Helper function untuk stock status
    const getStockStatus = (inventory: IStoreInventory) => {
        const availableStock = inventory.quantity - inventory.reserved;

        if (availableStock === 0) {
            return {
                label: "Habis",
                variant: "destructive" as const,
            };
        } else if (availableStock <= 10) {
            return {
                label: `${availableStock} tersisa`,
                variant: "secondary" as const,
            };
        } else {
            return {
                label: `${availableStock} tersedia`,
                variant: "default" as const,
            };
        }
    };

    const selectedStore = stores.find(
        (inventory) => inventory.storeId === selectedStoreId
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[44px] py-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Memuat toko...</span>
                        </div>
                    ) : selectedStore ? (
                        <div className="flex items-center gap-2 flex-1 text-left">
                            <Store className="h-4 w-4 shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                    {selectedStore.store.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {selectedStore.store.city}, {selectedStore.store.province}
                                </p>
                            </div>
                            <Badge
                                variant={getStockStatus(selectedStore).variant}
                                className="shrink-0"
                            >
                                {getStockStatus(selectedStore).label}
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Pilih toko...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari toko..." />
                    <CommandList>
                        <CommandEmpty>Toko tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {stores.map((inventory) => {
                                const availableStock = inventory.quantity - inventory.reserved;
                                const isOutOfStock = availableStock === 0;
                                const stockStatus = getStockStatus(inventory);

                                return (
                                    <CommandItem
                                        key={`${inventory.id}-${inventory.storeId}`}
                                        value={`${inventory.store.name} ${inventory.store.city} ${inventory.store.province}`}
                                        onSelect={() => {
                                            if (!isOutOfStock) {
                                                onStoreSelect(inventory.storeId);
                                                setOpen(false);
                                            }
                                        }}
                                        disabled={isOutOfStock}
                                        className={cn(
                                            "flex items-start gap-2 py-3",
                                            isOutOfStock && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <Check
                                            className={cn(
                                                "h-4 w-4 shrink-0 mt-0.5",
                                                selectedStoreId === inventory.storeId
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                    <p className="font-medium truncate">
                                                        {inventory.store.name}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={stockStatus.variant}
                                                    className="shrink-0 text-xs"
                                                >
                                                    {stockStatus.label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-start gap-1.5 text-xs text-muted-foreground pl-6">
                                                <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                                                <span className="truncate">
                                                    {inventory.store.city}, {inventory.store.province}
                                                </span>
                                            </div>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
