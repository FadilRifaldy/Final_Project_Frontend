import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DiscountType } from "@/types/discount";

interface BasicInfoSectionProps {
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    type: DiscountType;
    setType: (value: DiscountType) => void;
}

export function BasicInfoSection({
    name,
    setName,
    description,
    setDescription,
    type,
    setType,
}: BasicInfoSectionProps) {
    return (
        <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Nama Discount *</Label>
                <Input
                    id="name"
                    placeholder="Flash Sale 50%"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    placeholder="Deskripsi singkat tentang discount ini"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
                <Label htmlFor="type">Tipe Discount *</Label>
                <Select value={type} onValueChange={(value) => setType(value as DiscountType)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PRODUCT">Product Discount</SelectItem>
                        <SelectItem value="CART">Cart Discount</SelectItem>
                        <SelectItem value="BUY_ONE_GET_ONE">Buy One Get One</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    {type === "PRODUCT" && "Discount untuk produk tertentu"}
                    {type === "CART" && "Discount untuk total keranjang belanja"}
                    {type === "BUY_ONE_GET_ONE" && "Beli X gratis Y"}
                </p>
            </div>
        </div>
    );
}
