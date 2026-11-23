"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/authService';

interface SmAuthGuardProps {
  children: (props: { onLogout: () => void }) => React.ReactNode;
}

export const SmAuthGuard: React.FC<SmAuthGuardProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
  };

  // Development bypass: permit direct route navigation
  return <>{children({ onLogout: handleLogout })}</>;
};
