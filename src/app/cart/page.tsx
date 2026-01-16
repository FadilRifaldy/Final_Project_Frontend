'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  Loader2,
  ArrowRight,
  Store as StoreIcon,
  AlertTriangle,
  X,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getCart,
  updateCartItemQuantity as updateQuantityHelper,
  removeFromCart as removeItemHelper,
  clearCart as clearCartHelper,
  validateCart as validateCartHelper,
  formatPrice,
  formatWeight,
  type Cart,
} from '@/lib/helpers/cart.backend';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await getCart();
    
    if (response.success) {
      setCart(response.data || null);
    } else {
      toast.error(response.message || 'Gagal memuat keranjang');
    }
    
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));

    const response = await updateQuantityHelper(itemId, newQuantity);

    if (response.success) {
      await fetchCart();
      toast.success('Jumlah diperbarui');
    } else {
      toast.error(response.message || 'Gagal memperbarui jumlah');
    }

    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    const response = await removeItemHelper(itemId);

    if (response.success) {
      await fetchCart();
      toast.success('Item dihapus dari keranjang');
    } else {
      toast.error(response.message || 'Gagal menghapus item');
    }

    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleClearCart = async () => {
    if (!confirm('Hapus semua item dari keranjang?')) return;

    setLoading(true);

    const response = await clearCartHelper();

    if (response.success) {
      setCart(null);
      toast.success('Keranjang dikosongkan');
    } else {
      toast.error(response.message || 'Gagal mengosongkan keranjang');
    }

    setLoading(false);
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    setLoading(true);

    const response = await validateCartHelper();

    if (response.success && response.data?.isValid) {
      router.push('/checkout');
    } else {
      toast.error(response.message || 'Gagal memvalidasi keranjang');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Memuat keranjang...
          </h3>
          <p className="text-gray-600">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-0">
              <CardContent className="py-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Keranjang Kosong
                </h2>
                <p className="text-gray-600 mb-6">
                  Belum ada produk di keranjang Anda. Yuk mulai belanja!
                </p>
                <Link href="/browse">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Mulai Belanja
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Keranjang Belanja
              </h1>
              <p className="text-amber-50 text-sm md:text-base">
                {cart.summary.totalItems} item • {cart.summary.totalQuantity}{' '}
                produk
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                <p className="text-amber-50 text-sm mb-1">Total</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(cart.summary.subtotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Store Info */}
            <Card className="shadow-md border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <StoreIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {cart.store.name}
                    </h3>
                    <p className="text-sm text-gray-600">{cart.store.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleClearCart}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Kosongkan Keranjang
              </Button>
            </div>

            {/* Items List */}
            {cart.items.map((item) => {
              const isUpdating = updatingItems.has(item.id);
              const isOutOfStock = item.variant.availableStock === 0;
              const isLowStock =
                item.variant.availableStock < item.quantity &&
                item.variant.availableStock > 0;

              return (
                <Card
                  key={item.id}
                  className={`shadow-md border-0 transition-all ${
                    isUpdating ? 'opacity-50' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link href={`/browse/${item.variant.slug}`}>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex-shrink-0 group cursor-pointer">
                          {item.variant.primaryImage ? (
                            <img
                              src={item.variant.primaryImage}
                              alt={item.variant.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex-1">
                            <Link href={`/browse/${item.variant.slug}`}>
                              <h3 className="font-semibold text-gray-800 hover:text-amber-600 transition-colors line-clamp-2 mb-1">
                                {item.variant.name}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {item.variant.color && (
                                <Badge variant="outline" className="text-xs">
                                  {item.variant.color}
                                </Badge>
                              )}
                              {item.variant.size && (
                                <Badge variant="outline" className="text-xs">
                                  {item.variant.size}
                                </Badge>
                              )}
                              <Badge className="bg-blue-500 text-xs">
                                {item.variant.product.category.name}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                            disabled={isUpdating}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Stock Warning */}
                        {(isOutOfStock || isLowStock) && (
                          <div className="mb-3">
                            <div
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                isOutOfStock
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-orange-50 text-orange-700'
                              }`}
                            >
                              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm font-medium">
                                {isOutOfStock
                                  ? 'Stok habis'
                                  : `Stok tersisa ${item.variant.availableStock}`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Price & Quantity */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-lg font-bold text-amber-600">
                              {formatPrice(item.variant.price)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatWeight(item.variant.weight)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-100 rounded-xl">
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-l-xl hover:bg-gray-200"
                                disabled={isUpdating || item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <div className="w-12 text-center font-semibold text-gray-800">
                                {item.quantity}
                              </div>
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-r-xl hover:bg-gray-200"
                                disabled={
                                  isUpdating ||
                                  item.quantity >= item.variant.availableStock
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="font-bold text-gray-800">
                                {formatPrice(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Ringkasan Belanja
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cart.summary.totalQuantity} item)</span>
                      <span className="font-semibold">
                        {formatPrice(cart.summary.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Estimasi Berat</span>
                      <span className="font-semibold">
                        {formatWeight(cart.summary.estimatedWeight)}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-amber-600">
                          {formatPrice(cart.summary.subtotal)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-right">
                        Belum termasuk ongkir
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg h-14 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Lanjut ke Checkout
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <Link href="/browse">
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-amber-500 text-amber-600 hover:bg-amber-50"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Lanjut Belanja
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}