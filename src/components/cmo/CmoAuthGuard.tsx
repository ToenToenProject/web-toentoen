// src/components/cmo/CmoAuthGuard.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/authService';

interface CmoAuthGuardProps {
  children: (props: { onLogout: () => void }) => React.ReactNode;
}

export const CmoAuthGuard: React.FC<CmoAuthGuardProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
  };

  // Login dinonaktifkan sementara: langsung izinkan akses tanpa cek token
  return <>{children({ onLogout: handleLogout })}</>;
};
