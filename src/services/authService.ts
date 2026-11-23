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
 * Autentikasi Login (HTTP-Only Cookie Based)
 * Browser otomatis menyimpan cookie auth_token & token dari server backend.
 */
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const targetUrl = typeof window !== 'undefined' ? '/api/v1/auth/login' : LOGIN_ENDPOINT;
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // WAJIB: agar browser otomatis menerima dan menyimpan cookie HTTP-only dari backend
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
 * Memeriksa Sesi Aktif Pengguna (GET /api/v1/auth/me)
 * Mengirimkan cookie auth_token secara otomatis untuk memvalidasi sesi tanpa localStorage.
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
      // WAJIB: cookie terkirim otomatis ke backend
      credentials: "include",
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.data?.user || null;
  } catch {
    return null;
  }
};

/**
 * Logout Pengguna (POST /api/v1/auth/logout)
 * Backend otomatis membersihkan seluruh cookie autentikasi (auth_token, token, refreshToken).
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Abaikan error jaringan saat logout
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
