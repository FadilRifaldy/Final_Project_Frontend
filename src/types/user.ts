export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN";
  phone?: string | null;
  isVerified: boolean;
  profileImage?: string | null;
  referralCode?: string;
  provider: "CREDENTIAL" | "GOOGLE";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  addresses?: any[]; // Bisa didetailkan nanti kalau perlu
  userStores?: any[]; // Untuk Store Admin yang assigned ke store tertentu
}
