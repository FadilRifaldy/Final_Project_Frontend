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

// Multi-store inventory types
export interface IStoreInventory {
    id: string;
    storeId: string;
    variantId: string;
    quantity: number;
    reserved: number;
    store: {
        id: string;
        name: string;
        city: string;
        province: string;
        address: string;
        latitude: number;
        longitude: number;
    };
}

export interface IInventorySummary {
    totalStores: number;
    totalQuantity: number;
    totalReserved: number;
}

export interface IInventoryByVariantResponse {
    success: boolean;
    data: {
        inventories: IStoreInventory[];
        summary: IInventorySummary;
    };
    message: string;
}
