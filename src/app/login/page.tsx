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
      const roleUpper = userRole ? userRole.toUpperCase() : "";

      // Role-based redirection mapping
            if (
        roleUpper === "SALES_MARKETING_SPV" ||
        roleUpper.includes("SALES_SUPERVISOR") ||
        (roleUpper.includes("SALES") && (roleUpper.includes("SPV") || roleUpper.includes("SUPERVISOR")))
      ) {
        router.push("/login/sales/supervisor");
      } else if (roleUpper === "SALES" || roleUpper.includes("SALES")) {
        router.push("/login/sales/staff");
      } 
            else if (
        roleUpper.includes("CONTENT_CREATOR") ||
        roleUpper.includes("SOCIAL") ||
        roleUpper.includes("SMM") ||
        roleUpper.includes("SOSMED")
      ) {
        router.push("/login/social-media");
      } 
            else if (
        roleUpper.includes("CMO") ||
        (roleUpper.includes("MARKETING") && !roleUpper.includes("SALES")) ||
        roleUpper.includes("C_LEVEL")
      ) {
        router.push("/login/cmo");
      } 
            else if (
        roleUpper === "ADMIN_SPV" ||
        roleUpper === "SUPERVISOR_ADMIN" ||
        (roleUpper.includes("ADMIN") && (roleUpper.includes("SPV") || roleUpper.includes("SUPERVISOR")))
      ) {
        router.push("/login/admin/supervisor");
      } 
            else if (
        roleUpper === "ADMIN" ||
        roleUpper === "STAFF_ADMIN" ||
        roleUpper === "STAFF" ||
        roleUpper.includes("CS") ||
        roleUpper.includes("SUPPORT")
      ) {
        router.push("/login/admin/staff");
      } else {
                router.push("/login/sales/staff");
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
