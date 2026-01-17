import axios from "axios";
import api from "../api/axios";
import { ApiResponse } from "@/types/api";
import { ICategory } from "@/types/category";

// ============================================================================
// PUBLIC FUNCTIONS - Untuk Landing Page & User-facing features
// ============================================================================

export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await api.get<ApiResponse<ICategory[]>>("/api/categories");

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch categories");
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  try {
    const response = await api.get<ApiResponse<ICategory>>(`/api/categories/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to fetch category");
  } catch (error: any) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

// ============================================================================
// ADMIN FUNCTIONS - Untuk Admin Panel (Requires Authentication)
// ============================================================================

export const createCategory = async (
  name: string,
  description?: string
): Promise<ICategory> => {
  try {
    const slug = slugify(name);
    const response = await api.post<ApiResponse<ICategory>>("/api/categories", {
      name,
      description: description || null,
      slug,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to create category");
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to create category";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
};

export const updateCategory = async (
  id: string,
  name: string,
  description?: string
): Promise<ICategory> => {
  try {
    const slug = slugify(name);
    const response = await api.put<ApiResponse<ICategory>>(`/api/categories/${id}`, {
      name,
      description: description || null,
      slug,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to update category");
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to update category";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
};

export const deleteCategory = async (id: string): Promise<ICategory> => {
  try {
    const response = await api.delete<ApiResponse<ICategory>>(`/api/categories/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to delete category");
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to delete category";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function slugify(name: string): string {
  return name
    .toLowerCase()           // Convert to lowercase
    .trim()                  // Remove leading/trailing spaces
    .replace(/\s+/g, "-")    // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove special characters
}

// ============================================================================
// LEGACY EXPORTS - For backward compatibility
// ============================================================================

export default getAllCategories;
