import { ICreateProductVariant, IProductVariant } from "@/types/product";
import { create } from "zustand";
import { getProductVariant, createProductVariant } from "../helpers/productVariant.backend";

interface VariantState {
    variants: IProductVariant[];
    loading: boolean;
    error: string | null;

    // actionss
    fetchVariant: (productId: string) => Promise<void>;
    addVariant: (
        productId: string,
        data: ICreateProductVariant
    ) => Promise<void>;
}

export const useVariantStore = create<VariantState>((set) => ({
    variants: [],
    loading: false,
    error: null,

    fetchVariant: async (productId: string) => {
        set({ loading: true, error: null })
        try {
            const variants = await getProductVariant(productId);
            set({ variants: variants, loading: false })

        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to fetch variant";
            set({ error: message, loading: false })
        }
    },
    addVariant: async (productId: string, data: ICreateProductVariant) => {
        set({ loading: true, error: null })
        try {
            const variant = await createProductVariant(productId, data);
            set((state) => ({
                variants: [...state.variants, variant],
                loading: false
            }))
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to add variant";
            set({ error: message, loading: false })
        }
    },
}))