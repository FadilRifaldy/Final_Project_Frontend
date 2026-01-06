import axios from "axios";
import { ApiResponse } from "@/types/api";
import { IStore } from "@/types/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createStore(
  data: Partial<IStore>
): Promise<ApiResponse<IStore>> {
  try {
    const res = await axios.post(`${BASE_URL}/stores/create-store`, data, {
      withCredentials: true,
    });

    return {
      success: true,
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
    const res = await axios.get(`${BASE_URL}/stores/get-stores`, {
      withCredentials: true,
    });

    return {
      success: true,
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
