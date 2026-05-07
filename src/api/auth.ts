import api from "./client";

import type { User } from "../types";

/* ---------------- RESPONSE TYPES ---------------- */

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface MeResponse {
  success: boolean;
  data: User;
}

interface SignupResponse {
  success: boolean;
  message: string;
  user: User;
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
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    return response.data;
  },

  /* ---------- SIGNUP ---------- */

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>(
      "/auth/signup",
      {
        name,
        email,
        password,
      }
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
};