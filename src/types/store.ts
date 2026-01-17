export interface IStore {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string
  latitude: number;
  longitude: number;
  phone?: string;
  maxServiceRadius: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStoreProduct {
  id: string;
  productId: string;
  name: string;
  variantName: string;
  variantSlug: string;
  fullName: string;
  price: number;
  image: string | null;
  stock: number;
  reserved: number;
  availableStock: number;
  sku: string;
  category: string;
  categoryId: string;
  sold: number;
}

export interface INearestStoreResponse {
  nearestStore: IStore & {
    distance: number;
    isInRange: boolean;
  };
  isInServiceArea: boolean;
  message: string;
  allStores?: Array<IStore & {  // TAMBAH INI (optional untuk debugging)
    distance: number;
    isInRange: boolean;
  }>;
}