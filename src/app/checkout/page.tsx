'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Truck,
  CreditCard,
  Loader2,
  ChevronRight,
  Package,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { getActiveDiscounts } from '@/lib/helpers/discounts.backend';

import { createAddress, setPrimaryAddress } from '@/lib/helpers/address.backend';
import { AddressModal } from '@/components/address/address-modal';
import { AddressSelectionCard } from '@/components/checkout/AddressSelectionCard';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingMethodCard } from '@/components/checkout/ShippingMethodCard';
import { PaymentMethodCard } from '@/components/checkout/PaymentMethodCard';

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

  // Discount state
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<any[]>([]);
  const [enabledDiscounts, setEnabledDiscounts] = useState<Set<string>>(new Set()); // Track which discounts are enabled
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);

  // Order state
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    fetchDiscounts();
  }, []);

  useEffect(() => {
    if (selectedAddress && cart) {
      fetchShipping();
      setIsChangingAddress(false);
    }
  }, [selectedAddress]);

  // Calculate discounts when cart or active discounts change
  useEffect(() => {
    if (cart && activeDiscounts.length > 0) {
      calculateDiscounts();
    }
  }, [cart, activeDiscounts]);

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

  const fetchDiscounts = async () => {
    try {
      const discounts = await getActiveDiscounts();
      setActiveDiscounts(discounts);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
    } finally {
      setLoadingDiscounts(false);
    }
  };

  const calculateDiscounts = () => {
    if (!cart) return;

    let totalDiscountAmount = 0;
    const applied: any[] = [];

    // 1. Check PRODUCT discounts
    cart.items.forEach((item) => {
      const productDiscount = activeDiscounts.find((d) =>
        d.type === 'PRODUCT' &&
        d.productDiscounts?.some((pd: any) => pd.productVariantId === item.variant.id)
      );

      if (productDiscount) {
        let itemDiscount = 0;
        if (productDiscount.discountValueType === 'PERCENTAGE') {
          itemDiscount = (Number(item.variant.price) * item.quantity * Number(productDiscount.discountValue)) / 100;
        } else {
          itemDiscount = Number(productDiscount.discountValue) * item.quantity;
        }

        // Apply max discount if exists
        if (productDiscount.maxDiscount && itemDiscount > Number(productDiscount.maxDiscount)) {
          itemDiscount = Number(productDiscount.maxDiscount);
        }

        totalDiscountAmount += itemDiscount;

        if (!applied.find(a => a.id === productDiscount.id)) {
          applied.push({
            ...productDiscount,
            appliedAmount: itemDiscount,
          });
        } else {
          const existing = applied.find(a => a.id === productDiscount.id);
          if (existing) existing.appliedAmount += itemDiscount;
        }
      }
    });

    // 2. Check CART discount (min purchase)
    const cartDiscount = activeDiscounts.find((d) =>
      d.type === 'CART' &&
      cart.summary.subtotal >= Number(d.minPurchase || 0)
    );

    if (cartDiscount) {
      let cartDiscountAmount = 0;
      if (cartDiscount.discountValueType === 'PERCENTAGE') {
        cartDiscountAmount = (cart.summary.subtotal * Number(cartDiscount.discountValue)) / 100;
      } else {
        cartDiscountAmount = Number(cartDiscount.discountValue);
      }

      // Apply max discount if exists
      if (cartDiscount.maxDiscount && cartDiscountAmount > Number(cartDiscount.maxDiscount)) {
        cartDiscountAmount = Number(cartDiscount.maxDiscount);
      }

      totalDiscountAmount += cartDiscountAmount;
      applied.push({
        ...cartDiscount,
        appliedAmount: cartDiscountAmount,
      });
    }

    // 3. Check BOGO discount
    cart.items.forEach((item) => {
      const bogoDiscount = activeDiscounts.find((d) =>
        d.type === 'BUY_ONE_GET_ONE' &&
        d.productDiscounts?.some((pd: any) => pd.productVariantId === item.variant.id)
      );

      if (bogoDiscount && bogoDiscount.buyQuantity && bogoDiscount.getQuantity) {
        const totalQuantity = item.quantity;
        const freeItems = Math.floor(totalQuantity / (bogoDiscount.buyQuantity + bogoDiscount.getQuantity)) * bogoDiscount.getQuantity;
        const bogoDiscountAmount = freeItems * Number(item.variant.price);

        totalDiscountAmount += bogoDiscountAmount;

        if (!applied.find(a => a.id === bogoDiscount.id)) {
          applied.push({
            ...bogoDiscount,
            appliedAmount: bogoDiscountAmount,
          });
        } else {
          const existing = applied.find(a => a.id === bogoDiscount.id);
          if (existing) existing.appliedAmount += bogoDiscountAmount;
        }
      }
    });

    setTotalDiscount(totalDiscountAmount);
    setAppliedDiscounts(applied);

    // Auto-enable all discounts by default
    if (applied.length > 0 && enabledDiscounts.size === 0) {
      setEnabledDiscounts(new Set(applied.map(d => d.id)));
    }
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

  const handleToggleDiscount = (discountId: string, enabled: boolean) => {
    const newEnabled = new Set(enabledDiscounts);
    if (enabled) {
      newEnabled.add(discountId);
    } else {
      newEnabled.delete(discountId);
    }
    setEnabledDiscounts(newEnabled);
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
      appliedDiscounts: appliedDiscounts
        .filter(d => enabledDiscounts.has(d.id)) // Only send enabled discounts
        .map(d => ({
          discountId: d.id,
          discountAmount: d.appliedAmount,
        })),
      totalDiscount: appliedDiscounts
        .filter(d => enabledDiscounts.has(d.id))
        .reduce((sum, d) => sum + d.appliedAmount, 0),
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

    const subtotal = Number(cart.summary?.subtotal) || 0;

    // Only count enabled discounts
    const enabledDiscountAmount = appliedDiscounts
      .filter(d => enabledDiscounts.has(d.id))
      .reduce((sum, d) => sum + d.appliedAmount, 0);

    const shipping = Number(selectedShipping.cost) || 0;

    const total = subtotal - enabledDiscountAmount + shipping;

    // Debug logging
    console.log('🧮 Checkout Total Calculation:', {
      subtotal,
      enabledDiscountAmount,
      shipping,
      total,
      enabledDiscounts: Array.from(enabledDiscounts),
    });

    return total;
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
            <AddressSelectionCard
              addresses={addresses}
              selectedAddress={selectedAddress}
              isChangingAddress={isChangingAddress}
              loadingAddresses={loadingAddresses}
              onSelectAddress={handleAddressSelection}
              onChangeAddress={() => setIsChangingAddress(true)}
              onConfirmAddress={() => setIsChangingAddress(false)}
              onAddAddress={() => setShowAddressModal(true)}
            />

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
                  <ShippingMethodCard
                    options={shippingOptions}
                    selectedService={selectedShipping?.service || ''}
                    onSelect={(service) => {
                      const option = shippingOptions.find((opt) => opt.service === service);
                      setSelectedShipping(option || null);
                    }}
                  />
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
                <PaymentMethodCard
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                />
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
                  <OrderSummary
                    cart={cart}
                    selectedShipping={selectedShipping}
                    appliedDiscounts={appliedDiscounts}
                    enabledDiscounts={enabledDiscounts}
                    onToggleDiscount={handleToggleDiscount}
                    total={getTotal()}
                  />

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