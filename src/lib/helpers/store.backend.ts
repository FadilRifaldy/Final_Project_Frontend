import axios from "axios";
import { ApiResponse } from "@/types/api";
import { IStore, IStoreProduct } from "@/types/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createStore(
  data: Partial<IStore>
): Promise<ApiResponse<IStore>> {
  try {
    const res = await axios.post(`${BASE_URL}/stores/create`, data, {
      withCredentials: true,
    });

    return {
      success: res.data.success,  
      data: res.data.data,          
    };
  } catch (err: unknown) {
    let message = "Gagal menambahkan store";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

export async function getStores(): Promise<ApiResponse<IStore[]>> {
  try {
    const res = await axios.get(`${BASE_URL}/stores`, {
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal mengambil data store";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

export async function getStoreById(
  id: string
): Promise<ApiResponse<IStore>> {
  try {
    const res = await axios.get(`${BASE_URL}/stores/${id}`, {
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal mengambil data store";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

export async function getStoreProducts(
  storeId: string,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<IStoreProduct[]>> {
  try {
    const res = await axios.get(`${BASE_URL}/stores/${storeId}/products`, {
      params: { page, limit },
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (err: unknown) {
    let message = "Gagal mengambil produk store";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

export async function updateStore(
  id: string,
  data: Partial<IStore>
): Promise<ApiResponse<IStore>> {
  try {
    const res = await axios.put(`${BASE_URL}/stores/update/${id}`, data, {
      withCredentials: true,
    });

    return {
      success: res.data.success,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal memperbarui store";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}

export async function deleteStore(
  id: string
): Promise<ApiResponse<null>> {
  try {
    const res = await axios.delete(`${BASE_URL}/stores/delete/${id}`, {
      withCredentials: true,
    });

    return {
      success: res.data.success || true,
      data: null,
    };
  } catch (err: unknown) {
    let message = "Gagal menghapus store";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return {
      success: false,
      message,
    };
  }
}