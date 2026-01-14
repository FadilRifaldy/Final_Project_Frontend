// Discount Types
export type DiscountType = 'PRODUCT' | 'CART' | 'BUY_ONE_GET_ONE' | 'SHIPPING';
export type DiscountValueType = 'PERCENTAGE' | 'NOMINAL';

export interface Discount {
    id: string;
    name: string;
    description?: string;
    type: DiscountType;
    discountValueType: DiscountValueType;
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    buyQuantity?: number;
    getQuantity?: number;
    startDate: Date | string;
    endDate: Date | string;
    isActive: boolean;
    storeId?: string | null; // null = global, filled = specific store
    createdBy: string; // User ID yang membuat
    createdAt: Date | string;
    updatedAt: Date | string;
    productDiscounts?: ProductDiscount[];
    store?: {
        id: string;
        name: string;
    } | null;
}

export interface ProductDiscount {
    id: string;
    discountId: string;
    productVariantId: string;
    createdAt: Date | string;
    productVariant?: {
        id: string;
        name: string;
        price: number;
        product?: {
            id: string;
            name: string;
        };
    };
}

export interface CreateDiscountInput {
    name: string;
    description?: string;
    type: DiscountType;
    discountValueType: DiscountValueType;
    discountValue: number;
    minPurchase?: number;
    maxDiscount?: number;
    buyQuantity?: number;
    getQuantity?: number;
    productVariantIds?: string[];
    startDate: string;
    endDate: string;
    storeId?: string; // null/undefined = global, filled = specific store
}

export interface UpdateDiscountInput {
    name?: string;
    description?: string;
    type?: DiscountType;
    discountValueType?: DiscountValueType;
    discountValue?: number;
    minPurchase?: number;
    maxDiscount?: number;
    buyQuantity?: number;
    getQuantity?: number;
    productVariantIds?: string[];
    startDate?: string;
    endDate?: string;
}
