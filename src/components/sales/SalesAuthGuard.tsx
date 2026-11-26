"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, checkSession } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { UserSession } from '@/types/auth';
import { DashboardShellSkeleton } from '@/components/ui/Skeleton';

interface SalesAuthGuardProps {
  allowedRoles?: string[];
  children: (props: { onLogout: () => void; user: UserSession | null }) => React.ReactNode;
}

export const SalesAuthGuard: React.FC<SalesAuthGuardProps> = ({ allowedRoles, children }) => {
  const router = useRouter();
  const { user: contextUser, isLoading: contextLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(contextUser);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      // Fast-path session evaluation from cached storage
      let activeUser: UserSession | null = contextUser;

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
              name: sessionUser.name || 'Sales Representative',
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

      setCurrentUser(activeUser);

      // Enforce role requirements for sales access
      const userRole = (activeUser.role || '').toUpperCase();
      const isSupervisor = userRole.includes('SUPERVISOR') || userRole.includes('SPV') || userRole === 'SALES_MARKETING_SPV';
      const isSalesStaff = userRole === 'SALES' || userRole.includes('SALES');
      const isSuperAdmin =
        userRole === 'SUPER_ADMIN' ||
        userRole === 'C_LEVEL' ||
        userRole === 'CMO' ||
        userRole === 'ADMIN' ||
        Boolean(activeUser.permissions?.includes('*'));
      if (allowedRoles && allowedRoles.length > 0) {
        const hasMatchingRole = allowedRoles.some((r) => r.toUpperCase() === userRole) || isSuperAdmin;
        
        if (!hasMatchingRole) {
          // Redirect field sales staff attempting to access supervisor dashboard
          if (isSalesStaff && !isSupervisor) {
            router.replace('/sales/staff');
            return;
          }
          // Redirect non-sales roles to login
          router.replace('/login');
          return;
        }
      } else {
        if (!isSalesStaff && !isSupervisor && !isSuperAdmin) {
          router.replace('/login');
          return;
        }
      }

      setIsAuthorized(true);
      setIsVerifying(false);
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [contextUser, contextLoading, allowedRoles, router]);
  if (isVerifying || !isAuthorized) {
    return <DashboardShellSkeleton />;
  }

  return <>{children({ onLogout: handleLogout, user: currentUser })}</>;
};
