import { BASE_URL } from "@/constants/api/admin/login";

export interface SalesIncentiveSummary {
  achievedMonthlyStores: number;
  achievedWeeklyStores: number;
  estimatedIncentiveAmount: number;
  formattedEstimatedIncentive: string;
}

export interface SalesOverviewCards {
  date?: string;
  formattedDate?: string;
  managedMerchants: {
    value: number;
    label: string;
    subtitle: string;
    trend: string;
  };
  openStores: {
    value: number;
    label: string;
    subtitle: string;
    trend: string;
  };
  weeklyGoals: {
    value: string;
    numericValue: number;
    label: string;
    subtitle: string;
    trend: string;
  };
  monthlyGoals: {
    value: string;
    numericValue: number;
    label: string;
    subtitle: string;
    trend: string;
  };
  storeOpenRate: {
    value: string;
    numericValue: number;
    label: string;
    subtitle: string;
    activeOutlets: number;
  };
  incentiveSummary?: SalesIncentiveSummary;
}

export interface SalesFilterOption {
  id: string;
  name: string;
  workerId: string;
  referralCode?: string;
  storeCount: number;
  label: string;
}

export interface ExpandableDailySubColumns {
  date: string;
  minimumOpenHours: {
    value: number;
    target: number;
    passed: boolean;
    icon: string;
  };
  numberOfPostsToday: {
    value: number;
    target: number;
    passed: boolean;
    icon: string;
  };
  signalPostReplyToday: {
    value: number;
    target: number;
    passed: boolean;
    icon: string;
  };
}

export interface SalesMerchantItem {
  id: string;
  merchantId?: string;
  sales?: {
    id?: string;
    name: string;
    workerId: string;
    avatarUrl?: string | null;
  };
  assignedSales?: {
    name: string;
    workerId: string;
    avatarUrl?: string | null;
  };
  merchantInvited: {
    name: string;
    id: string;
  };
  store: {
    name: string;
    category: string;
    display: string;
  };
  status: 'Online' | 'Closed' | string;
  monthlyGoals: 'Achieved' | 'Not Achieved' | string;
  weeklyGoals: 'Achieved' | 'Not Achieved' | string;
  dailyGoals: {
    minOpenHours: boolean;
    postsToday: boolean;
    signalReply: boolean;
  };
  expandableDailySubColumns?: ExpandableDailySubColumns;
  ownerPhone?: string | null;
  whatsappReminderUrl?: string | null;
  salesRep?: string;
  salesWorkerId?: string;
  referralCode?: string;
}

export interface SalesPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  nextCursor?: string | null;
}

export interface SalesDashboardData {
  date: string;
  overview: SalesOverviewCards;
  filterSalesOptions?: SalesFilterOption[];
  totalMerchants: number;
  merchants: SalesMerchantItem[];
  pagination?: SalesPaginationMeta;
}

export interface RegisterMerchantPayload {
  name: string;
  storeName: string;
  category: string;
  ownerPhone: string;
  referralCode: string;
  status?: 'OPEN' | 'CLOSED';
}

export interface CheckDuplicateResult {
  isDuplicate: boolean;
  message: string;
  merchant?: {
    id: string;
    storeName: string;
    salesName: string;
  };
}

export interface MerchantHistoryDay {
  date: string;
  openHours: number;
  hasPost: boolean;
  hasReply: boolean;
  isGoalPassed: boolean;
}

export interface MerchantHistoryResponse {
  merchantId: string;
  storeName: string;
  daysTracked: number;
  complianceRate: number;
  history: MerchantHistoryDay[];
}

// API client helper supporting automatic HTTP-only session cookie transmission
async function fetchSalesApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && token.startsWith("ey") ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.message || `Terjadi kesalahan pada server (Status: ${response.status})`;
    throw new Error(errorMsg);
  }

  return json?.data !== undefined ? json.data : json;
}

export const salesService = {
  /**
   * Fetch sales dashboard metrics, filter options, and merchant directory.
   * GET /sales/dashboard
   */
  getSalesDashboard: async (params: {
    date?: string;
    salesId?: string;
    salesIds?: string;
    status?: string;
    search?: string;
    limit?: number;
    page?: number;
    cursor?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<SalesDashboardData> => {
    const query = new URLSearchParams();
    if (params.date) query.set("date", params.date);
    if (params.salesId) query.set("salesId", params.salesId);
    if (params.salesIds) query.set("salesIds", params.salesIds);
    if (params.status && params.status !== "ALL") query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.page) query.set("page", String(params.page));
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const qs = query.toString();
    return fetchSalesApi<SalesDashboardData>(`/sales/dashboard${qs ? `?${qs}` : ''}`);
  },

  /**
   * Fetch sales team filter options for supervisors.
   * GET /sales/filter-options
   */
  getFilterOptions: async (): Promise<{ salesOptions: SalesFilterOption[] }> => {
    return fetchSalesApi<{ salesOptions: SalesFilterOption[] }>("/sales/filter-options");
  },

  /**
   * Validate store name or phone number uniqueness prior to registration.
   * GET /sales/merchants/check-duplicate
   */
  checkDuplicate: async (params: { phone?: string; storeName?: string }): Promise<CheckDuplicateResult> => {
    const query = new URLSearchParams();
    if (params.phone) query.set("phone", params.phone);
    if (params.storeName) query.set("storeName", params.storeName);

    return fetchSalesApi<CheckDuplicateResult>(`/sales/merchants/check-duplicate?${query.toString()}`);
  },

  /**
   * Register a new merchant store.
   * POST /sales/merchants
   */
  registerMerchant: async (payload: RegisterMerchantPayload): Promise<any> => {
    return fetchSalesApi<any>("/sales/merchants", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Toggle merchant operational status (OPEN / CLOSED).
   * PATCH /sales/merchants/:id/status
   */
  updateStoreStatus: async (merchantId: string, status: 'OPEN' | 'CLOSED'): Promise<any> => {
    return fetchSalesApi<any>(`/sales/merchants/${merchantId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Reassign merchant ownership to another sales representative.
   * PATCH /sales/merchants/:id/reassign
   */
  reassignMerchant: async (merchantId: string, payload: { salesId?: string; workerId?: string }): Promise<any> => {
    return fetchSalesApi<any>(`/sales/merchants/${merchantId}/reassign`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Retrieve merchant 30-day compliance history.
   * GET /sales/merchants/:id/history
   */
  getMerchantHistory: async (merchantId: string, days = 30): Promise<MerchantHistoryResponse> => {
    return fetchSalesApi<MerchantHistoryResponse>(`/sales/merchants/${merchantId}/history?days=${days}`);
  },

  /**
   * Generates direct download URL for sales report CSV.
   */
  getExportReportUrl: (date?: string): string => {
    const formattedDate = date || new Date().toISOString().split("T")[0];
    const proxyBase = typeof window !== "undefined" ? window.location.origin : "";
    return `${proxyBase}/api/proxy/sales/export-report?format=csv&date=${formattedDate}`;
  },

  /**
   * Downloads sales performance CSV report with authorization headers.
   */
  exportReport: async (date?: string): Promise<void> => {
    const formattedDate = date || new Date().toISOString().split("T")[0];
    const url = `/sales/export-report?format=csv&date=${formattedDate}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const targetUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        ...(token && token.startsWith("ey") ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Export failed with status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `sales_report_${formattedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },
};
