"use client";

import { useAuth } from "@/context/AuthContext";

export function usePermission() {
  const { user, isLoading } = useAuth();

  const isCLevel = (): boolean => {
    if (!user) return false;
    const userRole = (user.role || "").toUpperCase();
    return (
      userRole === "C_LEVEL" ||
      userRole === "CMO" ||
      userRole === "SUPER_ADMIN" ||
      Boolean(user.permissions?.includes("*"))
    );
  };

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false;
    // Wildcard permissions for executive and administrative roles
    if (isCLevel()) return true;
    if (!user.permissions) return false;
    return user.permissions.includes(requiredPermission);
  };

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    // Wildcard access for executive and administrative roles
    if (isCLevel()) return true;
    const userRole = (user.role || "").toUpperCase();
    return allowedRoles.some((r) => r.toUpperCase() === userRole);
  };

  const isSupervisor = (): boolean => {
    if (!user) return false;
    if (isCLevel()) return true;
    const userRole = (user.role || "").toUpperCase();
    return (
      hasRole(["ADMIN_SPV", "SUPERVISOR_ADMIN", "SALES_MARKETING_SPV"]) ||
      userRole.includes("SUPERVISOR") ||
      userRole.includes("SPV")
    );
  };

  return { user, isLoading, hasPermission, hasRole, isSupervisor, isCLevel };
}
