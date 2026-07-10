import api from "./client";

import type { User } from "../types";

/* ---------------- RESPONSE TYPES ---------------- */

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

interface MeResponse {
  success: boolean;
  data: User;
}

interface SignupResponse {
  success: boolean;
  message: string;
}

/* ---------------- AUTH API ---------------- */

export const authApi = {
  /* ---------- GET CURRENT USER ---------- */

  getMe: async (): Promise<User> => {
    const response = await api.get<MeResponse>("/auth/me");

    return response.data.data;
  },

  /* ---------- LOGIN ---------- */

  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    return response.data;
  },

  /* ---------- SIGNUP / REGISTER ---------- */

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    return response.data;
  },

  /* ---------- REFRESH ACCESS TOKEN ---------- */

  refresh: async (): Promise<{ success: boolean; accessToken: string }> => {
    const response = await api.post<{ success: boolean; accessToken: string }>(
      "/auth/refresh"
    );
    return response.data;
  },

  /* ---------- LOGOUT ---------- */

  logout: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/logout"
    );

    return response.data;
  },

  /* ---------- VERIFY EMAIL ---------- */

  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>(
      `/auth/verify-email`,
      {
        params: { token },
      }
    );
    return response.data;
  },

  /* ---------- RESEND VERIFICATION ---------- */

  resendVerification: async (email: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/resend-verification",
      { email }
    );
    return response.data;
  },

  /* ---------- FORGOT PASSWORD ---------- */

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  /* ---------- RESET PASSWORD ---------- */

  resetPassword: async (token: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/reset-password",
      {
        token,
        password,
      }
    );
    return response.data;
  },
};