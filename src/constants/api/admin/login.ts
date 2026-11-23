export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";

export const LOGIN_ENDPOINT = `${BASE_URL}/auth/login`;
export const ME_ENDPOINT = `${BASE_URL}/auth/me`;
export const LOGOUT_ENDPOINT = `${BASE_URL}/auth/logout`;

export interface LoginPayload {
  identifier?: string;
  email?: string;
  workerId?: string;
  password: string;
}

export interface UserData {
  id: string;
  workerId?: string;
  email: string;
  name?: string;
  role: string;
  permissions?: string[];
  passwordChangeCount?: number;
  ktpUploaded?: boolean;
  phone?: string | null;
  address?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserData;
    token?: string;
  };
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}
