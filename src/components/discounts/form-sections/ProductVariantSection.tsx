import { Label } from "@/components/ui/label";
import { VariantAutocomplete } from "@/components/discounts/VariantAutocomplete";
import { DiscountType } from "@/types/discount";

interface ProductVariantSectionProps {
    type: DiscountType;
    productVariantIds: string[];
    setProductVariantIds: (ids: string[]) => void;
}

export function ProductVariantSection({
    type,
    productVariantIds,
    setProductVariantIds,
}: ProductVariantSectionProps) {
    if (type !== "PRODUCT" && type !== "BUY_ONE_GET_ONE") return null;

    return (
        <div className="space-y-2">
            <Label>Product Variants *</Label>
            <VariantAutocomplete
                selectedIds={productVariantIds}
                onSelect={setProductVariantIds}
                placeholder="Search products or SKU..."
            />
            {productVariantIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    {productVariantIds.length} variant{productVariantIds.length > 1 ? 's' : ''} selected
                </p>
            )}
        </div>
    );
}
