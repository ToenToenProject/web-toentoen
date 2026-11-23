const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('token') || '';
    // Validate token conforms to standard JWT structure (starts with 'ey')
    return t.startsWith('ey') ? t : '';
  }
  return '';
};

const getHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const adminApi = {
  getKanbanBoard: async (params?: { 
    type?: string; 
    category?: string; 
    subcategory?: string; 
    assigned_to?: string; 
    status?: string; 
    search?: string; 
  }) => {
    try {
      const query = new URLSearchParams();
      if (params?.type && params.type !== 'ALL') {
        query.append('type', params.type === 'ticket' ? 'SUPPORT_TICKET' : params.type.toUpperCase());
      }
      if (params?.category && params.category !== 'ALL' && params.category !== 'all') {
        query.append('category', params.category);
      }
      if (params?.subcategory) {
        query.append('subcategory', params.subcategory);
      }
      if (params?.assigned_to) {
        query.append('assigned_to', params.assigned_to);
      }
      if (params?.status) {
        query.append('status', params.status);
      }
      if (params?.search) {
        query.append('search', params.search);
      }

      const queryString = query.toString();
      const url = `${BASE_URL}/reports/board${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        console.warn(`[adminApi.getKanbanBoard] Gagal memuat data (Status: ${res.status}). Menggunakan data fallback.`);
        return { data: { columns: { unsolved: [], pending: [], solved: [] } } };
      }
      return await res.json();
    } catch (err) {
      console.warn('[adminApi.getKanbanBoard] Network error:', err);
      return { data: { columns: { unsolved: [], pending: [], solved: [] } } };
    }
  },

  getAdminStaff: async (param: string | { role?: string; page?: number; limit?: number; cursor?: string } = 'STAFF_ADMIN') => {
    try {
      const role = typeof param === 'string' ? param : (param.role || 'STAFF_ADMIN');
      const query = new URLSearchParams({ role });
      if (typeof param === 'object') {
        if (param.page) query.set('page', String(param.page));
        if (param.limit) query.set('limit', String(param.limit));
        if (param.cursor) query.set('cursor', param.cursor);
      }
      const qs = query.toString();
      const res = await fetch(`${BASE_URL}/admin/staff?${qs}`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json.staff || [];
      }
      // Fallback to /workers endpoint alias
      const workerRes = await fetch(`${BASE_URL}/workers?${qs}`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (workerRes.ok) {
        const workerJson = await workerRes.json();
        return workerJson.data || workerJson.workers || [];
      }
      return [];
    } catch (err) {
      console.warn('[adminApi.getAdminStaff] Network error:', err);
      return [];
    }
  },

  getReportCategories: async () => {
    try {
      const res = await fetch(`${BASE_URL}/report-categories`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        console.warn(`[adminApi.getReportCategories] Gagal memuat kategori (Status: ${res.status}). Menggunakan kategori default.`);
        return {
          data: [
            { key: "all", label: "All Reports", icon: "shield-alert", count: 8 },
            { key: "business", label: "Merchant / Business", icon: "store", subcategories: ["Fraud / Scam", "Fake Business", "Illegal Products", "Non-responsive Merchant"], count: 2 },
            { key: "product", label: "Products & Listings", icon: "shopping-bag", subcategories: ["Counterfeit / KW", "Prohibited Items", "Misleading Specification", "Expired Goods"], count: 0 },
            { key: "post", label: "Social Posts", icon: "image", subcategories: ["Spam", "Hate Speech", "Inappropriate Media", "Copyright Infringement"], count: 3 },
            { key: "review", label: "Reviews & Ratings", icon: "star", subcategories: ["Defamation", "Fake Reviews", "Offensive Language", "Competitor Sabotage"], count: 2 },
            { key: "comment", label: "Post Comments", icon: "message-circle", subcategories: ["Harassment", "Spam Links / Phishing", "Threats", "Profanity"], count: 1 }
          ]
        };
      }
      return await res.json();
    } catch (err) {
      console.warn('[adminApi.getReportCategories] Network error:', err);
      return {
        data: [
          { key: "all", label: "All Reports", icon: "shield-alert", count: 8 },
          { key: "business", label: "Merchant / Business", icon: "store", subcategories: ["Fraud / Scam", "Fake Business", "Illegal Products", "Non-responsive Merchant"], count: 2 },
          { key: "product", label: "Products & Listings", icon: "shopping-bag", subcategories: ["Counterfeit / KW", "Prohibited Items", "Misleading Specification", "Expired Goods"], count: 0 },
          { key: "post", label: "Social Posts", icon: "image", subcategories: ["Spam", "Hate Speech", "Inappropriate Media", "Copyright Infringement"], count: 3 },
          { key: "review", label: "Reviews & Ratings", icon: "star", subcategories: ["Defamation", "Fake Reviews", "Offensive Language", "Competitor Sabotage"], count: 2 },
          { key: "comment", label: "Post Comments", icon: "message-circle", subcategories: ["Harassment", "Spam Links / Phishing", "Threats", "Profanity"], count: 1 }
        ]
      };
    }
  },

  getLogDetail: async (reportId: string) => {
    if (!reportId) throw new Error("Report ID is required");
    const res = await fetch(`${BASE_URL}/reports/${reportId}/logs`, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Log Detail Error: ${res.status}`);
    return res.json();
  },

  postAdjudication: async (reportId: string, action: string) => {
    if (!reportId) throw new Error("Report ID is required");
    const payload = { status: action }; 
    const res = await fetch(`${BASE_URL}/reports/${reportId}/adjudicate`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Adjudication Error: ${res.status}`);
    return res.json();
  },

  postMessage: async (reportId: string, message: string) => {
    if (!reportId) throw new Error("Report ID is required");
    const payload = { message };
    const res = await fetch(`${BASE_URL}/reports/${reportId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Post Message Error: ${res.status}`);
    return res.json();
  },
};
