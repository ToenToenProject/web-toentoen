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

export const PERMISSIONS = {
  // Customer Service staff permissions
  TICKETS_MANAGE: 'tickets:manage',
  CHAT_HANDLE: 'chat:handle',

  // Customer Service supervisor permissions
  TICKETS_VIEW_ALL: 'tickets:view_all',
  CHAT_VIEW_ALL: 'chat:view_all',
  CHAT_MANAGE: 'chat:manage',
  SUPERVISOR_ACCESS: 'supervisor:access',
  REPORTS_CS_EVALUATIONS: 'reports:cs_evaluations',
  KYC_VIEW_ALL: 'kyc:view_all',
  KYC_VIEW_DETAIL: 'kyc:view_detail',
  KYC_REVIEW: 'kyc:review',

  // Sales staff permissions
  SALES_OWN_DASHBOARD: 'sales:own_dashboard',
  SALES_MERCHANTS: 'sales:merchants',

  // Sales supervisor permissions
  SALES_VIEW_ALL: 'sales:view_all',
  SALES_MANAGE: 'sales:manage',
  REPORTS_SALES_MATRIX: 'reports:sales_matrix',

  // Social media management permissions
  SMM_ACCESS: 'smm:access',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[PermissionKey];
