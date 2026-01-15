export interface IProduct {
    id: string;
    name: string;
    description: string;
    images: IProductImage[];
    categoryId: string;
    category?: {
        id: string;
        name: string;
        slug: string;
        description?: string;
    };
    variants?: IProductVariant[];
    store?: {
        id: string;
        name: string;
        city: string;
        address: string;
    }
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
    assignedImages?: IProductVariantImage[]; // Images assigned to this variant
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

export interface IProductImage {
    id: string;
    productId: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    order: number;
}

export interface IProductVariantImage {
    id: string;
    productVariantId: string;
    productImageId: string;
    isPrimary: boolean;
    createdAt: string;
    image: IProductImage;
}