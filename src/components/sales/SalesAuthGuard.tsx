// src/components/sales/SalesAuthGuard.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/authService';

interface SalesAuthGuardProps {
  children: (props: { onLogout: () => void }) => React.ReactNode;
}

export const SalesAuthGuard: React.FC<SalesAuthGuardProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
  };

  // Login dinonaktifkan sementara: langsung izinkan akses tanpa cek token
  return <>{children({ onLogout: handleLogout })}</>;
};
