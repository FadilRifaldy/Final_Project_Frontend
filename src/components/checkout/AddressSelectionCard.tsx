import { MapPin, Loader2, AlertCircle, Plus, Pencil, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import type { Address } from '@/lib/helpers/checkout.backend';

interface AddressSelectionCardProps {
    addresses: Address[];
    selectedAddress: string;
    isChangingAddress: boolean;
    loadingAddresses: boolean;
    onSelectAddress: (addressId: string) => void;
    onChangeAddress: () => void;
    onConfirmAddress: () => void;
    onAddAddress: () => void;
}

export function AddressSelectionCard({
    addresses,
    selectedAddress,
    isChangingAddress,
    loadingAddresses,
    onSelectAddress,
    onChangeAddress,
    onConfirmAddress,
    onAddAddress,
}: AddressSelectionCardProps) {
    const selectedAddressData = addresses.find((addr) => addr.id === selectedAddress);

    return (
        <Card className="shadow-lg border-0 overflow-hidden py-0 gap-0">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b py-4 flex flex-row items-center justify-between">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <MapPin className="h-5 w-5 text-amber-600" />
                        Alamat Pengiriman
                    </CardTitle>
                    {selectedAddressData && !isChangingAddress && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onChangeAddress}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                            <Pencil className="w-4 h-4 mr-2" />
                            Ganti
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {loadingAddresses ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    </div>
                ) : addresses.length === 0 ? (
                    <EmptyAddressState onAddAddress={onAddAddress} />
                ) : !isChangingAddress && selectedAddressData ? (
                    <SelectedAddressView address={selectedAddressData} />
                ) : (
                    <AddressSelectionList
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        onSelectAddress={onSelectAddress}
                        onConfirmAddress={onConfirmAddress}
                        onAddAddress={onAddAddress}
                    />
                )}
            </CardContent>
        </Card>
    );
}

function EmptyAddressState({ onAddAddress }: { onAddAddress: () => void }) {
    return (
        <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">Belum ada alamat tersimpan</p>
            <Button onClick={onAddAddress} className="bg-gradient-to-r from-amber-500 to-orange-500">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Alamat
            </Button>
        </div>
    );
}

function SelectedAddressView({ address }: { address: Address }) {
    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{address.label}</h3>
                        {address.isPrimary && <Badge className="bg-amber-500 text-xs">Utama</Badge>}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-800">{address.recipientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{address.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                            <div className="text-gray-700">
                                <p className="line-clamp-2 font-medium">{address.street || address.addressLine}</p>
                                <p className="text-gray-600 mt-0.5">
                                    {[address.district, address.city, address.province].filter(Boolean).join(', ')}{' '}
                                    {address.postalCode}
                                </p>
                            </div>
                        </div>
                        {address.notes && (
                            <div className="mt-3 pt-3 border-t border-amber-200">
                                <p className="text-xs text-gray-600 italic">Catatan: {address.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AddressSelectionList({
    addresses,
    selectedAddress,
    onSelectAddress,
    onConfirmAddress,
    onAddAddress,
}: {
    addresses: Address[];
    selectedAddress: string;
    onSelectAddress: (addressId: string) => void;
    onConfirmAddress: () => void;
    onAddAddress: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">Pilih alamat pengiriman:</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddAddress}
                    className="border-dashed border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                </Button>
            </div>
            <RadioGroup value={selectedAddress} onValueChange={onSelectAddress}>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                    {addresses.map((address) => (
                        <label
                            key={address.id}
                            htmlFor={address.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddress === address.id
                                    ? 'border-amber-500 bg-amber-50'
                                    : 'border-gray-200 hover:border-amber-300'
                                }`}
                        >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-gray-800">{address.label}</span>
                                    {address.isPrimary && <Badge className="bg-amber-500 text-xs shadow-sm">Utama</Badge>}
                                </div>
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                    {address.recipientName} • {address.phone}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-1">{address.street || address.addressLine}</p>
                                <p className="text-sm text-gray-600">
                                    {[address.district, address.city, address.province].filter(Boolean).join(', ')}{' '}
                                    {address.postalCode}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>
            </RadioGroup>
            {selectedAddress && (
                <div className="pt-2 flex justify-end">
                    <Button onClick={onConfirmAddress} className="bg-amber-600 hover:bg-amber-700">
                        Gunakan Alamat Ini
                    </Button>
                </div>
            )}
        </div>
    );
}
