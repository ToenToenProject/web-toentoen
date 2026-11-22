// src/components/sales/SalesAuthGuard.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface SalesAuthGuardProps {
  children: (props: { onLogout: () => void }) => React.ReactNode;
}

export const SalesAuthGuard: React.FC<SalesAuthGuardProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.replace('/login');
  };

  // Login dinonaktifkan sementara: langsung izinkan akses tanpa cek token
  return <>{children({ onLogout: handleLogout })}</>;
};
