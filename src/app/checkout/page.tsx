'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Truck,
  CreditCard,
  Loader2,
  ChevronRight,
  Package,
  AlertCircle,
  Check,
  Building2,
  Plus,
  Pencil,
  User,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getCart, formatPrice, formatWeight, type Cart } from '@/lib/helpers/cart.backend';
import {
  getAddresses,
  calculateShipping,
  createOrder,
  type Address,
  type ShippingOption,
  formatPrice as formatCheckoutPrice,
} from '@/lib/helpers/checkout.backend';

import { createAddress, setPrimaryAddress } from '@/lib/helpers/address.backend';
import { AddressModal } from '@/components/address/address-modal';

export default function CheckoutPage() {
  const router = useRouter();
  
  // Cart state
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingCart, setLoadingCart] = useState(true);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);

  // Shipping state
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'MANUAL_TRANSFER' | 'PAYMENT_GATEWAY'>('MANUAL_TRANSFER');

  // Order state
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddress && cart) {
      fetchShipping();
      setIsChangingAddress(false);
    }
  }, [selectedAddress]);

  const fetchCart = async () => {
    const response = await getCart();

    if (response.success && response.data) {
      setCart(response.data);
    } else {
      toast.error('Keranjang kosong');
      router.push('/cart');
    }

    setLoadingCart(false);
  };

  const fetchAddresses = async () => {
    const response = await getAddresses();

    if (response.success && response.data) {
      setAddresses(response.data);
      
      if (!selectedAddress) {
        const primary = response.data.find((addr) => addr.isPrimary);
        if (primary) {
          setSelectedAddress(primary.id);
        } else if (response.data.length > 0) {
          setSelectedAddress(response.data[0].id);
        }
      }
    }

    setLoadingAddresses(false);
  };

  const handleSaveAddress = async (data: Partial<Address>) => {
    const res = await createAddress(data);
    if (res.success) {
      toast.success('Alamat berhasil ditambahkan');
      fetchAddresses(); // Refresh list
    } else {
      toast.error(res.message || 'Gagal menambahkan alamat');
    }
  };

  const handleAddressSelection = async (value: string) => {
    setSelectedAddress(value);
    
    // Auto set as primary when selected as per user request
    const res = await setPrimaryAddress(value);
    if (res.success) {
      toast.success('Alamat otomatis dijadikan utama');
      // We don't block the UI here, just silently update the list
      fetchAddresses();
    }
  };

  const fetchShipping = async () => {
    if (!cart || !selectedAddress) return;

    setLoadingShipping(true);
    setSelectedShipping(null);

    const response = await calculateShipping(
      selectedAddress,
      cart.summary.estimatedWeight
    );

    if (response.success && response.data) {
      setShippingOptions(response.data.options);
      
      if (response.data.options.length > 0) {
        setSelectedShipping(response.data.options[0]);
      }
    } else {
      toast.error(response.message || 'Gagal menghitung ongkir');
    }

    setLoadingShipping(false);
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('Pilih alamat pengiriman');
      return;
    }

    if (!selectedShipping) {
      toast.error('Pilih metode pengiriman');
      return;
    }

    setCreatingOrder(true);

    const response = await createOrder({
      addressId: selectedAddress,
      shippingCourier: selectedShipping.courier,
      shippingService: selectedShipping.service,
      shippingDescription: selectedShipping.description,
      shippingEstimate: selectedShipping.estimate,
      shippingFee: selectedShipping.cost,
      paymentMethod,
    });

    if (response.success && response.data) {
      toast.success('Order berhasil dibuat!');
      router.push(`/order/${response.data.orderId}`);
    } else {
      toast.error(response.message || 'Gagal membuat order');
    }

    setCreatingOrder(false);
  };

  const getTotal = () => {
    if (!cart || !selectedShipping) return 0;
    return cart.summary.subtotal + selectedShipping.cost;
  };

  const selectedAddressData = addresses.find((addr) => addr.id === selectedAddress);

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat checkout...</h3>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-amber-50 text-sm md:text-base">
            Selesaikan pesanan Anda
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
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
                      onClick={() => setIsChangingAddress(true)}
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
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">Belum ada alamat tersimpan</p>
                    <Button 
                      onClick={() => setShowAddressModal(true)} 
                      className="bg-gradient-to-r from-amber-500 to-orange-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Alamat
                    </Button>
                  </div>
                ) : (
                  <>
                    {!isChangingAddress && selectedAddressData ? (
                      // Selected Address - Compact View
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <MapPin className="h-6 w-6 text-amber-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="font-bold text-lg text-gray-900">
                                {selectedAddressData.label}
                              </h3>
                              {selectedAddressData.isPrimary && (
                                <Badge className="bg-amber-500 text-xs">Utama</Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-800">
                                  {selectedAddressData.recipientName}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">
                                  {selectedAddressData.phone}
                                </span>
                              </div>
                              
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-700">
                                  <p className="line-clamp-2 font-medium">{selectedAddressData.street || selectedAddressData.addressLine}</p>
                                  <p className="text-gray-600 mt-0.5">
                                    {[
                                      selectedAddressData.district, 
                                      selectedAddressData.city, 
                                      selectedAddressData.province
                                    ].filter(Boolean).join(', ')} {selectedAddressData.postalCode}
                                  </p>
                                </div>
                              </div>
                              
                              {selectedAddressData.notes && (
                                <div className="mt-3 pt-3 border-t border-amber-200">
                                  <p className="text-xs text-gray-600 italic">
                                    Catatan: {selectedAddressData.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Address Selection List
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">Pilih alamat pengiriman:</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowAddressModal(true)}
                            className="border-dashed border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah
                          </Button>
                        </div>
                        
                        <RadioGroup value={selectedAddress} onValueChange={handleAddressSelection}>
                          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                            {addresses.map((address) => (
                              <label
                                key={address.id}
                                htmlFor={address.id}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                  selectedAddress === address.id
                                    ? 'border-amber-500 bg-amber-50'
                                    : 'border-gray-200 hover:border-amber-300'
                                }`}
                              >
                                <RadioGroupItem 
                                  value={address.id} 
                                  id={address.id} 
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-gray-800">
                                      {address.label}
                                    </span>
                                    {address.isPrimary && (
                                      <Badge className="bg-amber-500 text-xs shadow-sm">Utama</Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm font-medium text-gray-800 mb-1">
                                    {address.recipientName} • {address.phone}
                                  </p>
                                  
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {address.street || address.addressLine}
                                  </p>
                                  
                                  <p className="text-sm text-gray-600">
                                    {[
                                      address.district, 
                                      address.city, 
                                      address.province
                                    ].filter(Boolean).join(', ')} {address.postalCode}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </RadioGroup>
                        
                        {selectedAddress && (
                          <div className="pt-2 flex justify-end">
                            <Button 
                              onClick={() => setIsChangingAddress(false)}
                              className="bg-amber-600 hover:bg-amber-700"
                            >
                              Gunakan Alamat Ini
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="shadow-lg border-0 overflow-hidden py-0 gap-0">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Truck className="h-5 w-5 text-amber-600" />
                  Metode Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedAddress ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Pilih alamat pengiriman terlebih dahulu</p>
                  </div>
                ) : loadingShipping ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-3" />
                    <span className="text-gray-600">Menghitung ongkir...</span>
                  </div>
                ) : shippingOptions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Tidak ada opsi pengiriman tersedia</p>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedShipping?.service || ''}
                    onValueChange={(value) => {
                      const option = shippingOptions.find((opt) => opt.service === value);
                      setSelectedShipping(option || null);
                    }}
                  >
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={`${option.courier}-${option.service}`}
                          htmlFor={option.service}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedShipping?.service === option.service
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
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-lg border-0 overflow-hidden py-0 gap-0">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="space-y-3">
                    {/* Manual Transfer */}
                    <label
                      htmlFor="manual"
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === 'MANUAL_TRANSFER'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <RadioGroupItem value="MANUAL_TRANSFER" id="manual" />
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
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
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl border-0 overflow-hidden py-0 gap-0">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b py-4">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Package className="h-5 w-5 text-amber-600" />
                    Ringkasan Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Items */}
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                          {formatCheckoutPrice(getTotal())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCreateOrder}
                    disabled={!selectedAddress || !selectedShipping || creatingOrder}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg h-14 text-lg"
                  >
                    {creatingOrder ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Buat Pesanan
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <Link href="/cart">
                    <Button variant="outline" className="w-full mt-3 border-amber-500 text-amber-600 hover:bg-amber-50">
                      Kembali ke Keranjang
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
}