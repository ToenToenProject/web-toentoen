/**
 * App Accounts Governance API client (/api/v1/app-accounts)
 * Manages customer, owner, and business_admin mobile app accounts.
 */

import { getToken } from './report';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';

export type AppAccountRole = 'customer' | 'owner' | 'business_admin';
export type AppAccountStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'banned'
  | 'pending_deletion';

export type ReasonCategory =
  | 'FRAUD'
  | 'SPAM'
  | 'POLICY_VIOLATION'
  | 'KYC_MISMATCH'
  | 'USER_REQUEST'
  | 'OTHER';

export interface AppAccountsListParams {
  role?: AppAccountRole | 'all';
  status?: AppAccountStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface AppAccountItem {
  accountId: string;
  id?: string;
  role: AppAccountRole | string;
  username?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  status: AppAccountStatus | string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  isBlocked?: boolean;
  businessesCount?: number;
}

export interface AppAccountBusiness {
  id: string;
  name: string;
  category?: string;
  isActive?: boolean;
  is_active?: boolean;
  city?: string;
}

export interface AppAccountAuditLog {
  id: string;
  action?: string;
  previousStatus?: string;
  newStatus?: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  reasonCategory?: string;
  reason_category?: string;
  reasonDetail?: string;
  reason_detail?: string;
  actorId?: string;
  actorName?: string;
  actor_id?: string;
  ipAddress?: string;
  ip_address?: string;
  createdAt?: string;
  created_at?: string;
}

export interface AppAccountDetail extends AppAccountItem {
  businesses?: AppAccountBusiness[];
  blocklistStatus?: {
    isBlocked?: boolean;
    emailBlocked?: boolean;
    phoneBlocked?: boolean;
    activeBlocks?: BlocklistItem[];
  };
  auditLogs?: AppAccountAuditLog[];
}

export interface BlocklistItem {
  id: string;
  blocklistId?: string;
  roleGroup: AppAccountRole | string;
  identifierType: 'EMAIL' | 'PHONE' | string;
  identifierValue: string;
  reasonCategory: ReasonCategory | string;
  reasonDetail: string;
  isActive?: boolean;
  createdAt?: string;
  createdByName?: string;
}

export interface UpdateAccountStatusPayload {
  status: 'active' | 'suspended' | 'banned';
  reasonCategory: ReasonCategory;
  reasonDetail: string;
  blockIdentity?: boolean;
}

export interface AddBlocklistPayload {
  roleGroup: AppAccountRole;
  identifierType: 'EMAIL' | 'PHONE';
  identifierValue: string;
  reasonCategory: ReasonCategory;
  reasonDetail: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const getHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(res: Response, label: string) {
  let body: AnyRecord | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    const msg = (body && (body.message || body.error)) || `${label} Error: ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : `${label} Error: ${res.status}`);
  }
  return body;
}

function normalizeItem(raw: AnyRecord): AppAccountItem {
  return {
    accountId: String(raw.accountId || raw.account_id || raw.id || ''),
    id: raw.id ? String(raw.id) : undefined,
    role: String(raw.role || raw.roleGroup || raw.role_group || 'customer'),
    username: raw.username || undefined,
    fullName: raw.fullName || raw.full_name || raw.name || undefined,
    name: raw.name || raw.fullName || raw.full_name || raw.username || undefined,
    email: raw.email || undefined,
    phoneNumber: raw.phoneNumber || raw.phone_number || raw.phone || undefined,
    phone: raw.phone || raw.phoneNumber || raw.phone_number || undefined,
    status: String(raw.status || 'active'),
    createdAt: raw.createdAt || raw.created_at || undefined,
    updatedAt: raw.updatedAt || raw.updated_at || undefined,
    lastLoginAt: raw.lastLoginAt || raw.last_login_at || undefined,
    isBlocked: Boolean(raw.isBlocked ?? raw.is_blocked),
    businessesCount: typeof raw.businessesCount === 'number' ? raw.businessesCount : undefined,
  };
}

export const appAccountsApi = {
  async getAccounts(params: AppAccountsListParams = {}) {
    const qs = new URLSearchParams();
    if (params.role && params.role !== 'all') qs.set('role', params.role);
    if (params.status && params.status !== 'all') qs.set('status', params.status);
    if (params.search && params.search.trim()) qs.set('search', params.search.trim());
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));

    const query = qs.toString();
    const res = await fetch(`${BASE_URL}/app-accounts${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    const body = await handleResponse(res, 'AppAccounts List');
    const data = body?.data;
    const rawList: AnyRecord[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.accounts)
          ? data.accounts
          : Array.isArray(body?.items)
            ? body.items
            : [];

    const pagination = data?.pagination || body?.pagination || {};
    const page = Number(pagination.page ?? params.page ?? 1);
    const limit = Number(pagination.limit ?? params.limit ?? 20);
    const total =
      pagination.totalItems ?? pagination.total ?? (Array.isArray(rawList) ? rawList.length : null);
    const totalPages =
      pagination.totalPages ?? (total != null ? Math.max(1, Math.ceil(Number(total) / limit)) : null);

    return {
      items: rawList.map(normalizeItem),
      page,
      limit,
      total: total != null ? Number(total) : null,
      totalPages: totalPages != null ? Number(totalPages) : null,
      stats: data?.stats || body?.stats || null,
    };
  },

  async getAccountDetail(id: string): Promise<AppAccountDetail> {
    const res = await fetch(`${BASE_URL}/app-accounts/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    const body = await handleResponse(res, 'AppAccount Detail');
    const raw = body?.data?.account || body?.data || body || {};
    const base = normalizeItem(raw);

    return {
      ...base,
      businesses: Array.isArray(raw.businesses)
        ? raw.businesses
        : Array.isArray(body?.data?.businesses)
          ? body.data.businesses
          : [],
      blocklistStatus: raw.blocklistStatus || body?.data?.blocklistStatus || undefined,
      auditLogs: Array.isArray(raw.auditLogs)
        ? raw.auditLogs
        : Array.isArray(body?.data?.auditLogs)
          ? body.data.auditLogs
          : [],
    };
  },

  async updateAccountStatus(id: string, payload: UpdateAccountStatusPayload) {
    const res = await fetch(`${BASE_URL}/app-accounts/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return handleResponse(res, 'Update AppAccount Status');
  },

  async getBlocklist(roleGroup?: AppAccountRole | 'all'): Promise<BlocklistItem[]> {
    const qs = new URLSearchParams();
    if (roleGroup && roleGroup !== 'all') qs.set('roleGroup', roleGroup);
    const query = qs.toString();

    const res = await fetch(`${BASE_URL}/app-accounts/blocklist${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    const body = await handleResponse(res, 'AppAccounts Blocklist');
    const data = body?.data;
    const rawList: AnyRecord[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(body?.items)
          ? body.items
          : [];

    return rawList.map((item) => ({
      id: String(item.id || item.blocklistId || item.blocklist_id || ''),
      blocklistId: String(item.blocklistId || item.blocklist_id || item.id || ''),
      roleGroup: String(item.roleGroup || item.role_group || 'customer'),
      identifierType: String(item.identifierType || item.identifier_type || 'EMAIL'),
      identifierValue: String(item.identifierValue || item.identifier_value || ''),
      reasonCategory: String(item.reasonCategory || item.reason_category || 'OTHER'),
      reasonDetail: String(item.reasonDetail || item.reason_detail || ''),
      isActive: item.isActive ?? item.is_active ?? true,
      createdAt: item.createdAt || item.created_at || undefined,
      createdByName: item.createdByName || item.created_by_name || undefined,
    }));
  },

  async addToBlocklist(payload: AddBlocklistPayload) {
    const res = await fetch(`${BASE_URL}/app-accounts/blocklist`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return handleResponse(res, 'Add Blocklist');
  },

  async unblockIdentity(blocklistId: string, reasonDetail: string) {
    const res = await fetch(
      `${BASE_URL}/app-accounts/blocklist/${encodeURIComponent(blocklistId)}/unblock`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ reasonDetail }),
      }
    );
    return handleResponse(res, 'Unblock Identity');
  },

  async getAuditLogs(id: string): Promise<AppAccountAuditLog[]> {
    const res = await fetch(
      `${BASE_URL}/app-accounts/${encodeURIComponent(id)}/audit-logs`,
      {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      }
    );
    const body = await handleResponse(res, 'AppAccount Audit Logs');
    const data = body?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.logs)) return data.logs;
    return [];
  },
};
