export interface IAdmin {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "STORE_ADMIN";
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    storeId?: string;
}