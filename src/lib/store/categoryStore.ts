import { create } from 'zustand';
import { ICategory } from '@/types/category';

interface CategoryState {
    categories: ICategory[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchCategories: () => Promise<void>;
    addCategory: (name: string, description?: string) => Promise<void>;
    updateCategory: (id: string, name: string, description?: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({ loading: true, error: null });

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/categories');
            // const data = await response.json();
            // set({ categories: data, loading: false });

            // Temporary: Set empty array until backend is ready
            set({ categories: [], loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch categories',
                loading: false
            });
        }
    },

    addCategory: async (name: string, description?: string) => {
        set({ loading: true, error: null });

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/categories', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, description })
            // });
            // const newCategory = await response.json();
            // set((state) => ({
            //     categories: [...state.categories, newCategory],
            //     loading: false
            // }));

            // Temporary: Just set loading to false
            set({ loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add category',
                loading: false
            });
        }
    },

    updateCategory: async (id: string, name: string, description?: string) => {
        set({ loading: true, error: null });

        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/categories/${id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, description })
            // });
            // const updatedCategory = await response.json();
            // set((state) => ({
            //     categories: state.categories.map(cat =>
            //         cat.id === id ? updatedCategory : cat
            //     ),
            //     loading: false
            // }));

            // Temporary: Just set loading to false
            set({ loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update category',
                loading: false
            });
        }
    },

    deleteCategory: async (id: string) => {
        set({ loading: true, error: null });

        try {
            // TODO: Replace with actual API call
            // await fetch(`/api/categories/${id}`, {
            //     method: 'DELETE'
            // });
            // set((state) => ({
            //     categories: state.categories.filter(cat => cat.id !== id),
            //     loading: false
            // }));

            // Temporary: Just set loading to false
            set({ loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete category',
                loading: false
            });
        }
    },
}));

