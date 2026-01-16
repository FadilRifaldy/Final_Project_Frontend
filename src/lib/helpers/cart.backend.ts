// lib/helpers/cart.backend.ts
import axios from 'axios';
import api from '@/lib/api/axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CartItemVariant {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  color: string | null;
  size: string | null;
  weight: number;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  primaryImage: string | null;
  availableStock: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  priceAtAdd: number;
  variant: CartItemVariant;
  subtotal: number;
}

export interface CartSummary {
  subtotal: number;
  totalItems: number;
  totalQuantity: number;
  estimatedWeight: number;
}

export interface Cart {
  id: string;
  store: {
    id: string;
    name: string;
    city: string;
    address: string;
  };
  items: CartItem[];
  summary: CartSummary;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user's cart
 */
export async function getCart(): Promise<ApiResponse<Cart>> {
  try {
    const res = await api.get('/cart');

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = 'Gagal memuat keranjang';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  productVariantId: string,
  storeId: string,
  quantity: number = 1
): Promise<ApiResponse<{ totalItems: number; totalQuantity: number }>> {
  try {
    const res = await api.post('/cart', {
      productVariantId,
      storeId,
      quantity,
    });

    return {
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (err: unknown) {
    let message = 'Gagal menambahkan ke keranjang';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<
  ApiResponse<{
    totalItems: number;
    totalQuantity: number;
    subtotal: number;
  }>
> {
  try {
    const res = await api.put(`/cart/${itemId}`, { quantity });

    return {
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (err: unknown) {
    let message = 'Gagal memperbarui jumlah';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  itemId: string
): Promise<
  ApiResponse<{
    totalItems: number;
    totalQuantity: number;
    subtotal: number;
  }>
> {
  try {
    const res = await api.delete(`/cart/${itemId}`);

    return {
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (err: unknown) {
    let message = 'Gagal menghapus item';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

/**
 * Clear all items from cart
 */
export async function clearCart(): Promise<ApiResponse<null>> {
  try {
    const res = await api.delete('/cart');

    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (err: unknown) {
    let message = 'Gagal mengosongkan keranjang';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

/**
 * Validate cart before checkout
 */
export async function validateCart(): Promise<
  ApiResponse<{
    isValid: boolean;
    summary?: CartSummary;
  }>
> {
  try {
    const res = await api.post('/cart/validate', {});

    return {
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (err: unknown) {
    let message = 'Gagal memvalidasi keranjang';

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      data: {
        isValid: false,
      },
      message,
    };
  }
}

/**
 * Get cart item count (for header badge)
 */
export async function getCartCount(): Promise<
  ApiResponse<{
    totalItems: number;
    totalQuantity: number;
  }>
> {
  try {
    const res = await api.get('/cart');

    if (res.data.success && res.data.data) {
      return {
        success: true,
        data: {
          totalItems: res.data.data.summary.totalItems,
          totalQuantity: res.data.data.summary.totalQuantity,
        },
      };
    }

    return {
      success: true,
      data: {
        totalItems: 0,
        totalQuantity: 0,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      data: {
        totalItems: 0,
        totalQuantity: 0,
      },
      message: 'Gagal memuat jumlah item',
    };
  }
}

/**
 * Format price to IDR
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Format weight
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${grams} g`;
}