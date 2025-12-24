import axios from "axios";
import api from "../api/axios";
import { IProductVariant, ICreateProductVariant, IUpdateProductVariant } from "@/types/product";

export async function getProductVariant(productId: string): Promise<IProductVariant[]> {
    try {
        const response = await api.get(`/api/products/var/all/${productId}`)
        return response.data.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message || "Failed to get products variant";
            throw new Error(message);
        }
        throw error;
    }
}

export async function createProductVariant(productId: string, data: ICreateProductVariant): Promise<IProductVariant> {
    try {
        const response = await api.post(`/api/products/var/${productId}`, data)
        return response.data.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message || "Failed to create products variant";
            throw new Error(message);
        }
        throw error;
    }
}