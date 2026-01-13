export interface IInventory {
    productVariantId: string;
    storeId: string;
    quantity: number;
    reserved: number;
    available?: number;
    createdAt: string;
    updatedAt: string;
}

export interface IStockCheckResponse {
    available: boolean;
    reason: string;
    inventory: (IInventory & {
        productVariant?: {
            id: string;
            name: string;
            sku: string;
            price: number;
        };
        store?: {
            id: string;
            name: string;
        };
    }) | null;
}
