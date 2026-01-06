import axios from "axios";
import { ApiResponse } from "@/types/api";
import { IStore } from "@/types/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createStore(
  data: Partial<IStore>
): Promise<ApiResponse<IStore>> {
  try {
    const res = await axios.post(`${BASE_URL}/stores`, data, {
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