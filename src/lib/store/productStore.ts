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

  // Actions
  fetchProducts: () => Promise<void>;
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
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });

    try {
      const products = await getProducts();
      set({ products: products, loading: false });
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
}));
