"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, checkSession } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { UserSession } from '@/types/auth';

interface SmAuthGuardProps {
  children: (props: { onLogout: () => void; user: UserSession | null }) => React.ReactNode;
}

export const SmAuthGuard: React.FC<SmAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user: contextUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(contextUser);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      let activeUser: UserSession | null = contextUser;

      // Fast-path session evaluation from cached storage
      if (!activeUser && typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('user');
          if (cached) {
            activeUser = JSON.parse(cached);
          }
        } catch {
        }
      }

      // Revalidate session via backend /api/v1/auth/me
      if (!activeUser) {
        try {
          const sessionUser = await checkSession();
          if (sessionUser) {
            activeUser = {
              id: sessionUser.id,
              workerId: sessionUser.workerId || '',
              email: sessionUser.email,
              name: sessionUser.name || 'Social Media Specialist',
              role: sessionUser.role,
              permissions: sessionUser.permissions || [],
              passwordChangeCount: sessionUser.passwordChangeCount || 0,
              ktpUploaded: sessionUser.ktpUploaded || false,
              phone: sessionUser.phone,
              address: sessionUser.address,
            };
          }
        } catch {
        }
      }

      if (!isMounted) return;

      // Redirect unauthenticated requests to login
      if (!activeUser) {
        setIsAuthorized(false);
        setIsVerifying(false);
        router.replace('/login');
        return;
      }

      // Enforce role requirements for social media team and managerial access
      const roleUpper = (activeUser.role || '').toUpperCase();
      const hasSmAccess =
        roleUpper === 'CONTENT_CREATOR' ||
        roleUpper === 'SMM' ||
        roleUpper === 'SOCIAL_MEDIA' ||
        roleUpper.includes('MARKETING') ||
        roleUpper === 'C_LEVEL' ||
        roleUpper.includes('CMO') ||
        roleUpper === 'SUPER_ADMIN' ||
        Boolean(activeUser.permissions?.includes('*'));

      if (!hasSmAccess) {
        setIsAuthorized(false);
        setIsVerifying(false);
        router.replace('/login');
        return;
      }

      setCurrentUser(activeUser);
      setIsAuthorized(true);
      setIsVerifying(false);
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [contextUser, router]);

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#249990] border-t-transparent" />
          <p className="text-xs text-gray-500 font-medium">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children({ onLogout: handleLogout, user: currentUser })}</>;
};
