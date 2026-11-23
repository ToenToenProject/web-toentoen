// src/types/auth.ts
// Standar Otorisasi & Hak Akses (RBAC) ToenToen Front-End

export type UserRole =
  | 'ADMIN'
  | 'ADMIN_SPV'
  | 'SUPERVISOR_ADMIN'
  | 'SALES'
  | 'SALES_MARKETING_SPV'
  | 'CONTENT_CREATOR'
  | 'CMO'
  | string;

export interface UserSession {
  id: string;
  workerId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  passwordChangeCount: number;
  ktpUploaded: boolean;
  phone?: string | null;
  address?: string | null;
}

// Permissions Resmi Backend ToenToen
export const PERMISSIONS = {
  // CS / Admin Staff
  TICKETS_MANAGE: 'tickets:manage',
  CHAT_HANDLE: 'chat:handle',

  // CS / Admin Supervisor
  TICKETS_VIEW_ALL: 'tickets:view_all',
  CHAT_VIEW_ALL: 'chat:view_all',
  CHAT_MANAGE: 'chat:manage',
  SUPERVISOR_ACCESS: 'supervisor:access',
  REPORTS_CS_EVALUATIONS: 'reports:cs_evaluations',
  KYC_VIEW_ALL: 'kyc:view_all',
  KYC_VIEW_DETAIL: 'kyc:view_detail',
  KYC_REVIEW: 'kyc:review',

  // Sales Staff
  SALES_OWN_DASHBOARD: 'sales:own_dashboard',
  SALES_MERCHANTS: 'sales:merchants',

  // Sales Supervisor
  SALES_VIEW_ALL: 'sales:view_all',
  SALES_MANAGE: 'sales:manage',
  REPORTS_SALES_MATRIX: 'reports:sales_matrix',

  // SMM
  SMM_ACCESS: 'smm:access',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[PermissionKey];
