"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { IProduct, IProductVariant } from "@/types/product";
import { getProductVariant, createProductVariant } from "@/lib/helpers/productVariant.backend";
import { VariantDialog } from "./VariantDialog";
import { toast } from "sonner";

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
                    <div className="space-y-2">
                        {variants.map((variant) => (
                            <div
                                key={variant.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{variant.name}</h4>
                                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                                            {variant.color && (
                                                <span className="flex items-center gap-1">
                                                    {variant.color}
                                                </span>
                                            )}
                                            {variant.size && <span>Size: {variant.size}</span>}
                                            <span>Weight: {variant.weight}g</span>
                                        </div>
                                        <p className="text-sm font-semibold text-primary mt-2">
                                            Rp {variant.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(variant)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Variant Button - Fixed at bottom */}
            {variants.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <Button className="w-full" onClick={handleCreate}>
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
