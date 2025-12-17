export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "STORE_ADMIN" | "SUPER_ADMIN";
  phone?: string | null;
  isVerified: boolean;
  profileImage?: string | null;
  referralCode: string;
}
