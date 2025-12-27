import { create } from "zustand";
import { IProduct } from "@/types/product";
import getProducts, {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../helpers/product.backend";

interface ProductState {
  products: IProduct[];
  loading: boolean;
  error: string | null;

  // Server-side pagination state
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;      // From backend
  totalPages: number;      // From backend

  // Actions
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  addProduct: (
    name: string,
    description: string,
    categoryId: string,
    images?: string[]
  ) => Promise<void>;
  updateProduct: (
    id: string,
    name: string,
    description: string,
    categoryId: string,
    images?: string[],
    isActive?: boolean
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadProductImages: (productId: string, files: File[]) => Promise<void>;

  // Pagination actions
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (count: number) => void;
  resetPagination: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  // Server-side pagination initial state
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,

  fetchProducts: async (page?: number, limit?: number) => {
    set({ loading: true, error: null });

    const state = get();
    const currentPage = page || state.currentPage;
    const currentLimit = limit || state.itemsPerPage;

    try {
      const result = await getProducts(currentPage, currentLimit);
      set({
        products: result.data,
        currentPage: result.pagination.page,
        itemsPerPage: result.pagination.limit,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages,
        loading: false
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch products";
      set({ error: message, loading: false });
    }
  },

  addProduct: async (
    name: string,
    description: string,
    categoryId: string,
    images?: string[]
  ) => {
    set({ loading: true, error: null });

    try {
      const newProduct = await createProduct(
        name,
        description,
        categoryId,
        images
      );
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add product";

      set({
        error: message,
        loading: false,
      });
    }
  },

  updateProduct: async (
    id: string,
    name: string,
    description: string,
    categoryId: string,
    images?: string[],
    isActive?: boolean
  ) => {
    set({ loading: true, error: null });

    try {
      const updatedProduct = await updateProduct(
        id,
        name,
        description,
        categoryId,
        images,
        isActive
      );
      set((state) => ({
        products: state.products.map((prod) =>
          prod.id === id ? updatedProduct : prod
        ),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update product";
      set({
        error: message,
        loading: false,
      });
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((prod) => prod.id !== id),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete product";
      set({
        error: message,
        loading: false,
      });
    }
  },

  uploadProductImages: async (
    productId: string,
    files: File[]
  ) => {
    set({ loading: true, error: null });

    try {
      // Upload semua files sekaligus
      const uploadedImages = await uploadProductImages(productId, files);

      // Update product di state dengan images yang baru diupload
      set(state => ({
        products: state.products.map((prod) =>
          prod.id === productId
            ? { ...prod, images: [...prod.images, ...uploadedImages] }
            : prod
        ),
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload product images";
      set({
        error: message,
        loading: false,
      });
    }
  },

  // Server-side pagination actions implementation
  setPage: (page: number) => {
    const state = get();
    state.fetchProducts(page, state.itemsPerPage);
  },

  nextPage: () => {
    const state = get();
    if (state.currentPage < state.totalPages) {
      state.fetchProducts(state.currentPage + 1, state.itemsPerPage);
    }
  },

  prevPage: () => {
    const state = get();
    if (state.currentPage > 1) {
      state.fetchProducts(state.currentPage - 1, state.itemsPerPage);
    }
  },

  setItemsPerPage: (count: number) => {
    const state = get();
    state.fetchProducts(1, count); // Fetch page 1 with new limit
  },

  resetPagination: () => {
    const state = get();
    state.fetchProducts(1, state.itemsPerPage);
  },
}));
