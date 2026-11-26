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

  // Initialize session from cached storage, then revalidate against /auth/me
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("user");
          if (cached) {
            setUser(JSON.parse(cached));
          }
        } catch {
          // Ignore storage parse failure
        }
      }

      // Verify active session with backend authentication endpoint
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
            const hasCookieToken =
              typeof document !== "undefined" &&
              /(?:^|;\s*)(auth_token|token|toentoen_session)=/.test(document.cookie);

            if (!hasCookieToken) {
              setUser(null);
              if (typeof window !== "undefined") {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                document.cookie = "auth_token=; path=/; max-age=0;";
                document.cookie = "token=; path=/; max-age=0;";
                document.cookie = "toentoen_session=; path=/; max-age=0;";
                const p = window.location.pathname;
                if (
                  p.startsWith("/admin") ||
                  p.startsWith("/sales") ||
                  p.startsWith("/cmo") ||
                  p.startsWith("/social-media")
                ) {
                  window.location.replace(`/login?redirect=${encodeURIComponent(p)}`);
                }
              }
            }
          }
        }
      } catch {
        // Suppress transient network revalidation error
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    const verifyTokenIntegrity = () => {
      if (typeof window === "undefined") return;
      const p = window.location.pathname;
      const isProtected =
        p.startsWith("/admin") ||
        p.startsWith("/sales") ||
        p.startsWith("/cmo") ||
        p.startsWith("/social-media");
      if (!isProtected) return;

      const hasCookieToken = /(?:^|;\s*)(auth_token|token|toentoen_session)=/.test(document.cookie);
      const hasCachedUser = !!localStorage.getItem("user");
      if (!hasCookieToken || !hasCachedUser) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        document.cookie = "auth_token=; path=/; max-age=0;";
        document.cookie = "token=; path=/; max-age=0;";
        document.cookie = "toentoen_session=; path=/; max-age=0;";
        window.location.replace(`/login?redirect=${encodeURIComponent(p)}`);
      }
    };

    window.addEventListener("focus", verifyTokenIntegrity);
    window.addEventListener("storage", verifyTokenIntegrity);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", verifyTokenIntegrity);
      window.removeEventListener("storage", verifyTokenIntegrity);
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
