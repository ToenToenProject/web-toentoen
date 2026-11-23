// src/components/auth/Can.tsx
"use client";

import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface CanProps {
  permission?: string;
  roles?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  permission,
  roles,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasRole } = usePermission();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (roles && !hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
