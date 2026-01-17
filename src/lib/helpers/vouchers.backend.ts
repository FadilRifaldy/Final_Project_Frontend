import axios from "axios";
import api from "../api/axios";

// ========================================
// VOUCHER CRUD (Admin)
// ========================================

// Get all vouchers (Admin only)
export async function getAllVouchers() {
    try {
        const response = await api.get("/api/vouchers");
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get vouchers";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Get active vouchers (Public)
export async function getActiveVouchers() {
    try {
        const response = await api.get("/api/vouchers/active");
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get active vouchers";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Get voucher by ID
export async function getVoucherById(id: string) {
    try {
        const response = await api.get(`/api/vouchers/${id}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get voucher";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Get voucher by code
export async function getVoucherByCode(code: string) {
    try {
        const response = await api.get(`/api/vouchers/code/${code}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get voucher";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Create voucher (Super Admin only)
export async function createVoucher(data: {
    code: string;
    name: string;
    description?: string;
    scope: 'PRODUCT' | 'CART' | 'SHIPPING';
    discountType: 'PERCENTAGE' | 'NOMINAL';
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    maxUsagePerUser: number;
    maxTotalUsage?: number;
    startDate: string;
    endDate: string;
}) {
    try {
        const response = await api.post("/api/vouchers", data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to create voucher";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Update voucher
export async function updateVoucher(id: string, data: {
    code?: string;
    name?: string;
    description?: string;
    scope?: 'PRODUCT' | 'CART' | 'SHIPPING';
    discountType?: 'PERCENTAGE' | 'NOMINAL';
    discountValue?: number;
    minPurchase?: number;
    maxDiscount?: number;
    maxUsagePerUser?: number;
    maxTotalUsage?: number;
    startDate?: string;
    endDate?: string;
}) {
    try {
        const response = await api.put(`/api/vouchers/${id}`, data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to update voucher";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Delete voucher (soft delete)
export async function deleteVoucher(id: string) {
    try {
        const response = await api.delete(`/api/vouchers/${id}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to delete voucher";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Toggle voucher status
export async function toggleVoucherStatus(id: string, isActive: boolean) {
    try {
        const response = await api.patch(`/api/vouchers/${id}/toggle`, { isActive });
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to toggle voucher status";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// ========================================
// VOUCHER CLAIM & USAGE (Customer)
// ========================================

// Claim voucher
export async function claimVoucher(voucherId: string) {
    try {
        const response = await api.post(`/api/vouchers/${voucherId}/claim`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to claim voucher";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Get user's vouchers
export async function getUserVouchers(userId: string) {
    try {
        const response = await api.get(`/api/vouchers/user/${userId}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Failed to get user vouchers";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}

// Validate voucher code (untuk checkout)
export async function validateVoucherCode(code: string, cartData: any, userId: string) {
    try {
        const response = await api.post("/api/vouchers/validate", { code, cartData, userId });
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Failed to validate voucher code";
            throw new Error(message);
        }
        throw new Error("Unexpected error occurred");
    }
}
