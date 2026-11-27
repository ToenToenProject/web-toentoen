"use client";

import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppAccountsManager } from '@/components/admin/users/AppAccountsManager';

export default function SupervisorUsersPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'MANAGERIAL', 'C_LEVEL', 'CMO']}>
      <AppAccountsManager detailBasePath="/admin/supervisor/users" readOnly={false} />
    </RoleGuard>
  );
}
