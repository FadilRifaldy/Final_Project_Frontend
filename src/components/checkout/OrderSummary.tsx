import { Package } from 'lucide-react';
import { formatPrice, formatWeight, type Cart } from '@/lib/helpers/cart.backend';
import { formatPrice as formatCheckoutPrice } from '@/lib/helpers/checkout.backend';
import { DiscountSection } from './DiscountSection';

interface OrderSummaryProps {
    cart: Cart;
    selectedShipping: { cost: number } | null;
    appliedDiscounts: any[];
    enabledDiscounts: Set<string>;
    onToggleDiscount: (discountId: string, enabled: boolean) => void;
    total: number;
}

export function OrderSummary({
    cart,
    selectedShipping,
    appliedDiscounts,
    enabledDiscounts,
    onToggleDiscount,
    total,
}: OrderSummaryProps) {
    return (
        <>
            {/* Items */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.variant.primaryImage ? (
                                <img
                                    src={item.variant.primaryImage}
                                    alt={item.variant.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-300" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                                {item.variant.name}
                            </p>
                            <p className="text-xs text-gray-600">
                                {item.quantity} x {formatPrice(item.variant.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-6 pt-6 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cart.summary.totalQuantity} item)</span>
                    <span className="font-semibold">{formatPrice(cart.summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Berat Total</span>
                    <span className="font-semibold">{formatWeight(cart.summary.estimatedWeight)}</span>
                </div>

                {/* Discount Section */}
                <DiscountSection
                    appliedDiscounts={appliedDiscounts}
                    enabledDiscounts={enabledDiscounts}
                    onToggleDiscount={onToggleDiscount}
                />

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-semibold">
                        {selectedShipping ? formatCheckoutPrice(selectedShipping.cost) : '-'}
                    </span>
                </div>
                <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-gray-800">Total Pembayaran</span>
                        <span className="text-2xl font-bold text-amber-600">
                            {cart && selectedShipping
                                ? formatCheckoutPrice(total)
                                : 'Rp 0'
                            }
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
