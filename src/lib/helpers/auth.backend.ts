import axios, { AxiosError } from "axios";

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

export async function loginUser(user: IUserLogin) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, user, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      user: res.data.user,
      message: res.data.message || "Login success",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
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
