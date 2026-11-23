// src/services/cmoService.ts
// Modul API Khusus Chief Marketing Officer (CMO) ToenToen
// Sesuai Panduan Integrasi API & Hak Akses Universal CMO

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
   * 1. Ambil Ringkasan Performa Support Operations Per Divisi
   * GET /api/v1/cmo/support-overview?date=YYYY-MM-DD
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
      // Fallback data terstruktur
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
   * 2. URL Export Laporan Support Operations (CSV)
   * GET /api/v1/cmo/support-overview/export
   */
  getSupportExportUrl: (date?: string): string => {
    const formattedDate = date || new Date().toISOString().split("T")[0];
    const proxyBase = typeof window !== "undefined" ? window.location.origin : "";
    return `${proxyBase}/api/proxy/cmo/support-overview/export?date=${formattedDate}`;
  },

  /**
   * 3. Ambil Ringkasan Operasi Sosial Media & Kalender
   * GET /api/v1/cmo/social-overview?view=weekly|monthly&date=YYYY-MM-DD
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

      // Coba fallback ke alias endpoint /smm/overview
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
   * 4. Periksa Status Koneksi Kanal Media Sosial
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
   * 5. URL Export Laporan Sosial Media (CSV)
   * GET /api/v1/smm/export-report
   */
  getSocialExportUrl: (): string => {
    const proxyBase = typeof window !== "undefined" ? window.location.origin : "";
    return `${proxyBase}/api/proxy/smm/export-report`;
  },
};
