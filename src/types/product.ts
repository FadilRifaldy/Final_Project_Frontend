export interface IProduct {
    id: string;
    name: string;
    description: string;
    images: string[];
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface IProductVariant {
    id: string;
    productId: string;
    sku: string;
    name: string;
    slug: string;
    price: number;
    color?: string;
    size?: string;
    weight?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateProductVariant {
    name: string;
    price: number;
    color?: string;
    size?: string;
    weight?: number;
}

export interface IUpdateProductVariant {
    name?: string;
    price?: number;
    color?: string;
    size?: string;
    weight?: number;
    isActive?: boolean;
}