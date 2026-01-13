import axios from "axios";
import api from "../api/axios";

export async function getInventoryByStore(
    storeId: string,
    page: number = 1,
    limit: number = 100,
    search?: string
) {
    try {
        const response = await api.get(`/api/inventory/store/${storeId}`, {
            params: { page, limit, search },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get inventory";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Get inventory untuk variant di semua store (Super Admin only)
 */
export async function getInventoryByVariant(variantId: string) {
    try {
        const response = await api.get(`/api/inventory/variant/${variantId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get inventory by variant";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Check stock availability
 */
export async function checkStockAvailability(
    storeId: string,
    variantId: string,
    quantity: number
) {
    try {
        const response = await api.get(
            `/api/inventory/check/${storeId}/${variantId}`,
            {
                params: { quantity },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to check stock availability";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Get inventory detail
 */
export async function getInventoryDetail(storeId: string, variantId: string) {
    try {
        const response = await api.get(
            `/api/inventory/detail/${storeId}/${variantId}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get inventory detail";
            throw new Error(message);
        }
        throw error;
    }
}

// ==========================================
// STOCK JOURNAL API CALLS
// ==========================================

interface StockJournalData {
    storeId: string;
    productVariantId: string;
    quantity: number;
    referenceNo: string;
    reason: string;
    notes?: string;
}

/**
 * Create Stock IN journal
 */
export async function createStockIn(data: StockJournalData) {
    try {
        const response = await api.post("/api/stock-journal/in", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to create stock IN";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Create Stock OUT journal
 */
export async function createStockOut(data: StockJournalData) {
    try {
        const response = await api.post("/api/stock-journal/out", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to create stock OUT";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Get stock history untuk variant tertentu di store tertentu
 */
export async function getStockHistory(
    storeId: string,
    variantId: string,
    page: number = 1,
    limit: number = 50
) {
    try {
        const response = await api.get(
            `/api/stock-journal/variant/${storeId}/${variantId}`,
            {
                params: { page, limit },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get stock history";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Get all stock history untuk store tertentu
 */
export async function getStockHistoryByStore(
    storeId: string,
    page: number = 1,
    limit: number = 50,
    type?: "IN" | "OUT"
) {
    try {
        const response = await api.get(`/api/stock-journal/store/${storeId}`, {
            params: { page, limit, type },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get stock history by store";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Get stock journal by ID
 */
export async function getStockJournalById(id: string) {
    try {
        const response = await api.get(`/api/stock-journal/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get stock journal";
            throw new Error(message);
        }
        throw error;
    }
}
