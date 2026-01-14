import axios from "axios";
import api from "../api/axios";

// Get all discounts (Admin only)
export async function getAllDiscounts() {
    try {
        const response = await api.get("/api/discounts");
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get discounts";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Get active discounts (Public)
export async function getActiveDiscounts() {
    try {
        const response = await api.get("/api/discounts/active");
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get active discounts";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Get discount by ID
export async function getDiscountById(id: string) {
    try {
        const response = await api.get(`/api/discounts/${id}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get discount";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Create discount
export async function createDiscount(data: {
    name: string;
    description?: string;
    type: string;
    discountValueType: string;
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    buyQuantity?: number;
    getQuantity?: number;
    productVariantIds?: string[];
    startDate: string;
    endDate: string;
    storeId?: string; // For scope control
}) {
    try {
        const response = await api.post("/api/discounts", data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to create discount";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Update discount
export async function updateDiscount(id: string, data: {
    name?: string;
    description?: string;
    type?: string;
    discountValueType?: string;
    discountValue?: number;
    minPurchase?: number;
    maxDiscount?: number;
    buyQuantity?: number;
    getQuantity?: number;
    productVariantIds?: string[];
    startDate?: string;
    endDate?: string;
}) {
    try {
        const response = await api.put(`/api/discounts/${id}`, data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to update discount";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Delete discount (soft delete)
export async function deleteDiscount(id: string) {
    try {
        const response = await api.delete(`/api/discounts/${id}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to delete discount";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Toggle discount status
export async function toggleDiscountStatus(id: string, isActive: boolean) {
    try {
        const response = await api.patch(`/api/discounts/${id}/toggle`, { isActive });
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to toggle discount status";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}
