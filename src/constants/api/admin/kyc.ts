/**
 * KYC verification API endpoints and response normalization helpers for administrators.
 */

import { getToken } from './report';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';

export type KycStatus = 'pending' | 'verified' | 'rejected' | 'unverified' | 'all';
export type KycRole = 'owner' | 'business_admin' | 'all';
export type KycReviewRole = 'owner' | 'business_admin';

export interface KycListParams {
  status?: KycStatus;
  role?: KycRole;
  search?: string;
  page?: number;
  limit?: number;
  cursor?: string;
}

// Dynamic record typing for variable backend payload structures
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

export interface KycListResult {
  items: AnyRecord[];
  page: number;
  limit: number;
  total: number | null;
  totalPages: number | null;
  hasMore?: boolean;
  nextCursor?: string | null;
  raw: unknown;
}

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

async function handle(res: Response, label: string) {
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

/** Extracts array payload from diverse backend response envelopes. */
function extractItems(body: AnyRecord | null): AnyRecord[] {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  const d = body.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === 'object') {
    for (const key of ['items', 'submissions', 'data', 'rows', 'results', 'list']) {
      if (Array.isArray(d[key])) return d[key];
    }
  }
  for (const key of ['items', 'submissions', 'rows', 'results']) {
    if (Array.isArray(body[key])) return body[key];
  }
  return [];
}

function extractPagination(body: AnyRecord | null) {
  const src: AnyRecord =
    body?.meta || body?.pagination || body?.data?.meta || body?.data?.pagination || {};
  const num = (v: unknown) => (typeof v === 'number' ? v : v != null && !isNaN(Number(v)) ? Number(v) : null);
  return {
    total: num(src.total ?? src.totalItems ?? src.total_items ?? src.count),
    totalPages: num(src.totalPages ?? src.total_pages ?? src.lastPage ?? src.last_page ?? src.pages),
    hasMore: Boolean(src.hasMore),
    nextCursor: (src.nextCursor as string | null | undefined) ?? null,
  };
}

export const kycApi = {
  /** Fetch paginated list of KYC verification submissions. */
  getSubmissions: async (params: KycListParams = {}): Promise<KycListResult> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const qs = new URLSearchParams({
      status: params.status ?? 'all',
      role: params.role ?? 'all',
      page: String(page),
      limit: String(limit),
    });
    if (params.search && params.search.trim()) qs.set('search', params.search.trim());
    if (params.cursor) qs.set('cursor', params.cursor);

    const res = await fetch(`${BASE_URL}/kyc/submissions?${qs.toString()}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    const body = await handle(res, 'KYC List');
    const { total, totalPages, hasMore, nextCursor } = extractPagination(body);
    return { items: extractItems(body), page, limit, total, totalPages, hasMore, nextCursor, raw: body };
  },

  /** Retrieve detailed KYC submission payload for a specific account. */
  getSubmissionDetail: async (accountId: string, role?: KycReviewRole): Promise<AnyRecord> => {
    if (!accountId) throw new Error('Account ID is required');
    const qs = role ? `?role=${encodeURIComponent(role)}` : '';
    const res = await fetch(`${BASE_URL}/kyc/submissions/${encodeURIComponent(accountId)}${qs}`, {
      headers: getHeaders(),
      credentials: "include",
    });
    const body = await handle(res, 'KYC Detail');
    return (body && typeof body.data === 'object' && body.data !== null ? body.data : body) || {};
  },

  /** Approve KYC submission. */
  approve: async (accountId: string, role?: KycReviewRole, notes?: string) => {
    if (!accountId) throw new Error('Account ID is required');
    const noteText = notes || 'Dokumen KYC telah disetujui.';
    const res = await fetch(`${BASE_URL}/kyc/review/${encodeURIComponent(accountId)}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ role, action: 'APPROVE', notes: noteText }),
    });
    return handle(res, 'KYC Approve');
  },

  /** Reject KYC submission with minimum word count validation. */
  reject: async (accountId: string, role: KycReviewRole | undefined, rejectionReason: string) => {
    if (!accountId) throw new Error('Account ID is required');
    const wordCount = rejectionReason.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 5) throw new Error('Alasan penolakan minimal 5 kata.');
    const noteText = rejectionReason.trim();
    const res = await fetch(`${BASE_URL}/kyc/review/${encodeURIComponent(accountId)}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({
        role,
        action: 'REJECT',
        notes: noteText,
        rejectionReason: noteText,
      }),
    });
    return handle(res, 'KYC Reject');
  },
};

/** Resolves first truthy key path from object (supports dot notation). */
export function pick(obj: AnyRecord | null | undefined, keys: string[]): unknown {
  if (!obj) return undefined;
  for (const k of keys) {
    const v = k.split('.').reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as AnyRecord)[part] : undefined), obj);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}
