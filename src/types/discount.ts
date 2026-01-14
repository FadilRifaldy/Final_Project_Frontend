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
    createdAt: Date | string;
    updatedAt: Date | string;
    productDiscounts?: ProductDiscount[];
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
        // Add other product variant fields as needed
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
