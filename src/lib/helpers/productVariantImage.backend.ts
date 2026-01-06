import axios from "axios";
import api from "../api/axios";

// ==========================================
// PRODUCT VARIANT IMAGE API CALLS
// ==========================================

interface AssignImageData {
    productImageId: string;
    isPrimary?: boolean;
}

interface BulkAssignData {
    imageIds: string[];
    primaryImageId?: string;
}

/**
 * Assign single image to variant
 */
export async function assignImageToVariant(
    variantId: string,
    data: AssignImageData
) {
    try {
        const response = await api.post(
            `/api/products/var/${variantId}/images/assign`,
            data
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to assign image to variant";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Bulk assign images to variant
 */
export async function bulkAssignImagesToVariant(
    variantId: string,
    data: BulkAssignData
) {
    try {
        const response = await api.post(
            `/api/products/var/${variantId}/images/bulk-assign`,
            data
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to bulk assign images";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Remove image from variant
 */
export async function removeImageFromVariant(
    variantId: string,
    imageId: string
) {
    try {
        const response = await api.delete(
            `/api/products/var/${variantId}/images/${imageId}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to remove image from variant";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Set primary image for variant
 */
export async function setPrimaryVariantImage(
    variantId: string,
    imageId: string
) {
    try {
        const response = await api.put(
            `/api/products/var/${variantId}/images/${imageId}/primary`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to set primary image";
            throw new Error(message);
        }
        throw error;
    }
}

/**
 * Get all images assigned to variant
 */
export async function getVariantImages(variantId: string) {
    try {
        const response = await api.get(
            `/api/products/var/${variantId}/images`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.error || "Failed to get variant images";
            throw new Error(message);
        }
        throw error;
    }
}
