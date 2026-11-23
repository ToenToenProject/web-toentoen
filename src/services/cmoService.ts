import { CMO_DIVISIONS_DATA, DivisionData, INITIAL_CMO_PROFILE } from "@/constants/cmoData";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || "";
    if (token.startsWith("ey")) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

export interface CmoSupportOverviewResponse {
  date: string;
  divisions: DivisionData[];
}

export interface CmoSocialOverviewResponse {
  date: string;
  kpis: any[];
  calendar: any[];
  teamCapacity: any[];
  divisionChannels: any[];
}

export const cmoService = {
  /**
   * Fetch division-level support operations performance overview.
   * GET /api/v1/cmo/support-overview
   */
  getSupportOverview: async (date?: string): Promise<CmoSupportOverviewResponse> => {
    try {
      const query = new URLSearchParams();
      if (date) query.set("date", date);
      const qs = query.toString();

      const res = await fetch(`${BASE_URL}/cmo/support-overview${qs ? `?${qs}` : ""}`, {
        headers: getHeaders(),
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return json.data;
        }
      }
      // Structured fallback data when upstream API is unreachable
      return {
        date: date || new Date().toISOString().split("T")[0],
        divisions: CMO_DIVISIONS_DATA,
      };
    } catch {
      return {
        date: date || new Date().toISOString().split("T")[0],
        divisions: CMO_DIVISIONS_DATA,
      };
    }
  },

  /**
   * Generates CSV export URL for support operations.
   * GET /api/v1/cmo/support-overview/export
   */
  getSupportExportUrl: (date?: string): string => {
    const formattedDate = date || new Date().toISOString().split("T")[0];
    const proxyBase = typeof window !== "undefined" ? window.location.origin : "";
    return `${proxyBase}/api/proxy/cmo/support-overview/export?date=${formattedDate}`;
  },

  /**
   * Fetch social media operations and publication schedule summary.
   * GET /api/v1/cmo/social-overview
   */
  getSocialOverview: async (view = "weekly", date?: string): Promise<any> => {
    try {
      const query = new URLSearchParams({ view });
      if (date) query.set("date", date);

      const res = await fetch(`${BASE_URL}/cmo/social-overview?${query.toString()}`, {
        headers: getHeaders(),
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }

      // Fallback to /smm/overview alias endpoint
      const smmRes = await fetch(`${BASE_URL}/smm/overview?${query.toString()}`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (smmRes.ok) {
        const json = await smmRes.json();
        return json.data || json;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Query status of connected social media channels.
   * GET /api/v1/smm/channels
   */
  getChannels: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${BASE_URL}/smm/channels`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json.channels || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Generates CSV export URL for social media metrics.
   * GET /api/v1/smm/export-report
   */
  getSocialExportUrl: (): string => {
    const proxyBase = typeof window !== "undefined" ? window.location.origin : "";
    return `${proxyBase}/api/proxy/smm/export-report`;
  },
};
