import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/helpers/cart.backend';

interface DiscountSectionProps {
    appliedDiscounts: any[];
    enabledDiscounts: Set<string>;
    onToggleDiscount: (discountId: string, enabled: boolean) => void;
}

export function DiscountSection({
    appliedDiscounts,
    enabledDiscounts,
    onToggleDiscount,
}: DiscountSectionProps) {
    if (appliedDiscounts.length === 0) return null;

    const totalEnabledDiscount = appliedDiscounts
        .filter(d => enabledDiscounts.has(d.id))
        .reduce((sum, d) => sum + d.appliedAmount, 0);

    return (
        <div className="space-y-2 py-2 border-y border-amber-100">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 uppercase">Promo Tersedia</span>
                <span className="text-xs text-gray-500">
                    {enabledDiscounts.size} dari {appliedDiscounts.length} aktif
                </span>
            </div>

            {appliedDiscounts.map((discount) => {
                const isEnabled = enabledDiscounts.has(discount.id);
                return (
                    <div key={discount.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                type="checkbox"
                                id={`discount-${discount.id}`}
                                checked={isEnabled}
                                onChange={(e) => onToggleDiscount(discount.id, e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor={`discount-${discount.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                                <Badge className={`text-xs ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    PROMO
                                </Badge>
                                <span className={`font-medium ${isEnabled ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                                    {discount.name}
                                </span>
                            </label>
                        </div>
                        <span className={`font-semibold ${isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                            -{formatPrice(discount.appliedAmount)}
                        </span>
                    </div>
                );
            })}

            <div className="flex justify-between text-sm font-bold text-green-600 pt-2 border-t border-green-100">
                <span>Total Diskon</span>
                <span>-{formatPrice(totalEnabledDiscount)}</span>
            </div>
        </div>
    );
}
