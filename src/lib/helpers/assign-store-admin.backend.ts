import axios from "axios";
import { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IStoreAdmin {
  id: string;
  name: string;
  email: string;
  userStoreId: string | null;
  storeId: string | null;
  store?: {
    id: string;
    name: string;
    city: string;
    province: string;
  } | null;
}

export interface IAvailableStore {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
}

/**
 * Get all store admins
 */
export async function getStoreAdmins(): Promise<ApiResponse<IStoreAdmin[]>> {
  try {
    const res = await axios.get(`${BASE_URL}/assign-store-admin`, {
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal mengambil data store admins";

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
 * Get all available stores
 */
export async function getAvailableStores(): Promise<ApiResponse<IAvailableStore[]>> {
  try {
    const res = await axios.get(`${BASE_URL}/assign-store-admin/available-stores`, {
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal mengambil data stores";

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
 * Assign store to admin
 */
export async function assignStoreToAdmin(
  userId: string,
  storeId: string
): Promise<ApiResponse<IStoreAdmin>> {
  try {
    const res = await axios.put(
      `${BASE_URL}/assign-store-admin/${userId}`,
      { storeId },
      { withCredentials: true }
    );

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal assign store ke admin";

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
 * Unassign store from admin
 */
export async function unassignStoreFromAdmin(
  userId: string
): Promise<ApiResponse<IStoreAdmin>> {
  try {
    const res = await axios.delete(
      `${BASE_URL}/assign-store-admin/${userId}`,
      { withCredentials: true }
    );

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal unassign store dari admin";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}