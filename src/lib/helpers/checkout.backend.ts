// lib/helpers/checkout.client.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  notes: string | null;
  isPrimary: boolean;
}

export interface ShippingOption {
  courier: string;
  service: string;
  description: string;
  estimate: string;
  cost: number;
}

export interface ShippingCostData {
  origin: {
    city: string;
    province: string;
  };
  destination: {
    city: string;
    province: string;
  };
  weight: number;
  options: ShippingOption[];
}

export interface CreateOrderData {
  addressId: string;
  shippingCourier: string;
  shippingService: string;
  shippingDescription: string;
  shippingEstimate: string;
  shippingFee: number;
  paymentMethod: 'MANUAL_TRANSFER' | 'PAYMENT_GATEWAY';
  appliedDiscounts?: Array<{
    discountId: string;
    discountAmount: number;
  }>;
  totalDiscount?: number;
}

export interface OrderCreated {
  orderId: string;
  orderNumber: string;
}

/**
 * Get user addresses
 */
export async function getAddresses(): Promise<ApiResponse<Address[]>> {
  try {
    const res = await axios.get(`${BASE_URL}/checkout/addresses`, {
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = 'Gagal memuat alamat';

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
 * Calculate shipping cost
 */
export async function calculateShipping(
  addressId: string,
  weight: number
): Promise<ApiResponse<ShippingCostData>> {
  try {
    const res = await axios.post(
      `${BASE_URL}/checkout/shipping-cost`,
      {
        addressId,
        weight,
      },
      {
        withCredentials: true,
      }
    );

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = 'Gagal menghitung ongkos kirim';

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
 * Create order
 */
export async function createOrder(
  data: CreateOrderData
): Promise<ApiResponse<OrderCreated>> {
  try {
    const res = await axios.post(
      `${BASE_URL}/checkout/create-order`,
      data,
      {
        withCredentials: true,
      }
    );

    return {
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (err: unknown) {
    let message = 'Gagal membuat order';

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
 * Format price to IDR
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}