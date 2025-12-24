"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IProductVariant } from "@/types/product";
import { useVariantStore } from "@/lib/store/productVariantStore";
import { useProductStore } from "@/lib/store/productStore";
import { VariantTable } from "@/components/products/VariantTable";
import { VariantDialog } from "@/components/products/VariantDialog";
import { DeleteVariantDialog } from "@/components/products/DeleteVariantDialog";
import { ArrowLeft } from "lucide-react";

export default function VariantsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    const [currentRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN">("SUPER_ADMIN");
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [weight, setWeight] = useState(0);
    const [isActive, setIsActive] = useState(true);

    // Ambil data dan functions dari Zustand stores
    const {
        variants,
        loading,
        error,
        fetchVariant,
        addVariant,
    } = useVariantStore();

    const { products } = useProductStore();

    // Get current product
    const currentProduct = products.find(p => p.id === productId);

    // Fetch variants saat component mount
    useEffect(() => {
        if (productId) {
            fetchVariant(productId);
        }
    }, [productId, fetchVariant]);

    // Handler untuk create button
    const handleCreate = () => {
        setDialogMode("create");
        setSelectedVariant(null);
        setName("");
        setPrice(0);
        setColor("");
        setSize("");
        setWeight(0);
        setIsActive(true);
        setDialogOpen(true);
    };

    // Handler untuk edit button
    const handleEdit = (variant: IProductVariant) => {
        setDialogMode("edit");
        setSelectedVariant(variant);
        setName(variant.name);
        setPrice(variant.price);
        setColor(variant.color || "");
        setSize(variant.size || "");
        setWeight(variant.weight || 0);
        setIsActive(variant.isActive);
        setDialogOpen(true);
    };

    // Handler untuk delete button
    const handleDelete = (variant: IProductVariant) => {
        setSelectedVariant(variant);
        setDeleteDialogOpen(true);
    };

    // Konfirmasi delete
    const confirmDelete = () => {
        if (selectedVariant && productId) {
            // TODO: Implement delete when backend ready
            console.log("Delete variant:", selectedVariant.id);
        }
        setDeleteDialogOpen(false);
        setSelectedVariant(null);
    };

    // Handler untuk save (create atau update)
    const handleSave = async () => {
        if (!productId) return;

        if (dialogMode === "create") {
            await addVariant(productId, {
                name,
                price,
                color: color || undefined,
                size: size || undefined,
                weight: weight || undefined,
            });
        } else if (dialogMode === "edit" && selectedVariant) {
            // TODO: Implement update when backend ready
            console.log("Update variant:", selectedVariant.id);
        }
        setDialogOpen(false);
    };

    // Redirect jika tidak ada productId
    if (!productId) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-destructive/10 text-destructive p-3 rounded">
                    Product ID is required. Please select a product first.
                </div>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push("/products")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/products")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">Product Variants</h1>
                </div>
                {currentRole === "SUPER_ADMIN" && (
                    <Button onClick={handleCreate}>Add Variant</Button>
                )}
            </div>

            {/* Product Name Display */}
            {currentProduct && (
                <div className="mb-4 p-4 bg-muted rounded-lg border">
                    <p className="text-sm text-muted-foreground">Variants for:</p>
                    <h2 className="text-xl font-semibold">{currentProduct.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{currentProduct.description}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && <p className="text-muted-foreground">Loading variants...</p>}

            {/* Error state */}
            {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Variant Table */}
            <VariantTable
                variants={variants}
                loading={loading}
                currentRole={currentRole}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Create/Edit Dialog */}
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
                isActive={isActive}
                setIsActive={setIsActive}
                onSave={handleSave}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteVariantDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                selectedVariant={selectedVariant}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
