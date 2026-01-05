"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { IProduct, IProductVariant } from "@/types/product";
import { getProductVariant, createProductVariant } from "@/lib/helpers/productVariant.backend";
import { VariantDialog } from "./VariantDialog";
import { toast } from "sonner";

// Helper function untuk format Rupiah
const formatRupiah = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

interface VariantManagementPanelProps {
    product: IProduct | null;
    onClose?: () => void;
}

export function VariantManagementPanel({ product, onClose }: VariantManagementPanelProps) {
    const [variants, setVariants] = useState<IProductVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [weight, setWeight] = useState(0);

    // Refresh untuk Fetch variants 
    useEffect(() => {
        if (product) {
            fetchVariants();
        }
    }, [product?.id]);

    const fetchVariants = async () => {
        if (!product) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getProductVariant(product.id);
            setVariants(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load variants");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handler untuk create button
    const handleCreate = () => {
        setDialogMode("create");
        setName("");
        setPrice(0);
        setColor("");
        setSize("");
        setWeight(0);
        setSelectedVariant(null);
        setDialogOpen(true);
    };

    // Handler untuk edit button
    const handleEdit = (variant: IProductVariant) => {
        setDialogMode("edit");
        setName(variant.name);
        setPrice(variant.price);
        setColor(variant.color || "");
        setSize(variant.size || "");
        setWeight(variant.weight || 0);
        setSelectedVariant(variant);
        setDialogOpen(true);
    };

    // Handler untuk save (create/update)
    const handleSave = async () => {
        if (!product) return;

        try {
            if (dialogMode === "create") {
                await createProductVariant(product.id, {
                    name,
                    price,
                    color: color || undefined,
                    size: size || undefined,
                    weight,
                });
                toast.success("Variant created successfully!");
            } else {
                toast.success("Variant updated successfully!");
            }

            // Refresh variants list
            await fetchVariants();
            setDialogOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save variant");
        }
    };

    if (!product) {
        return (
            <div className="text-center text-gray-500 py-8">
                Select a product to manage variants
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Variant List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-600">Loading variants...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                ) : variants.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium mb-2">No variants yet</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Create variants with different sizes, colors, or prices
                        </p>
                        <Button size="sm" onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Variant
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
                        {variants.map((variant) => (
                            <div
                                key={variant.id}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                            >
                                {/* Thumbnail Image Placeholder */}
                                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/50 flex items-center justify-center">
                                            <span className="text-2xl text-gray-400">📦</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">No Image</p>
                                    </div>
                                    {/* Action Buttons - Positioned on top right of image */}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 w-7 p-0 bg-white/90 hover:bg-white"
                                            onClick={() => handleEdit(variant)}
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 w-7 p-0 bg-white/90 hover:bg-white"
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-3">
                                    <h4 className="font-medium text-sm mb-2 line-clamp-1">{variant.name}</h4>

                                    {/* Variant Details */}
                                    <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
                                        {variant.color && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                {variant.color}
                                            </span>
                                        )}
                                        {variant.size && (
                                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                                                {variant.size}
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                                            {variant.weight}g
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <p className="text-sm font-semibold text-primary">
                                        Rp {formatRupiah(variant.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Variant Button - Fixed at bottom */}
            {variants.length > 0 && (
                <div className="flex justify-end border-t border-gray-200 pt-4 mt-4 px-4">
                    <Button className="w-[20%]" onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                    </Button>
                </div>
            )}

            {/* Variant Dialog */}
            <VariantDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                name={name}
                setName={setName}
                price={price}
                setPrice={setPrice}
                color={color}
                setColor={setColor}
                size={size}
                setSize={setSize}
                weight={weight}
                setWeight={setWeight}
                onSave={handleSave}
            />
        </div>
    );
}
