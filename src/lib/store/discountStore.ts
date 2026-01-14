import { create } from 'zustand';
import { Discount, CreateDiscountInput, UpdateDiscountInput } from '@/types/discount';
import {
    getAllDiscounts,
    getActiveDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    toggleDiscountStatus,
} from '@/lib/helpers/discounts.backend';
import { toast } from 'sonner';

interface DiscountStore {
    discounts: Discount[];
    activeDiscounts: Discount[];
    selectedDiscount: Discount | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchDiscounts: () => Promise<void>;
    fetchActiveDiscounts: () => Promise<void>;
    fetchDiscountById: (id: string) => Promise<void>;
    createDiscount: (data: CreateDiscountInput) => Promise<void>;
    updateDiscount: (id: string, data: UpdateDiscountInput) => Promise<void>;
    deleteDiscount: (id: string) => Promise<void>;
    toggleStatus: (id: string, isActive: boolean) => Promise<void>;
    setSelectedDiscount: (discount: Discount | null) => void;
    clearError: () => void;
}

export const useDiscountStore = create<DiscountStore>((set, get) => ({
    discounts: [],
    activeDiscounts: [],
    selectedDiscount: null,
    isLoading: false,
    error: null,

    fetchDiscounts: async () => {
        set({ isLoading: true, error: null });
        try {
            const discounts = await getAllDiscounts();
            set({ discounts, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
        }
    },

    fetchActiveDiscounts: async () => {
        set({ isLoading: true, error: null });
        try {
            const activeDiscounts = await getActiveDiscounts();
            set({ activeDiscounts, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
        }
    },

    fetchDiscountById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const discount = await getDiscountById(id);
            set({ selectedDiscount: discount, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
        }
    },

    createDiscount: async (data: CreateDiscountInput) => {
        set({ isLoading: true, error: null });
        try {
            await createDiscount(data);
            toast.success('Discount created successfully');
            // Refresh list
            await get().fetchDiscounts();
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
            throw error;
        }
    },

    updateDiscount: async (id: string, data: UpdateDiscountInput) => {
        set({ isLoading: true, error: null });
        try {
            await updateDiscount(id, data);
            toast.success('Discount updated successfully');
            // Refresh list
            await get().fetchDiscounts();
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
            throw error;
        }
    },

    deleteDiscount: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await deleteDiscount(id);
            toast.success('Discount deleted successfully');
            // Refresh list
            await get().fetchDiscounts();
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
            throw error;
        }
    },

    toggleStatus: async (id: string, isActive: boolean) => {
        set({ isLoading: true, error: null });
        try {
            await toggleDiscountStatus(id, isActive);
            toast.success(`Discount ${isActive ? 'activated' : 'deactivated'} successfully`);
            // Refresh list
            await get().fetchDiscounts();
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message);
            throw error;
        }
    },

    setSelectedDiscount: (discount: Discount | null) => {
        set({ selectedDiscount: discount });
    },

    clearError: () => {
        set({ error: null });
    },
}));
