export interface IAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;          
  addressLine: string;
  notes?: string | null;
  isPrimary: boolean;
  latitude: number;
  longitude: number;
}
