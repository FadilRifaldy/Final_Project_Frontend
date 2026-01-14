import axios from "axios";
import api from "../api/axios";
import { ApiResponse } from "@/types/api";

export interface IStockJournalSummary {
    productVariantId: string;
    productName: string;
    variantName: string;
    stockStart: number;
    totalIn: number;
    totalOut: number;
    stockEnd: number;
}

export interface IStockJournalMonthlySummaryResponse {
    summary: IStockJournalSummary[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Get monthly stock summary report
 */

export async function getStockJournalMonthlySummary(
    storeId: string,
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 20
): Promise<ApiResponse<IStockJournalSummary[]>> {
    try {
        const res = await api.get("/api/stock-journal/report/monthly-summary", {
            params: { storeId, startDate, endDate, page, limit },
        });

        return {
            success: res.data.success,
            data: res.data.data,
            pagination: res.data.pagination,
        };
    } catch (err: unknown) {
        let message = "Failed to fetch stock summary";

        if (axios.isAxiosError(err)) {
            message = err.response?.data?.error || err.response?.data?.message || message;
        }

        return {
            success: false,
            message,
        };
    }
}
