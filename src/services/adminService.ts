// src/services/adminService.ts
// Modul API Terpadu untuk Customer Service (CS) & Supervisor Admin ToenToen

import { BASE_URL } from "@/constants/api/admin/login";

export interface DashboardUrgentAlert {
  ticket_id: string;
  type: 'SUPPORT_TICKET' | 'REPORT' | string;
  action_type: 'INBOX' | 'INVESTIGATION' | string;
  action_url: string;
  time_remaining: string;
  issue_type: string;
  target_name?: string;
  action_required: boolean;
}

export interface DashboardCategoryItem {
  category: string;
  count: number;
}

export interface DashboardTeamCapacity {
  agent_name: string;
  status: string;
  load: number;
  resolution_score: number;
}

export interface AdminDashboardData {
  user?: {
    name?: string;
    role?: string;
    avatar_url?: string;
  };
  filters?: {
    current_date_selection?: string;
  };
  performance_overview?: {
    active_tickets?: {
      total: number;
      breakdown?: {
        open: number;
        pending: number;
        unassigned: number;
      };
    };
    response_time?: {
      value: string;
      trend?: {
        percentage: number;
        direction: string;
        description: string;
      };
    };
    avg_resolution_time?: {
      value: string;
      trend?: {
        percentage: number;
        direction: string;
        description: string;
      };
    };
    csat_score?: {
      percentage: number;
      trend?: {
        points_changed: number;
        direction: string;
        description: string;
      };
    };
    sla_compliance?: {
      percentage: number;
      breaches_count: number;
      description: string;
    };
  };
  urgent_alerts?: DashboardUrgentAlert[];
  top_ticket_categories?: DashboardCategoryItem[];
  top_report_categories?: DashboardCategoryItem[];
  team_capacity?: DashboardTeamCapacity[];
}

export interface CsSummary {
  activeChats: number;
  waitingQueue: number;
  unresolvedTickets: number;
  averageCsat: number;
  slaComplianceRate: number;
}

export interface UrgentTicket {
  id: string;
  subject: string;
  customerName: string;
  priority: 'VIP' | 'HIGH' | 'NORMAL' | string;
  status: 'QUEUE' | 'IN_PROGRESS' | 'SOLVED' | 'CLOSED' | string;
  createdAt: string;
}

export interface CsDashboardData {
  summary: CsSummary;
  urgentTickets: UrgentTicket[];
  channelBreakdown: {
    webChat: number;
    whatsApp: number;
    inApp: number;
  };
}

export interface TicketCustomer {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  tier?: string;
}

export interface TicketItem {
  id: string;
  ticket_id?: string;
  code?: string;
  subject: string;
  status: 'QUEUE' | 'IN_PROGRESS' | 'SOLVED' | 'CLOSED' | string;
  priority: 'VIP' | 'HIGH' | 'NORMAL' | string;
  customer: TicketCustomer;
  lastMessage: string;
  updatedAt: string;
  channel?: string;
  assignedTo?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'admin' | 'user' | string;
  sender_type?: 'CUSTOMER' | 'AGENT' | 'MERCHANT' | 'SYSTEM' | string;
  component_type?: string;
  is_auto_reply?: boolean;
  senderName?: string;
  sender_name?: string;
  message: string;
  attachmentUrl?: string | null;
  timestamp?: string;
  createdAt: string;
  created_at?: string;
}

export interface CustomerProfile360 {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    tier: string;
    registeredAt: string;
  };
  history: {
    totalOrders: number;
    totalSpent: string;
    totalTickets: number;
    openTickets: number;
  };
}

export interface CsAgentEvaluation {
  agentId: string;
  agentName: string;
  totalHandled: number;
  averageCsat: number;
  firstResponseTimeSeconds: number;
  resolutionRatePercent: number;
  slaBreaches: number;
}

export interface AutoReplySettings {
  id?: string;
  channel: 'ALL' | string;
  isEnabled: boolean;
  greetingMessage: string;
  outsideHoursMsg: string;
  operatingStart: string;
  operatingEnd: string;
  isCurrentlyOnline?: boolean;
}

