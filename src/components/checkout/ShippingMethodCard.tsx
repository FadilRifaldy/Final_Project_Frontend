import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice as formatCheckoutPrice, type ShippingOption } from '@/lib/helpers/checkout.backend';

interface ShippingMethodCardProps {
    options: ShippingOption[];
    selectedService: string;
    onSelect: (service: string) => void;
}

export function ShippingMethodCard({
    options,
    selectedService,
    onSelect,
}: ShippingMethodCardProps) {
    return (
        <RadioGroup value={selectedService} onValueChange={onSelect}>
            <div className="space-y-3">
                {options.map((option) => (
                    <label
                        key={`${option.courier}-${option.service}`}
                        htmlFor={option.service}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedService === option.service
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            }`}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <RadioGroupItem value={option.service} id={option.service} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-800">{option.courier}</span>
                                    <span className="text-sm text-gray-600">• {option.service}</span>
                                </div>
                                <p className="text-sm text-gray-600">{option.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Estimasi: {option.estimate}
                                </p>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <p className="font-bold text-amber-600 whitespace-nowrap">
                                {formatCheckoutPrice(option.cost)}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
        </RadioGroup>
    );
}
