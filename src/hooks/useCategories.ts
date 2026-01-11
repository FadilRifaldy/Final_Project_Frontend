import { useState, useEffect } from "react";
import { ICategory } from "@/types/category";
import { getAllCategories } from "@/lib/helpers/categories.backend";

/**
 * Custom hook untuk fetch categories dari API
 * Includes loading state, error handling, dan auto-retry
 */
export const useCategories = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getAllCategories();
            setCategories(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.message || "Failed to load categories";
            setError(errorMessage);
            console.error("useCategories error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        isLoading,
        error,
        refetch: fetchCategories, // Untuk manual refresh
    };
};
