import api from "../api/axios";
import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";

export const getAllUsers = async () => {
    try {
        const response = await api.get<ApiResponse<IUser[]>>("/api/users-mng");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await api.delete<ApiResponse<IUser>>(`/api/users-mng/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
