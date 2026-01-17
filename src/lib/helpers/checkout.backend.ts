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
  estimate?: string; // Legacy field (optional)
  etd: string; // Estimated time of delivery
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
 * Format price to IDR
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}