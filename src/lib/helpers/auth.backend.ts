import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:8800";

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

export async function signUpUser(user:IUserRegister) {
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
    const res = await axios.post(
      `${BASE_URL}/auth/login`,
      user,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

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

