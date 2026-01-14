import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ScopeSectionProps {
    userRole: "SUPER_ADMIN" | "STORE_ADMIN";
    userStoreId?: string;
    discountScope: "global" | "store";
    setDiscountScope: (value: "global" | "store") => void;
    selectedStoreId: string;
    setSelectedStoreId: (value: string) => void;
}

export function ScopeSection({
    userRole,
    userStoreId,
    discountScope,
    setDiscountScope,
    selectedStoreId,
    setSelectedStoreId,
}: ScopeSectionProps) {
    // Super Admin: Show scope selector
    if (userRole === "SUPER_ADMIN") {
        return (
            <div className="space-y-4">
                {/* Scope Selector */}
                <div className="space-y-2">
                    <Label htmlFor="scope">Scope Discount *</Label>
                    <Select value={discountScope} onValueChange={(value) => setDiscountScope(value as "global" | "store")}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="global">Global (Semua Toko)</SelectItem>
                            <SelectItem value="store">Specific Store</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        {discountScope === "global" && "Discount berlaku di semua toko"}
                        {discountScope === "store" && "Discount hanya berlaku di toko tertentu"}
                    </p>
                </div>

                {/* Store Selector - if scope is store */}
                {discountScope === "store" && (
                    <div className="space-y-2">
                        <Label htmlFor="storeSelect">Pilih Toko *</Label>
                        <Input
                            id="storeSelect"
                            placeholder="Store ID (TODO: implement store selector)"
                            value={selectedStoreId}
                            onChange={(e) => setSelectedStoreId(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Masukkan Store ID untuk discount ini
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // Store Admin: Show info only
    if (userRole === "STORE_ADMIN" && userStoreId) {
        return (
            <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                    <strong>Scope:</strong> Discount ini hanya berlaku untuk toko Anda
                </p>
            </div>
        );
    }

    return null;
}
