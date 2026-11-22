// src/components/cmo/CmoAuthGuard.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface CmoAuthGuardProps {
  children: (props: { onLogout: () => void }) => React.ReactNode;
}

export const CmoAuthGuard: React.FC<CmoAuthGuardProps> = ({ children }) => {
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
