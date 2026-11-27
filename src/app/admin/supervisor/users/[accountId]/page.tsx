"use client";

import React, { use } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppAccountDetailView } from '@/components/admin/users/AppAccountDetailView';

export default function SupervisorUserDetailPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = use(params);

  return (
    <RoleGuard allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'MANAGERIAL', 'C_LEVEL', 'CMO']}>
      <AppAccountDetailView
        accountId={decodeURIComponent(accountId)}
        backHref="/admin/supervisor/users"
        readOnly={false}
      />
    </RoleGuard>
  );
}
