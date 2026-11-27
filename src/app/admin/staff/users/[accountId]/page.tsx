"use client";

import React, { use } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppAccountDetailView } from '@/components/admin/users/AppAccountDetailView';

export default function StaffUserDetailPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = use(params);

  return (
    <RoleGuard allowedRoles={['ADMIN', 'STAFF_ADMIN', 'STAFF', 'ADMIN_SPV', 'SUPERVISOR_ADMIN', 'C_LEVEL']}>
      <AppAccountDetailView
        accountId={decodeURIComponent(accountId)}
        backHref="/admin/staff/users"
        readOnly={true}
      />
    </RoleGuard>
  );
}
