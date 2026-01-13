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