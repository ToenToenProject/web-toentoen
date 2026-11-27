"use client";

import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppAccountsManager } from '@/components/admin/users/AppAccountsManager';

export default function StaffUsersPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'STAFF_ADMIN', 'STAFF', 'ADMIN_SPV', 'SUPERVISOR_ADMIN', 'C_LEVEL']}>
      <AppAccountsManager detailBasePath="/admin/staff/users" readOnly={true} />
    </RoleGuard>
  );
}
