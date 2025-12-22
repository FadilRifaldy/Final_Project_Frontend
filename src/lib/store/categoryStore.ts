import { create } from "zustand";
import { ICategory } from "@/types/category";
import getCategories, {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../helpers/categories.backend";

interface CategoryState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (name: string, description?: string) => Promise<void>;
  updateCategory: (
    id: string,
    name: string,
    description?: string
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const categories = await getCategories();
      set({ categories: categories, loading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch categories";
      set({ error: message, loading: false });
    }
  },

  addCategory: async (name: string, description?: string) => {
    // Mulai loading dan clear error
    set({ loading: true, error: null });

    try {
      // Panggil helper API, asumsi return 1 ICategory
      const newCategory = await createCategory(name, description ?? "");
      set((state) => ({
        categories: [...state.categories, newCategory], // newCategory pasti ICategory valid
        loading: false,
      }));
    } catch (error) {
      // Kalau API lempar error, simpan pesan di state.error
      const message =
        error instanceof Error ? error.message : "Failed to add category";

      set({
        error: message,
        loading: false,
      });
    }
  },

  updateCategory: async (id: string, name: string, description?: string) => {
    set({ loading: true, error: null });

    try {
      const updatedCategory = await updateCategory(id, name, description ?? "");
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? updatedCategory : cat
        ),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update category";
      set({
        error: message,
        loading: false,
      });
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete category";
      set({
        error: message,
        loading: false,
      });
    }
  },
}));
