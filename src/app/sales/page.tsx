"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShellSkeleton } from '@/components/ui/Skeleton';

export default function SalesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = (user?.role || '').toUpperCase();
        if (role.includes('SUPERVISOR') || role.includes('SPV') || role === 'SALES_MARKETING_SPV') {
          router.replace('/sales/supervisor');
          return;
        }
      }
    } catch {
    }

    router.replace('/sales/staff');
  }, [router]);

  return <DashboardShellSkeleton />;
}
