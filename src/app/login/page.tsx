"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/admin/login/LoginForm";
import { loginUser } from "@/services/authService";
import { LoginPayload } from "@/constants/api/admin/login";
import { useAuth } from "@/context/AuthContext";
import { UserSession } from "@/types/auth";
import { getDashboardPathByRole } from "@/utils/roleRedirect";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async (payload: LoginPayload) => {
    setError("");
    setIsLoading(true);

    try {
            const response = await loginUser(payload);

      // Cache user profile for rapid client-side access
      if (response.data?.user) {
        const u = response.data.user;
        const mappedUser: UserSession = {
          id: u.id,
          workerId: u.workerId || "",
          email: u.email,
          name: u.name || "Pengguna",
          role: u.role,
          permissions: u.permissions || [],
          passwordChangeCount: u.passwordChangeCount || 0,
          ktpUploaded: u.ktpUploaded || false,
          phone: u.phone,
          address: u.address,
        };
        setUser(mappedUser);
        localStorage.setItem("user", JSON.stringify(mappedUser));
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        // Establish session cookies for Next.js middleware detection
        document.cookie = `toentoen_session=${u.role}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `token=true; path=/; max-age=86400; SameSite=Lax`;
      }

      const userRole = response.data?.user?.role;
      router.push(getDashboardPathByRole(userRole));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
  );
}
