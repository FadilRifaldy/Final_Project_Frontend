import axios from "axios";
import api from "../api/axios";
import { IProduct, IProductImage } from "@/types/product";

// Pagination response type
interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ProductsResponse {
  data: IProduct[];
  pagination: PaginationMeta;
}

export default async function getProducts(
  page: number = 1,
  limit: number = 10
): Promise<ProductsResponse> {
  try {
    const response = await api.get("/api/products", {
      params: { page, limit }
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to get products";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}

export async function createProduct(
  name: string,
  description: string,
  categoryId: string,
  images?: string[]
): Promise<IProduct> {
  try {
    const response = await api.post("/api/products", {
      name,
      description,
      categoryId,
      images: images || [],
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to create product";
      throw new Error(message);
    }

    throw new Error("Unexpected error occurred");
  }
}

export async function updateProduct(
  id: string,
  name: string,
  description: string,
  categoryId: string,
  images?: string[],
  isActive?: boolean
): Promise<IProduct> {
  try {
    const response = await api.put(`/api/products/${id}`, {
      name,
      description,
      categoryId,
      images: images || [],
      isActive,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to update product";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/api/products/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to delete product";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}

export async function uploadProductImages(
  productId: string,
  files: File[]
): Promise<IProductImage[]> {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });
    const response = await api.post(
      `/api/products/${productId}/images`,
      formData
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to upload product images";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}

