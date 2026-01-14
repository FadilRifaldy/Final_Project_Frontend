import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DiscountValueType } from "@/types/discount";

interface ValueSectionProps {
    discountValueType: DiscountValueType;
    setDiscountValueType: (value: DiscountValueType) => void;
    discountValue: string;
    setDiscountValue: (value: string) => void;
}

export function ValueSection({
    discountValueType,
    setDiscountValueType,
    discountValue,
    setDiscountValue,
}: ValueSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="valueType">Tipe Nilai *</Label>
                <Select
                    value={discountValueType}
                    onValueChange={(value) => setDiscountValueType(value as DiscountValueType)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Nominal (Rp)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="value">Nilai Discount {discountValueType === "PERCENTAGE" ? "(%)" : "(Rp)"} *</Label>
                <Input
                    id="value"
                    type="number"
                    placeholder={discountValueType === "PERCENTAGE" ? "10" : "50000"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    min="0"
                    max={discountValueType === "PERCENTAGE" ? "100" : undefined}
                />
            </div>
        </div>
    );
}
