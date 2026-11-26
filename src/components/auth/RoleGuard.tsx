"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { DashboardShellSkeleton } from "@/components/ui/Skeleton";

interface RoleGuardProps {
  allowedRoles?: string[];
  roles?: string[];
  requiredPermission?: string;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  roles,
  requiredPermission,
  children,
}) => {
  const router = useRouter();
  const { user, isLoading, hasRole, hasPermission } = usePermission();
  const effectiveRoles = allowedRoles || roles;

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!isLoading && !user) {
      const cached = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!cached) {
        router.replace("/login");
      }
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <DashboardShellSkeleton withSidebar={false} />;
  }

  const isRoleAuthorized = !effectiveRoles || hasRole(effectiveRoles);
  const isPermissionAuthorized = !requiredPermission || hasPermission(requiredPermission);

  if (!isRoleAuthorized || !isPermissionAuthorized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          403 — Akses Ditolak
        </h2>
        <p className="max-w-md text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          Akun Anda ({user?.role || "Staff"}) tidak memiliki izin resmi (<code>{requiredPermission || "Role Restriction"}</code>) untuk mengakses halaman ini. Halaman ini dikhususkan untuk tingkat Supervisor.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-[#00c2a8] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#00a892] transition-colors"
        >
          Kembali ke Halaman Login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
