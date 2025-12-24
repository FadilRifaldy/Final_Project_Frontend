import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ICreateProductVariant, IUpdateProductVariant } from "@/types/product"

interface VariantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    name: string;
    setName: (name: string) => void;
    price: number;
    setPrice: (price: number) => void;
    color: string;
    setColor: (color: string) => void;
    size: string;
    setSize: (size: string) => void;
    weight: number;
    setWeight: (weight: number) => void;
    isActive?: boolean;
    setIsActive?: (isActive: boolean) => void;
    onSave: () => void;
}

export function VariantDialog({
    open,
    onOpenChange,
    mode,
    name,
    setName,
    price,
    setPrice,
    color,
    setColor,
    size,
    setSize,
    weight,
    setWeight,
    isActive,
    setIsActive,
    onSave
}: VariantDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Add Variant" : "Edit Variant"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Add a new variant to this product. SKU will be auto-generated."
                            : "Make changes to the variant."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Variant Name *
                        </label>
                        <Input
                            placeholder="e.g. iPhone 17 Pro 256GB Black"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Descriptive name for this variant
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Price (Rp) *
                        </label>
                        <Input
                            type="number"
                            placeholder="15000000"
                            value={price || ''}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Color
                            </label>
                            <Input
                                placeholder="e.g. Black, White, Blue"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Size
                            </label>
                            <Input
                                placeholder="e.g. 256GB, XL, 42"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Weight (grams)
                        </label>
                        <Input
                            type="number"
                            placeholder="500"
                            value={weight || ''}
                            onChange={(e) => setWeight(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Used for shipping cost calculation
                        </p>
                    </div>

                    {mode === "edit" && setIsActive && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">
                                Variant is active
                            </label>
                        </div>
                    )}

                    {mode === "create" && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> SKU will be automatically generated based on product code, color, size, and counter.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>
                        {mode === "create" ? "Create" : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
