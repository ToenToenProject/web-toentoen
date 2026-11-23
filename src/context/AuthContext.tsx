"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSession } from "@/types/auth";
import { checkSession, logoutUser } from "@/services/authService";

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  setUser: (user: UserSession | null) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  logout: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inisialisasi: Baca cache user dari localStorage lalu validasi via cookie /auth/me
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // 1. Coba baca data cepat dari localStorage jika ada
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("user");
          if (cached) {
            setUser(JSON.parse(cached));
          }
        } catch {
          // Abaikan error parse
        }
      }

      // 2. Verifikasi sesi cookie nyata ke backend via /api/v1/auth/me
      try {
        const activeUser = await checkSession();
        if (isMounted) {
          if (activeUser) {
            const mappedUser: UserSession = {
              id: activeUser.id,
              workerId: activeUser.workerId || "",
              email: activeUser.email,
              name: activeUser.name || "Pengguna",
              role: activeUser.role,
              permissions: activeUser.permissions || [],
              passwordChangeCount: activeUser.passwordChangeCount || 0,
              ktpUploaded: activeUser.ktpUploaded || false,
              phone: activeUser.phone,
              address: activeUser.address,
            };
            setUser(mappedUser);
            if (typeof window !== "undefined") {
              localStorage.setItem("user", JSON.stringify(mappedUser));
              document.cookie = `toentoen_session=${mappedUser.role}; path=/; max-age=86400; SameSite=Lax`;
              document.cookie = `token=true; path=/; max-age=86400; SameSite=Lax`;
            }
          } else {
            // Jika /auth/me gagal (misal cross-origin cookie tidak terkirim dari localhost),
            // periksa apakah localStorage masih memiliki session yang sah
            const hasLocalCache = typeof window !== "undefined" && !!localStorage.getItem("user");
            if (!hasLocalCache) {
              setUser(null);
              if (typeof window !== "undefined") {
                document.cookie = "auth_token=; path=/; max-age=0;";
                document.cookie = "token=; path=/; max-age=0;";
                document.cookie = "toentoen_session=; path=/; max-age=0;";
              }
            }
          }
        }
      } catch {
        // Abaikan error jaringan
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    setUser(null);
    await logoutUser();
  };

  const handleRefresh = async () => {
    const active = await checkSession();
    if (active) {
      const mappedUser: UserSession = {
        id: active.id,
        workerId: active.workerId || "",
        email: active.email,
        name: active.name || "Pengguna",
        role: active.role,
        permissions: active.permissions || [],
        passwordChangeCount: active.passwordChangeCount || 0,
        ktpUploaded: active.ktpUploaded || false,
        phone: active.phone,
        address: active.address,
      };
      setUser(mappedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mappedUser));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        logout: handleLogout,
        refreshSession: handleRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
