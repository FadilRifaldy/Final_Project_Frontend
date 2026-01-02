import axios from "axios";
import { ApiResponse } from "@/types/api";
import { IAddress } from "@/types/address";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAddresses(): Promise<ApiResponse<IAddress[]>> {
  try {
    const res = await axios.get(`${BASE_URL}/addresses`, {
      withCredentials: true,
    });

    return {
      success: true,
      data: res.data.data,
    };
  } catch (err: unknown) {
    let message = "Gagal mendapatkan alamat";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return { success: false, message };
  }
}

export async function createAddress(
  data: Partial<IAddress>
): Promise<ApiResponse<IAddress>> {
  try {
    const res = await axios.post(`${BASE_URL}/addresses`, data, {
      withCredentials: true,
    });
    return { success: true, data: res.data.data };
  } catch (err: unknown) {
    let message = "Gagal menambahkan alamat";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return { success: false, message };
  }
}

export async function updateAddress(
  id: string,
  data: Partial<IAddress>
): Promise<ApiResponse<IAddress>> {
  try {
    const res = await axios.put(`${BASE_URL}/addresses/${id}`, data, {
      withCredentials: true,
    });
    return { success: true, data: res.data.data };
  } catch (err: unknown) {
    let message = "Gagal memperbarui alamat";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return { success: false, message };
  }
}

export async function deleteAddress(id: string): Promise<ApiResponse<null>> {
  try {
    await axios.delete(`${BASE_URL}/addresses/${id}`, {
      withCredentials: true,
    });
    return { success: true };
  } catch (err: unknown) {
    let message = "Gagal menghapus alamat";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return { success: false, message };
  }
}

export async function setPrimaryAddress(
  id: string
): Promise<ApiResponse<IAddress>> {
  try {
    const res = await axios.patch(
      `${BASE_URL}/addresses/${id}/primary`,
      {},
      { withCredentials: true }
    );
    return { success: true };
  } catch (err: unknown) {
    let message = "Gagal mengatur alamat utama";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    }

    return { success: false, message };
  }
}
