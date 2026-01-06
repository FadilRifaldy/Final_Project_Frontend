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