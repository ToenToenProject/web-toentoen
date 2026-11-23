"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/admin/login/LoginForm";
import { loginUser } from "@/services/authService";
import { LoginPayload } from "@/constants/api/admin/login";
import { useAuth } from "@/context/AuthContext";
import { UserSession } from "@/types/auth";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async (payload: LoginPayload) => {
    setError("");
    setIsLoading(true);

    try {
      // Login via endpoint HTTP-Only Cookie
      const response = await loginUser(payload);

      // Simpan data profil user ke context & localStorage untuk akses cepat di sisi client
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
        // Set cookie session agar langsung terdeteksi oleh Next.js middleware
        document.cookie = `toentoen_session=${u.role}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `token=true; path=/; max-age=86400; SameSite=Lax`;
      }

      // Ambil nilai role dari response API
      const userRole = response.data?.user?.role;
      const roleUpper = userRole ? userRole.toUpperCase() : "";

      // Pemetaan Role Login sesuai peran di backend
      if (
        roleUpper.includes("CONTENT_CREATOR") ||
        roleUpper.includes("SOCIAL") ||
        roleUpper.includes("SMM") ||
        roleUpper.includes("SOSMED")
      ) {
        router.push("/login/social-media");
      } else if (roleUpper.includes("CMO") || roleUpper.includes("MARKETING")) {
        router.push("/login/cmo");
      } else if (
        roleUpper.includes("SALES_SUPERVISOR") ||
        (roleUpper.includes("SUPERVISOR") && roleUpper.includes("SALES")) ||
        roleUpper === "SALES_MARKETING_SPV"
      ) {
        router.push("/login/sales/supervisor");
      } else if (roleUpper.includes("SALES")) {
        router.push("/login/sales/staff");
      } else if (
        roleUpper === "ADMIN_SPV" ||
        roleUpper === "SUPERVISOR_ADMIN" ||
        roleUpper.includes("SPV") ||
        roleUpper.includes("SUPERVISOR")
      ) {
        router.push("/login/admin/supervisor");
      } else if (
        roleUpper === "ADMIN" ||
        roleUpper === "STAFF" ||
        roleUpper.includes("CS") ||
        roleUpper.includes("SUPPORT")
      ) {
        router.push("/login/admin/staff");
      } else {
        router.push("/login/admin/staff");
      }
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
