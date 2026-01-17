import { Building2, CreditCard } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodCardProps {
    selectedMethod: 'MANUAL_TRANSFER' | 'PAYMENT_GATEWAY';
    onSelect: (method: 'MANUAL_TRANSFER' | 'PAYMENT_GATEWAY') => void;
}

export function PaymentMethodCard({
    selectedMethod,
    onSelect,
}: PaymentMethodCardProps) {
    return (
        <RadioGroup value={selectedMethod} onValueChange={(value: any) => onSelect(value)}>
            <div className="space-y-3">
                {/* Manual Transfer */}
                <label
                    htmlFor="manual"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'MANUAL_TRANSFER'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                        }`}
                >
                    <RadioGroupItem value="MANUAL_TRANSFER" id="manual" />
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                            <Building2 className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-1">
                                Transfer Bank Manual
                            </p>
                            <p className="text-sm text-gray-600">
                                Bayar melalui transfer bank dan upload bukti pembayaran
                            </p>
                        </div>
                    </div>
                </label>

                {/* Payment Gateway - Disabled */}
                <div className="relative">
                    <label
                        htmlFor="gateway"
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed"
                    >
                        <RadioGroupItem value="PAYMENT_GATEWAY" id="gateway" disabled />
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-gray-700">Payment Gateway</p>
                                    <Badge variant="outline" className="text-xs">Segera Hadir</Badge>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Kartu kredit, e-wallet, dan metode lainnya
                                </p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </RadioGroup>
    );
}