export interface AutoReplySimulatePayload {
  name: string;
  ticketCode: string;
  category: string;
}

export interface AutoReplySimulateResponse {
  renderedText: string;
  isOnline: boolean;
}

// Helper untuk fetch dengan credentials HTTP-Only Cookie otomatis
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    credentials: "include", // WAJIB: Kirim cookie sesi HTTP-Only
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.message || `Terjadi kesalahan pada server (Status: ${response.status})`;
    throw new Error(errorMsg);
  }

  return json?.data !== undefined ? json.data : json;
}

export const adminService = {
  /**
   * 1. Dashboard Admin & Supervisor Resmi
   * GET /dashboard/admin
   */
  getAdminDashboard: async (params?: { period?: string; date?: string }): Promise<AdminDashboardData> => {
    const query = new URLSearchParams();
    if (params?.period) query.set("period", params.period);
    if (params?.date) query.set("date", params.date);
    const qs = query.toString();
    try {
      return await fetchApi<AdminDashboardData>(`/dashboard/admin${qs ? `?${qs}` : ''}`);
    } catch {
      return await fetchApi<AdminDashboardData>(`/dashboard/cs${qs ? `?${qs}` : ''}`);
    }
  },

  /**
   * Dashboard CS Quick Stats & Urgent Tickets (Legacy / Fallback)
   * GET /dashboard/cs
   */
  getCsDashboard: async (): Promise<CsDashboardData> => {
    return fetchApi<CsDashboardData>("/dashboard/cs");
  },

  /**
   * 2. Ambil Daftar Tiket dengan Filter & Pagination
   * GET /tickets
   */
  getTickets: async (params: {
    search?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ tickets: TicketItem[]; pagination?: { page: number; total: number; totalPages: number } }> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.priority && params.priority !== "all") query.set("priority", params.priority);
    query.set("page", String(params.page || 1));
    query.set("limit", String(params.limit || 20));

    return fetchApi<{ tickets: TicketItem[]; pagination?: { page: number; total: number; totalPages: number } }>(
      `/tickets?${query.toString()}`
    );
  },

  /**
   * 3. Ambil Detail Tiket
   * GET /tickets/:id
   */
  getTicketDetail: async (ticketId: string): Promise<TicketItem> => {
    return fetchApi<TicketItem>(`/tickets/${ticketId}`);
  },

  /**
   * 4. Riwayat Pesan dalam Tiket
   * GET /tickets/:id/messages
   */
  getTicketMessages: async (ticketId: string): Promise<{ messages: TicketMessage[] }> => {
    const res: any = await fetchApi<any>(`/tickets/${ticketId}/messages`);
    const rawList = Array.isArray(res) ? res : (res?.messages || res?.data || []);
    const messages: TicketMessage[] = rawList.map((m: any) => {
      const isSystem = m.sender_type === 'SYSTEM' || m.component_type === 'SYSTEM_ALERT' || m.is_auto_reply || (m.sender_name && m.sender_name.includes('Auto-Responder'));
      const isAgent = m.sender_type === 'AGENT' || m.sender === 'AGENT' || m.sender === 'admin';
      
      return {
        id: m.id || String(Math.random()),
        sender: isSystem ? 'SYSTEM' : (isAgent ? 'AGENT' : 'CUSTOMER'),
        sender_type: m.sender_type,
        component_type: m.component_type,
        is_auto_reply: Boolean(m.is_auto_reply || isSystem),
        senderName: m.sender_name || (isSystem ? 'ToenToen Auto-Responder' : (isAgent ? 'CS Agent' : 'Pelanggan')),
        sender_name: m.sender_name,
        message: m.message,
        timestamp: m.timestamp,
        createdAt: m.created_at || m.createdAt || new Date().toISOString(),
        created_at: m.created_at,
      };
    });
    return { messages };
  },

  /**
   * 5. Kirim Balasan Pesan Tiket (Mendukung parameter status opsional untuk "Send & Solve")
   * POST /tickets/:id/messages
   */
  sendTicketMessage: async (ticketId: string, message: string, status?: string): Promise<TicketMessage> => {
    const payload: Record<string, any> = { message };
    if (status) payload.status = status.toUpperCase();

    const res: any = await fetchApi<any>(`/tickets/${ticketId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const item = res?.data || res;
    return {
      id: item?.id || String(Date.now()),
      sender: 'AGENT',
      sender_type: 'AGENT',
      senderName: item?.sender_name || 'You',
      message: item?.message || message,
      timestamp: item?.timestamp || 'Baru saja',
      createdAt: item?.created_at || new Date().toISOString(),
    };
  },

  /**
   * 6. Pembaruan Status Tiket (QUEUE | IN_PROGRESS | SOLVED | CLOSED)
   * PATCH /tickets/:id/status
   */
  updateTicketStatus: async (
    ticketId: string,
    status: 'QUEUE' | 'IN_PROGRESS' | 'SOLVED' | 'CLOSED' | string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi<{ success: boolean; message: string }>(`/tickets/${ticketId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: status.toUpperCase() }),
    });
  },

  /**
   * 7. Quick Actions: Ambil / Pending / Tolak Tiket
   */
  acceptTicket: async (ticketId: string) => {
    return fetchApi(`/tickets/${ticketId}/accept`, { method: "POST" });
  },
  pendingTicket: async (ticketId: string) => {
    return fetchApi(`/tickets/${ticketId}/pending`, { method: "POST" });
  },
  declineTicket: async (ticketId: string) => {
    return fetchApi(`/tickets/${ticketId}/decline`, { method: "POST" });
  },

  /**
   * 8. Live Chat Antrean
   * GET /chat/queue
   */
  getChatQueue: async (): Promise<{ queue: any[] }> => {
    return fetchApi<{ queue: any[] }>("/chat/queue");
  },

  /**
   * 9. Konteks Pelanggan 360
   * GET /customers/:id
   */
  getCustomerProfile: async (customerId: string): Promise<CustomerProfile360> => {
    return fetchApi<CustomerProfile360>(`/customers/${customerId}`);
  },

  /**
   * 10. Khusus Supervisor: Evaluasi Kinerja CS
   * GET /supervisor/chats/evaluations
   */
  getSupervisorEvaluations: async (): Promise<{ evaluations: CsAgentEvaluation[] }> => {
    return fetchApi<{ evaluations: CsAgentEvaluation[] }>("/supervisor/chats/evaluations");
  },

  /**
   * 11. Khusus Supervisor: Laporan Terpadu
   * GET /supervisor/reports/unified
   */
  getSupervisorUnifiedReport: async (): Promise<any> => {
    return fetchApi("/supervisor/reports/unified");
  },

  /**
   * 12. Auto-Reply / Auto-Blast Settings
   * GET /auto-reply/settings
   */
  getAutoReplySettings: async (): Promise<AutoReplySettings> => {
    return fetchApi<AutoReplySettings>("/auto-reply/settings");
  },

  /**
   * 13. Update Auto-Reply Settings (Khusus Supervisor)
   * PUT /auto-reply/settings
   */
  updateAutoReplySettings: async (settings: Partial<AutoReplySettings>): Promise<AutoReplySettings> => {
    return fetchApi<AutoReplySettings>("/auto-reply/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  /**
   * 14. Simulasi Auto-Reply Preview
   * POST /auto-reply/simulate
   */
  simulateAutoReply: async (payload: AutoReplySimulatePayload): Promise<AutoReplySimulateResponse> => {
    return fetchApi<AutoReplySimulateResponse>("/auto-reply/simulate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * 15. Daftar Staf Admin Aktif
   * GET /admin/staff atau GET /workers?role=STAFF_ADMIN
   */
  getAdminStaff: async (role = 'STAFF_ADMIN'): Promise<{ staff: any[] }> => {
    try {
      const res: any = await fetchApi<any>(`/admin/staff?role=${role}`);
      const list = res?.data || res?.staff || (Array.isArray(res) ? res : []);
      return { staff: list };
    } catch {
      const res: any = await fetchApi<any>(`/workers?role=${role}`).catch(() => ({ data: [] }));
      const list = res?.data || res?.workers || (Array.isArray(res) ? res : []);
      return { staff: list };
    }
  },
};
