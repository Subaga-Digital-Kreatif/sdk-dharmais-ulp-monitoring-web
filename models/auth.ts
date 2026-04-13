import { api } from "./api";

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
};

export type LoginResponse = {
  token: string;
  type: string;
  expiresAt: string | null;
  user: AuthUser;
};

/** Disimpan setelah login sukses (local/session sesuai "remember"). */
export const AUTH_USER_STORAGE_KEY = "ulp_auth_user";

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
};
