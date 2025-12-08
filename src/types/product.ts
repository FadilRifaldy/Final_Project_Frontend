export interface IProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    weight?: number;
}