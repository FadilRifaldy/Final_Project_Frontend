import axios from "axios";
import api from "../api/axios";

export default async function getCategories() {
  try {
    const response = await api.get("/api/categories");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get categories",
      };
    }
    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
}

export async function slugify(name: string) {
  return name
    .toLowerCase() // jadi huruf kecil
    .trim() // buang spasi di pinggir
    .replace(/\s+/g, "-") // spasi di tengah jadi "-"
    .replace(/[^a-z0-9-]/g, ""); // buang karakter aneh
}

export async function createCategory(name: string, description: string) {
  try {
    const slug = await slugify(name);
    const response = await api.post("/api/categories", {
      name,
      description,
      slug,
    });
    return response.data.data; // 1 ICategory
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to create category";
      throw new Error(message); // <- lempar error
    }

    throw new Error("Unexpected error occurred");
  }
}

export async function updateCategory(
  id: string,
  name: string,
  description: string
) {
  try {
    const slug = await slugify(name);
    const response = await api.put(`/api/categories/${id}`, {
      name,
      description,
      slug,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to update category";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}

export async function deleteCategory(id: string) {
  try {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to delete category";
      throw new Error(message);
    }
    throw new Error("Unexpected error occurred");
  }
}
