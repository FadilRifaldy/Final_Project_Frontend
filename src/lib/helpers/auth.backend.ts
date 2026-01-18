import axios, { AxiosError } from "axios";
import { IUser } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  refCode?: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

export async function signUpUser(user: IUserRegister) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, user);
    return res.data;
  } catch (error) {
    console.error(error);
    return { message: "Register Failed" };
  }
}

export async function signUpStoreAdmin(user: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/register-store`,
      user
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return { message: "Register Store Admin Failed" };
  }
}

// // ver1
// export async function loginUser(user: IUserLogin) {
//   try {
//     const res = await axios.post(`${BASE_URL}/auth/login`, user, {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" },
//     });

//     return {
//       success: true,
//       user: res.data.user,
//       message: res.data.message || "Login success",
//     };
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Login Failed",
//       };
//     }

//     return {
//       success: false,
//       message: "Unexpected error occurred",
//     };
//   }
// }

// ver2
export async function loginUser(user: IUserLogin) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, user, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    // Pastikan response success
    if (!res.data) {
      return {
        success: false,
        message: "Invalid response from server",
      };
    }

    return {
      success: true,
      user: res.data.user,
      message: res.data.message || "Login success",
    };
  } catch (error: unknown) {
    console.error("Login error:", error); // Debug log

    if (axios.isAxiosError(error)) {
      // Network error atau CORS
      if (!error.response) {
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      }

      // Server error dengan message
      return {
        success: false,
        message: error.response?.data?.message || "Login Failed",
      };
    }

    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
}

export async function logoutUser() {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }

    return {
      success: true,
      message: res.data?.message || "Logout Success",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Logout Failed",
      };
    }

    return {
      success: false,
      message: "Unexpected logout error",
    };
  }
}



export async function socialLogin(
  accessToken: string,
  role: "CUSTOMER" | "STORE_ADMIN" = "CUSTOMER"
): Promise<{
  success: boolean;
  message?: string;
  user?: IUser;
  token?: string;
}> {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`,
      {
        accessToken,
        role,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      user: data.user as IUser,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          (error.response?.data as { message?: string })?.message ??
          "Login Google gagal",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan tidak terduga",
    };
  }
}

export async function verifyToken() {
  try {
    const res = await axios.get(`${BASE_URL}/auth/verify-token`, {
      withCredentials: true,
    });

    return {
      loggedIn: true,
      user: res.data.user,
    };
  } catch (error) {
    return {
      loggedIn: false,
      user: null,
    };
  }
}

export async function sendVerifyEmail() {
  try {
    const res = await axios.post(
      `${BASE_URL}/verify/send`,
      {},
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message as string,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "Gagal mengirim email verifikasi",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan tidak terduga",
    };
  }
}

export async function resendVerifyEmail() {
  try {
    const res = await axios.post(
      `${BASE_URL}/verify/resend`,
      {},
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message as string,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "Gagal mengirim ulang email verifikasi",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan tidak terduga",
    };
  }
}

export interface IUpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface IUpdateProfileResponse {
  success: boolean;
  message: string;
  requireRelogin?: boolean;
}

export async function updateProfile(
  payload: IUpdateProfilePayload
): Promise<IUpdateProfileResponse> {
  try {
    const res = await axios.put(`${BASE_URL}/user/profile`, payload, {
      withCredentials: true,
    });

    return {
      success: true,
      message: res.data.message,
      requireRelogin: res.data.requireRelogin ?? false,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal memperbarui profil",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan",
    };
  }
}

export async function getMe() {
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      withCredentials: true,
    });

    return { success: true, user: res.data.user };
  } catch {
    return { success: false, user: null };
  }
}

export async function confirmEmailVerification(
  token: string,
  password: string
) {
  try {
    const res = await axios.post(
      `${BASE_URL}/verify/confirm-email`,
      { token, password },
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Verifikasi email gagal",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan tidak terduga",
    };
  }
}

interface ISendResetPasswordResult {
  success: boolean;
  message: string;
}

interface ISendPasswordLinkPayload {
  email: string;
  mode: "reset" | "change";
};

export async function sendPassLinkEmail(
  payload: ISendPasswordLinkPayload
): Promise<ISendResetPasswordResult> {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/password/send`,
      payload,
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Gagal mengirim email reset password",
    };
  }
}

interface IConfirmPasswordPayload {
  token: string;
  newPassword: string;
  oldPassword?: string;
}

interface IConfirmPasswordResponse {
  success: boolean;
  message: string;
}

interface IErrorResponse {
  message: string;
}

export async function confirmResetPassword(
  payload: IConfirmPasswordPayload
): Promise<IConfirmPasswordResponse> {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/password/confirm`,
      payload,
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    const err = error as AxiosError<IErrorResponse>;

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Gagal memperbarui password",
    };
  }
}

interface ICheckPasswordTokenResponse {
  valid: boolean;
  type: "PASSWORD_RESET" | "PASSWORD_CHANGE";
  requireOldPassword: boolean;
  message?: string;
}

export async function checkPasswordToken(
  token: string
): Promise<ICheckPasswordTokenResponse> {
  try {
    const res = await axios.get(
      `${BASE_URL}/auth/password/check-token`,
      { params: { token } }
    );

    return {
      valid: true,
      type: res.data.type,
      requireOldPassword: res.data.requireOldPassword,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    return {
      valid: false,
      type: "PASSWORD_RESET",
      requireOldPassword: false,
      message:
        err.response?.data?.message ||
        "Token tidak valid atau sudah kadaluarsa",
    };
  }
}

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export const getCloudinarySignature = async (): Promise<CloudinarySignature> => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/cloudinary/signature`,
      { withCredentials: true }
    );

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Gagal mendapatkan signature"
      );
    }

    throw new Error("Terjadi kesalahan tidak terduga");
  }
};

export const uploadToCloudinary = async (
  file: File,
  signature: CloudinarySignature,
  onProgress?: (percent: number) => void
): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp.toString());
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percent);
        },
      }
    );

    return res.data.secure_url;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error?.message ||
        "Upload ke Cloudinary gagal"
      );
    }

    throw new Error("Terjadi kesalahan tidak terduga saat upload");
  }
};

