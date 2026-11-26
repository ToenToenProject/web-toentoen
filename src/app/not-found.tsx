"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardPathByRole } from '@/utils/roleRedirect';
import { DashboardShellSkeleton } from '@/components/ui/Skeleton';

export default function NotFoundPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace(getDashboardPathByRole(user.role));
      return;
    }

    // Fallback check in localStorage before redirecting public visitors to home
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('user');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.role) {
            router.replace(getDashboardPathByRole(parsed.role));
            return;
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    router.replace('/');
  }, [user, isLoading, router]);

  return <DashboardShellSkeleton />;
}
