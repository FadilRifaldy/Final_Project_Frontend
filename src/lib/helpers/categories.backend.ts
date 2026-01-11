import axios from "axios";
import api from "../api/axios";
import { ApiResponse } from "@/types/api";
import { ICategory } from "@/types/category";

/**
 * ============================================================================
 * CATEGORY API SERVICE
 * Consolidated service untuk semua operasi category (Public & Admin)
 * ============================================================================
 */

// ============================================================================
// PUBLIC FUNCTIONS - Untuk Landing Page & User-facing features
// ============================================================================

/**
 * Get all categories (Public)
 * Digunakan untuk landing page, category browsing, dll
 * @returns Promise dengan array of categories
 */
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

/**
 * Get single category by ID (Public)
 * Digunakan untuk category detail page
 * @param id - Category ID
 * @returns Promise dengan single category
 */
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

/**
 * Create new category (Admin Only)
 * @param name - Category name
 * @param description - Category description (optional)
 * @returns Promise dengan created category
 */
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

/**
 * Update existing category (Admin Only)
 * @param id - Category ID
 * @param name - New category name
 * @param description - New category description (optional)
 * @returns Promise dengan updated category
 */
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

/**
 * Delete category (Admin Only)
 * Soft delete - sets deletedAt timestamp
 * @param id - Category ID
 * @returns Promise dengan deleted category
 */
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

/**
 * Generate URL-friendly slug from category name
 * @param name - Category name
 * @returns Slugified string
 * @example slugify("Dairy & Eggs") => "dairy-eggs"
 */
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

/**
 * @deprecated Use getAllCategories() instead
 */
export default getAllCategories;
