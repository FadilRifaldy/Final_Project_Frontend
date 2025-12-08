export interface IAdmin {
    id: string;
    name: string;
    email: string;
    role: 'superAdmin' | 'storeAdmin';
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    storeId?: string;
}