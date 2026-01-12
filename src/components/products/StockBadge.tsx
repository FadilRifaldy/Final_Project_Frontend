import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
    quantity: number;
    reserved?: number;
}

export function StockBadge({ quantity, reserved = 0 }: StockBadgeProps) {
    const available = quantity - reserved;

    if (available <= 0) {
        return (
            <Badge variant="destructive" className="font-medium">
                Habis
            </Badge>
        );
    }

    if (available <= 10) {
        return (
            <Badge variant="outline" className="font-medium border-yellow-500 text-yellow-700 bg-yellow-50">
                Stok Terbatas ({available})
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="font-medium border-green-500 text-green-700 bg-green-50">
            Tersedia ({available})
        </Badge>
    );
}
