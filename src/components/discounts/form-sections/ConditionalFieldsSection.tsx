import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DiscountType, DiscountValueType } from "@/types/discount";

interface ConditionalFieldsSectionProps {
    type: DiscountType;
    discountValueType: DiscountValueType;
    minPurchase: string;
    setMinPurchase: (value: string) => void;
    maxDiscount: string;
    setMaxDiscount: (value: string) => void;
    buyQuantity: string;
    setBuyQuantity: (value: string) => void;
    getQuantity: string;
    setGetQuantity: (value: string) => void;
}

export function ConditionalFieldsSection({
    type,
    discountValueType,
    minPurchase,
    setMinPurchase,
    maxDiscount,
    setMaxDiscount,
    buyQuantity,
    setBuyQuantity,
    getQuantity,
    setGetQuantity,
}: ConditionalFieldsSectionProps) {
    if (type === "CART") {
        return (
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="minPurchase">Minimal Pembelian (Optional)</Label>
                    <Input
                        id="minPurchase"
                        type="number"
                        placeholder="100000"
                        value={minPurchase}
                        onChange={(e) => setMinPurchase(e.target.value)}
                        min="0"
                        step="1000"
                    />
                </div>

                {discountValueType === "PERCENTAGE" && (
                    <div className="space-y-2">
                        <Label htmlFor="maxDiscount">Maksimal Potongan (Optional)</Label>
                        <Input
                            id="maxDiscount"
                            type="number"
                            placeholder="50000"
                            value={maxDiscount}
                            onChange={(e) => setMaxDiscount(e.target.value)}
                            min="0"
                            step="1000"
                        />
                    </div>
                )}
            </div>
        );
    }

    if (type === "BUY_ONE_GET_ONE") {
        return (
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="buyQty">Beli (Qty) *</Label>
                    <Input
                        id="buyQty"
                        type="number"
                        placeholder="1"
                        value={buyQuantity}
                        onChange={(e) => setBuyQuantity(e.target.value)}
                        min="1"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="getQty">Gratis (Qty) *</Label>
                    <Input
                        id="getQty"
                        type="number"
                        placeholder="1"
                        value={getQuantity}
                        onChange={(e) => setGetQuantity(e.target.value)}
                        min="1"
                    />
                </div>
            </div>
        );
    }

    return null;
}
