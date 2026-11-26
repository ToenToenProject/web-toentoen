import {
  LOGIN_ENDPOINT,
  ME_ENDPOINT,
  LOGOUT_ENDPOINT,
  LoginPayload,
  LoginResponse,
  UserData,
  ApiErrorResponse,
} from "@/constants/api/admin/login";

/**
 * Authenticates user credentials via HTTP-only cookie session.
 */
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const targetUrl = typeof window !== 'undefined' ? '/api/v1/auth/login' : LOGIN_ENDPOINT;
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorData = data as ApiErrorResponse;
    throw new Error(errorData.message || "Email atau kata sandi yang Anda masukkan salah.");
  }

  return data as LoginResponse;
};

/**
 * Verifies active session against /api/v1/auth/me using HTTP-only cookies.
 */
export const checkSession = async (): Promise<UserData | null> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && token.startsWith('ey') ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(ME_ENDPOINT, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          document.cookie = 'auth_token=; path=/; max-age=0;';
          document.cookie = 'token=; path=/; max-age=0;';
          document.cookie = 'toentoen_session=; path=/; max-age=0;';
        }
        return null;
      }
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('user');
        if (cached) return JSON.parse(cached);
      }
      return null;
    }
    const json = await response.json();
    return json.data?.user || null;
  } catch {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('user');
      if (cached) return JSON.parse(cached);
    }
    return null;
  }
};

/**
 * Terminates user session and clears authentication cookies.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Suppress network errors during logout
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie = "auth_token=; path=/; max-age=0;";
      document.cookie = "token=; path=/; max-age=0;";
      document.cookie = "toentoen_session=; path=/; max-age=0;";
      window.location.href = "/login";
    }
  }
};
