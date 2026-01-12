"use client";

import { IProductVariant } from "@/types/product";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface VariantSelectorProps {
    variants: IProductVariant[];
    selectedVariantId: string;
    onVariantChange: (variantId: string) => void;
    productImages?: { id: string; imageUrl: string; order: number }[];
}

export function VariantSelector({
    variants,
    selectedVariantId,
    onVariantChange,
    productImages = [],
}: VariantSelectorProps) {
    if (!variants || variants.length === 0) {
        return null;
    }

    // If only one variant, just display it (no selector needed)
    if (variants.length === 1) {
        const variant = variants[0];
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium">Varian</label>
                <div className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                        {productImages[0] && (
                            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                <Image
                                    src={productImages[0].imageUrl}
                                    alt={variant.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-medium text-sm">{variant.name}</p>
                            {(variant.color || variant.size) && (
                                <p className="text-xs text-muted-foreground">
                                    {[variant.color, variant.size].filter(Boolean).join(" • ")}
                                </p>
                            )}
                        </div>
                        <p className="font-bold text-primary">
                            Rp {Number(variant.price).toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const selectedVariant = variants.find((v) => v.id === selectedVariantId);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Varian</label>
            <Select value={selectedVariantId} onValueChange={onVariantChange}>
                <SelectTrigger className="w-full h-auto py-3">
                    <SelectValue>
                        {selectedVariant && (
                            <div className="flex items-center gap-3">
                                {productImages[0] && (
                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={productImages[0].imageUrl}
                                            alt={selectedVariant.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-sm">{selectedVariant.name}</p>
                                    {(selectedVariant.color || selectedVariant.size) && (
                                        <p className="text-xs text-muted-foreground">
                                            {[selectedVariant.color, selectedVariant.size]
                                                .filter(Boolean)
                                                .join(" • ")}
                                        </p>
                                    )}
                                </div>
                                <p className="font-bold text-primary">
                                    Rp {Number(selectedVariant.price).toLocaleString("id-ID")}
                                </p>
                            </div>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id} className="py-3">
                            <div className="flex items-center gap-3 w-full">
                                {productImages[0] && (
                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={productImages[0].imageUrl}
                                            alt={variant.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{variant.name}</p>
                                    {(variant.color || variant.size) && (
                                        <p className="text-xs text-muted-foreground">
                                            {[variant.color, variant.size].filter(Boolean).join(" • ")}
                                        </p>
                                    )}
                                </div>
                                <p className="font-bold text-primary">
                                    Rp {Number(variant.price).toLocaleString("id-ID")}
                                </p>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
