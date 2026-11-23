// src/hooks/usePermission.ts
"use client";

import { useAuth } from "@/context/AuthContext";

export function usePermission() {
  const { user, isLoading } = useAuth();

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user || !user.permissions) return false;
    // Bintang (*) menandakan full access (C-Level / Super Admin)
    if (user.permissions.includes("*")) return true;
    return user.permissions.includes(requiredPermission);
  };

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    const userRole = (user.role || "").toUpperCase();
    return allowedRoles.some((r) => r.toUpperCase() === userRole);
  };

  const isSupervisor = (): boolean => {
    if (!user) return false;
    const userRole = (user.role || "").toUpperCase();
    return (
      hasRole(["ADMIN_SPV", "SUPERVISOR_ADMIN", "SALES_MARKETING_SPV"]) ||
      userRole.includes("SUPERVISOR") ||
      userRole.includes("SPV")
    );
  };

  return { user, isLoading, hasPermission, hasRole, isSupervisor };
}
