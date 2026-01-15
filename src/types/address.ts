export type Address = {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  isPrimary: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}