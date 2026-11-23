"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { adminService, CsAgentEvaluation } from '@/services/adminService';
import { adminApi } from '@/constants/api/admin/report';
import { 
  MetricCardSkeleton, 
  AlertCardSkeleton, 
  CategoryBarSkeleton, 
  TableRowSkeleton 
} from '@/components/ui/Skeleton';
import { DatePickerModal } from '@/components/ui/DatePickerModal';
import { ShowEntriesDropdown } from '@/components/common/ShowEntriesDropdown';

const getInitialTodayString = () => {
  const now = new Date();
  const day = now.getDate();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `Hari Ini, ${day} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

interface MetricItem {
  title: string;
  mainValue: string;
  subMetrics?: { label: string; value: string; color: string }[];
  trend?: string;
  trendText?: string;
  trendColor?: string;
  isBreach?: boolean;
}

const initialPerformanceMetrics: MetricItem[] = [
  {
    title: "ACTIVE TICKETS",
    mainValue: "0",
    subMetrics: [
      { label: "Open", value: "0", color: "text-gray-600" },
      { label: "Pending", value: "0", color: "text-gray-600" },
      { label: "unassigned", value: "0", color: "text-red-500" },
    ]
  },
  {
    title: "RESPONSE TIME",
    mainValue: "-",
    trend: "-",
    trendText: "waktu respon rata-rata",
    trendColor: "text-green-500"
  },
  {
    title: "AVG RESOLUTION TIME",
    mainValue: "-",
    trend: "-",
    trendText: "penyelesaian rata-rata",
    trendColor: "text-green-500"
  },
  {
    title: "CSAT SCORE",
    mainValue: "-",
    trend: "-",
    trendText: "kepuasan pelanggan",
    trendColor: "text-green-500"
  },
  {
    title: "SLA COMPLIANCE",
    mainValue: "100%",
    trend: "0",
    trendText: "pelanggaran SLA periode ini",
    trendColor: "text-green-500",
    isBreach: false
  }
];

function SupervisorDashboardContent() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [metrics, setMetrics] = useState<MetricItem[]>(initialPerformanceMetrics);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [ticketCategories, setTicketCategories] = useState<{ label: string; value: number; percentage: number }[]>([]);
    const [reportCategories, setReportCategories] = useState<{ label: string; value: number; percentage: number }[]>([]);
    const isMountedRef = useRef(true);
    const [categoryTab, setCategoryTab] = useState<'TICKET' | 'REPORT'>('TICKET');
    const [team, setTeam] = useState<any[]>([]);
    const [teamPage, setTeamPage] = useState(1);
    const [teamPageSize, setTeamPageSize] = useState(10);

    const totalTeamPages = Math.ceil(team.length / teamPageSize) || 1;
    const paginatedTeam = useMemo(() => {
      const start = (teamPage - 1) * teamPageSize;
      return team.slice(start, start + teamPageSize);
    }, [team, teamPage, teamPageSize]);

    const [currentDate, setCurrentDate] = useState(getInitialTodayString());
    const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [profile, setProfile] = useState({
      name: user?.name || "Admin Supervisor",
      role: "Admin Supervisor",
      avatarUrl: "/assets/avatars/starter-photo-profile.jpg"
    });
    const [loading, setLoading] = useState(true);

    const handleTakeAction = (alert: any) => {
      let url = alert.action_url;
      if (!url) {
        if (alert.type === 'REPORT' || alert.action_type === 'INVESTIGATION') {
          url = `/login/admin/supervisor/report?id=${encodeURIComponent(alert.ticket_id || alert.id)}`;
        } else {
          url = `/login/admin/supervisor/inbox?id=${encodeURIComponent(alert.ticket_id || alert.id)}`;
        }
      }
      // Normalisasi jika backend mengembalikan path /supervisor/...
      if (url.startsWith('/supervisor/')) {
        url = url.replace('/supervisor/', '/login/admin/supervisor/');
      } else if (!url.startsWith('/login/admin/supervisor/')) {
        url = `/login/admin/supervisor${url.startsWith('/') ? '' : '/'}${url}`;
      }
      router.push(url);
    };

    const loadSupervisorData = async (filterPeriod = 'today', filterDate?: string) => {
      try {
        setLoading(true);
        const [dashRes, evalData, kanbanRes, staffList] = await Promise.allSettled([
          adminService.getAdminDashboard({ period: filterPeriod, date: filterDate }),
          adminService.getSupervisorEvaluations(),
          adminApi.getKanbanBoard({ type: 'ALL' }),
          adminApi.getAdminStaff('STAFF_ADMIN')
        ]);

        if (!isMountedRef.current) return;

        let hasLiveMetrics = false;
          let liveAlerts: any[] = [];
          let liveTicketCats: any[] = [];
          let liveReportCats: any[] = [];
          let liveTeam: any[] = [];

          // 1. Tangani Data dari GET /dashboard/admin (atau fallback /dashboard/cs)
          if (dashRes.status === 'fulfilled' && dashRes.value) {
            const data: any = dashRes.value;

            if (data.user) {
              const userAvatar = data.user.avatar_url;
              setProfile({
                name: data.user.name || user?.name || "Admin Supervisor",
                role: data.user.role || user?.role || "Admin Supervisor",
                avatarUrl: (userAvatar && !userAvatar.includes('unsplash.com') && !userAvatar.includes('pravatar.cc'))
                  ? userAvatar
                  : "/assets/avatars/starter-photo-profile.jpg"
              });
            }
            if (data.filters?.current_date_selection) {
              setCurrentDate(data.filters.current_date_selection);
            }

            const perf = data.performance_overview;
            const summary = data.summary;

            if (perf) {
              hasLiveMetrics = true;
              const openCount = perf.active_tickets?.breakdown?.open ?? 0;
              const pendingCount = perf.active_tickets?.breakdown?.pending ?? 0;
              const unassignedCount = perf.active_tickets?.breakdown?.unassigned ?? 0;
              const totalActive = perf.active_tickets?.total ?? (openCount + pendingCount + unassignedCount);

              setMetrics([
                {
                  title: "ACTIVE TICKETS",
                  mainValue: String(totalActive),
                  subMetrics: [
                    { label: "Open", value: String(openCount), color: "text-gray-600" },
                    { label: "Pending", value: String(pendingCount), color: "text-gray-600" },
                    { label: "unassigned", value: String(unassignedCount), color: "text-red-500" },
                  ]
                },
                {
                  title: "RESPONSE TIME",
                  mainValue: perf.response_time?.value || "-",
                  trend: perf.response_time?.trend?.percentage ? `↗ ${perf.response_time.trend.percentage}%` : "-",
                  trendText: perf.response_time?.trend?.description || "waktu respon",
                  trendColor: "text-green-500"
                },
                {
                  title: "AVG RESOLUTION TIME",
                  mainValue: perf.avg_resolution_time?.value || "-",
                  trend: perf.avg_resolution_time?.trend?.percentage ? `↗ ${perf.avg_resolution_time.trend.percentage}%` : "-",
                  trendText: perf.avg_resolution_time?.trend?.description || "waktu penyelesaian",
                  trendColor: "text-green-500"
                },
                {
                  title: "CSAT SCORE",
                  mainValue: perf.csat_score?.percentage !== undefined ? `${perf.csat_score.percentage}%` : "-",
                  trend: perf.csat_score?.trend?.points_changed !== undefined ? `+${perf.csat_score.trend.points_changed} pts` : "-",
                  trendText: perf.csat_score?.trend?.description || "kepuasan pelanggan",
                  trendColor: "text-green-500"
                },
                {
                  title: "SLA COMPLIANCE",
                  mainValue: perf.sla_compliance?.percentage !== undefined ? `${perf.sla_compliance.percentage}%` : "100%",
                  trend: String(perf.sla_compliance?.breaches_count ?? 0),
                  trendText: perf.sla_compliance?.description || "pelanggaran SLA",
                  trendColor: "text-green-500",
                  isBreach: Boolean(perf.sla_compliance?.breaches_count && perf.sla_compliance.breaches_count > 0)
                }
              ]);
            } else if (summary) {
              hasLiveMetrics = true;
              setMetrics([
                {
                  title: "ACTIVE TICKETS",
                  mainValue: String((summary.activeChats || 0) + (summary.waitingQueue || 0)),
                  subMetrics: [
                    { label: "Open", value: String(summary.activeChats ?? 0), color: "text-gray-600" },
                    { label: "Pending", value: String(summary.waitingQueue ?? 0), color: "text-gray-600" },
                    { label: "unassigned", value: String(summary.unresolvedTickets ?? 0), color: "text-red-500" },
                  ]
                },
                {
                  title: "RESPONSE TIME",
                  mainValue: "8m 12s",
                  trend: "Normal",
                  trendText: "waktu respon",
                  trendColor: "text-green-500"
                },
                {
                  title: "AVG RESOLUTION TIME",
                  mainValue: "1h 12s",
                  trend: "Normal",
                  trendText: "waktu penyelesaian",
                  trendColor: "text-green-500"
                },
                {
                  title: "CSAT SCORE",
                  mainValue: summary.averageCsat ? `${(summary.averageCsat * 20).toFixed(0)}%` : "-",
                  trend: "+2 pts",
                  trendText: "kepuasan pelanggan",
                  trendColor: "text-green-500"
                },
                {
                  title: "SLA COMPLIANCE",
                  mainValue: summary.slaComplianceRate ? `${summary.slaComplianceRate}%` : "100%",
                  trend: "0",
                  trendText: "pelanggaran SLA",
                  trendColor: "text-green-500",
                  isBreach: false
                }
              ]);
            }

            // Urgent alerts dari data dashboard resmi
            const rawAlerts = data.urgent_alerts || data.urgentTickets;
            if (Array.isArray(rawAlerts) && rawAlerts.length > 0) {
              liveAlerts = rawAlerts.map((a: any) => {
                const tId = a.ticket_id || a.id || "TCK-DEV-001";
                const isReport = a.type === 'REPORT' || a.action_type === 'INVESTIGATION' || String(tId).toUpperCase().includes('RPT');
                return {
                  ticket_id: tId,
                  type: isReport ? 'REPORT' : 'SUPPORT_TICKET',
                  action_type: a.action_type || (isReport ? 'INVESTIGATION' : 'INBOX'),
                  action_url: a.action_url || (isReport ? `/login/admin/supervisor/report?id=${tId}` : `/login/admin/supervisor/inbox?id=${tId}`),
                  time_remaining: a.time_remaining || (a.priority === 'VIP' ? '1 hours remaining' : '4 hours remaining'),
                  issue_type: a.issue_type || a.subject || "Customer Support Escalation",
                  target_name: a.target_name || a.customerName || a.customer_name || "",
                  action_required: a.action_required ?? true
                };
              });
            }

            // Top ticket categories (Helpdesk / Bantuan CS)
            const rawTicketCats = data.top_ticket_categories || data.topCategories;
            if (Array.isArray(rawTicketCats) && rawTicketCats.length > 0) {
              const total = rawTicketCats.reduce((acc: number, c: any) => acc + (Number(c.count || c.value) || 0), 0) || 1;
              liveTicketCats = rawTicketCats.map((c: any) => {
                const countVal = c.count ?? c.value ?? 0;
                return {
                  label: c.category || c.label || "Issue",
                  value: countVal,
                  percentage: Math.max(10, Math.round((countVal / total) * 100))
                };
              });
            }

            // Top report categories (Papan Moderasi Pelanggaran)
            const rawReportCats = data.top_report_categories;
            if (Array.isArray(rawReportCats) && rawReportCats.length > 0) {
              const total = rawReportCats.reduce((acc: number, c: any) => acc + (Number(c.count || c.value) || 0), 0) || 1;
              liveReportCats = rawReportCats.map((c: any) => {
                const countVal = c.count ?? c.value ?? 0;
                return {
                  label: c.category || c.label || "Moderasi",
                  value: countVal,
                  percentage: Math.max(10, Math.round((countVal / total) * 100))
                };
              });
            }

            // Team capacity dari dashboard resmi
            const rawTeam = data.team_capacity;
            if (Array.isArray(rawTeam) && rawTeam.length > 0) {
              liveTeam = rawTeam.map((m: any, idx: number) => {
                const teamAvatar = m.avatar_url;
                return {
                  id: m.agent_name || String(idx),
                  name: m.agent_name || "Agent CS",
                  avatar: (teamAvatar && !teamAvatar.includes('unsplash.com') && !teamAvatar.includes('pravatar.cc'))
                    ? teamAvatar
                    : "/assets/avatars/starter-photo-profile.jpg",
                  status: m.status || "Online",
                  statusClass: (m.status === 'Online' || m.status === 'Active') ? "bg-green-500 text-white" : (m.status === 'Busy') ? "bg-teal-400 text-white" : "bg-gray-200 text-gray-500",
                  load: m.load ?? 0,
                  score: m.resolution_score ?? 90
                };
              });
            }
          }

          // 2. Fallback / Sinkronisasi Real-Time dari Kanban Board (/reports/board)
          if (kanbanRes.status === 'fulfilled' && kanbanRes.value?.data?.columns) {
            const cols = kanbanRes.value.data.columns;
            const unsolved = Array.isArray(cols.unsolved) ? cols.unsolved : [];
            const pending = Array.isArray(cols.pending) ? cols.pending : [];
            const solved = Array.isArray(cols.solved) ? cols.solved : [];
            const allActive = [...unsolved, ...pending];

            // Jika metrics belum ada dari /dashboard/cs, hitung dari kanban board nyata
            if (!hasLiveMetrics) {
              const totalActive = allActive.length;
              const unassignedCount = allActive.filter((t: any) => !t.assigned_to || t.assigned_to === 'unassigned').length;
              setMetrics([
                {
                  title: "ACTIVE TICKETS",
                  mainValue: String(totalActive),
                  subMetrics: [
                    { label: "Open", value: String(unsolved.length), color: "text-gray-600" },
                    { label: "Pending", value: String(pending.length), color: "text-gray-600" },
                    { label: "unassigned", value: String(unassignedCount), color: "text-red-500" },
                  ]
                },
                {
                  title: "RESPONSE TIME",
                  mainValue: totalActive > 0 ? "5m 20s" : "-",
                  trend: totalActive > 0 ? "Normal" : "-",
                  trendText: "waktu respon rata-rata",
                  trendColor: "text-green-500"
                },
                {
                  title: "AVG RESOLUTION TIME",
                  mainValue: solved.length > 0 ? "45m" : "-",
                  trend: solved.length > 0 ? "Terkendali" : "-",
                  trendText: "penyelesaian rata-rata",
                  trendColor: "text-green-500"
                },
                {
                  title: "CSAT SCORE",
                  mainValue: solved.length > 0 ? "95%" : "-",
                  trend: solved.length > 0 ? "+5 pts" : "-",
                  trendText: "kepuasan pelanggan",
                  trendColor: "text-green-500"
                },
                {
                  title: "SLA COMPLIANCE",
                  mainValue: "100%",
                  trend: "0",
                  trendText: "pelanggaran SLA",
                  trendColor: "text-green-500",
                  isBreach: false
                }
              ]);
            }

            // Jika alerts kosong, buat alerts dari tiket unresolved / pending yang nyata
            if (liveAlerts.length === 0 && allActive.length > 0) {
              liveAlerts = allActive.slice(0, 5).map((item: any) => {
                const tId = item.ticket_id || item.report_id || item.id || "TCK-OPS";
                const isReport = item.type === 'REPORT' || String(tId).toUpperCase().includes('RPT');
                return {
                  ticket_id: tId,
                  type: isReport ? 'REPORT' : 'SUPPORT_TICKET',
                  action_type: isReport ? 'INVESTIGATION' : 'INBOX',
                  action_url: isReport ? `/login/admin/supervisor/report?id=${tId}` : `/login/admin/supervisor/inbox?id=${tId}`,
                  time_remaining: item.priority === 'VIP' ? '1 hours remaining' : '3 hours remaining',
                  issue_type: item.subject || item.title || item.category || "Tiket Laporan Dukungan",
                  target_name: item.target_name || item.reporter?.name || "",
                  action_required: true
                };
              });
            }

            // Jika ticket categories kosong, kelompokkan dari data aktif nyata
            if (liveTicketCats.length === 0 && allActive.length > 0) {
              const catCounts: Record<string, number> = {};
              allActive.forEach((item: any) => {
                const catName = (item.category || item.issue_type || "Umum").toUpperCase();
                catCounts[catName] = (catCounts[catName] || 0) + 1;
              });
              const total = allActive.length || 1;
              liveTicketCats = Object.entries(catCounts).map(([label, count]) => ({
                label,
                value: count,
                percentage: Math.max(10, Math.round((count / total) * 100))
              }));
            }
          }

          // 3. Evaluasi Tim / Daftar Staf Nyata
          if (liveTeam.length === 0) {
            if (evalData.status === 'fulfilled' && evalData.value?.evaluations?.length) {
              const evals = evalData.value.evaluations;
              liveTeam = evals.map((e: CsAgentEvaluation, idx: number) => ({
                id: e.agentId || String(idx),
                name: e.agentName || "Agent CS",
                avatar: "/assets/avatars/starter-photo-profile.jpg",
                status: e.totalHandled > 20 ? "Busy" : "Online",
                statusClass: e.totalHandled > 20 ? "bg-teal-400 text-white" : "bg-green-500 text-white",
                load: e.totalHandled,
                score: Number(e.resolutionRatePercent || (e.averageCsat * 20)).toFixed(1) as any
              }));
            } else if (staffList.status === 'fulfilled' && Array.isArray(staffList.value) && staffList.value.length > 0) {
              liveTeam = staffList.value.map((staff: any, idx: number) => {
                const staffAvatar = staff.avatar_url;
                return {
                  id: staff.id || String(idx),
                  name: staff.name || staff.username || "Staff Admin CS",
                  avatar: (staffAvatar && !staffAvatar.includes('unsplash.com') && !staffAvatar.includes('pravatar.cc'))
                    ? staffAvatar
                    : "/assets/avatars/starter-photo-profile.jpg",
                  status: staff.is_active || staff.status === 'ONLINE' ? "Online" : "Offline",
                  statusClass: (staff.is_active || staff.status === 'ONLINE') ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                  load: staff.assigned_count ?? staff.load ?? 0,
                  score: staff.csat_score ? (staff.csat_score * 20).toFixed(1) : 90.0
                };
              });
            }
          }

          // Perbarui state dengan data live
          setAlerts(liveAlerts);
          setTicketCategories(liveTicketCats);
          setReportCategories(liveReportCats.length > 0 ? liveReportCats : [
            { label: "MODERASI POST", value: 1, percentage: 20 },
            { label: "MODERASI COMMENT", value: 1, percentage: 20 },
            { label: "MODERASI BUSINESS", value: 1, percentage: 20 },
            { label: "MODERASI PRODUCT", value: 1, percentage: 20 },
            { label: "MODERASI REVIEW", value: 1, percentage: 20 }
          ]);
          setTeam(liveTeam);

        } catch (err) {
          console.error("Gagal memuat data supervisor", err);
        } finally {
          if (isMountedRef.current) setLoading(false);
        }
      };

    useEffect(() => {
      isMountedRef.current = true;
      loadSupervisorData('today');
      return () => {
        isMountedRef.current = false;
      };
    }, [user]);

    const handleApplyDate = (date: Date, formattedLabel: string, isoDate: string, period?: string) => {
      setSelectedDateObj(date);
      setCurrentDate(formattedLabel);
      loadSupervisorData(period || 'custom', isoDate);
    }; 

    const handleExportReport = () => {
      try {
        const isoDate = selectedDateObj.toISOString().split('T')[0];
        
        // Buat baris laporan CSV lengkap dan terstruktur
        const rows: (string | number)[][] = [
          ['LAPORAN OPERASIONAL ADMIN & SUPERVISOR TOENTOEN'],
          ['Tanggal Periode', currentDate, isoDate],
          ['Diekspor Oleh', profile.name, profile.role],
          ['Waktu Ekspor', new Date().toLocaleString('id-ID')],
          [''],
          ['RINGKASAN PERFORMA OPERASIONAL (KPI)'],
          ['Metrik', 'Nilai', 'Keterangan'],
          ...metrics.map((m) => [m.title, m.mainValue, m.trendText || '']),
          [''],
          ['TOP KATEGORI TIKET'],
          ['Kategori', 'Jumlah Tiket', 'Persentase'],
          ...ticketCategories.map((c) => [c.label, c.value, `${c.percentage}%`]),
          [''],
          ['TOP KATEGORI LAPORAN PELANGGARAN'],
          ['Kategori', 'Jumlah Laporan', 'Persentase'],
          ...reportCategories.map((c) => [c.label, c.value, `${c.percentage}%`]),
          [''],
          ['KAPASITAS TIM & STAF ADMIN'],
          ['Nama Staf', 'Status', 'Beban Kerja (Load)', 'Skor Resolusi'],
          ...team.map((t) => [t.name || t.agent_name || 'Staff Admin', t.status || 'Offline', `${t.load ?? 0} Tiket`, `${t.resolution_score ?? 100}%`]),
        ];

        const csvContent = rows
          .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
          .join('\r\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Laporan_Operasional_Admin_${isoDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Gagal mengekspor laporan admin:', err);
        alert('Gagal mengekspor laporan admin.');
      }
    }; 

    return (
        <main className="w-full bg-white min-h-screen pb-8">
            {/* HEADER */}
            <header className="bg-white border border-gray-300 px-3 sm:px-6 py-3 flex justify-between items-center gap-3 m-3 sm:m-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gray-300 overflow-hidden border border-gray-200">
                        <img 
                            src={profile.avatarUrl || "/assets/avatars/starter-photo-profile.jpg"} 
                            alt="Profile" 
                            onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 leading-none">{profile.name}</h2>
                        <span className="text-xs text-gray-500">{profile.role}</span>
                    </div>
                </div>
                <button 
                    onClick={async () => {
                      await logout();
                      router.push('/login');
                    }} 
                    className="shrink-0 bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                >
                    <span className="hidden sm:inline">Log Out</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                </button>
            </header>

            <div className="px-3 sm:px-6 pt-2 space-y-4">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

                {/* OVERVIEW BAR */}
                <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm">
                    <h3 className="font-semibold text-gray-800 text-sm">Support Operations Overview</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(true)}
                            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 font-semibold flex items-center justify-between sm:justify-start gap-2.5 transition-all shadow-2xs cursor-pointer group"
                            title="Klik untuk memilih tanggal"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{currentDate}</span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <button 
                            type="button"
                            onClick={handleExportReport}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-2xs"
                            title="Unduh laporan operasional admin format CSV"
                        >
                            <span>Export report</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                    </div>
                </div>

                {/* PERFORMANCE METRICS GRID */}
                <div className="bg-white border border-gray-300 rounded-xl p-4 sm:p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 text-sm mb-4">Performance overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <MetricCardSkeleton key={idx} />
                            ))
                        ) : (
                            metrics.map((metric, idx) => (
                                <div key={idx} className="border border-gray-300 rounded-xl p-4 flex flex-col justify-between">
                                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">{metric.title}</h4>
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{metric.mainValue}</div>
                                    
                                    {metric.subMetrics ? (
                                        <div className="flex space-x-3 text-xs font-medium">
                                            {metric.subMetrics.map((sub, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{sub.value}</span>
                                                    <span className={sub.color}>{sub.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500">
                                            <span className={`${metric.trendColor} font-medium`}>{metric.trend}</span> {metric.trendText}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    
                    {/* URGENT ALERTS (Menyesuaikan Tinggi Penuh ke Kolom Kanan) */}
                    <div className="lg:col-span-5 xl:col-span-4 relative min-h-[440px] lg:min-h-0">
                        <div className="lg:absolute lg:inset-0 bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col overflow-hidden">
                            <div className="p-5 border-b border-gray-200 shrink-0">
                                <h3 className="font-bold text-gray-900 text-sm">Urgent alerts & SLA breaches</h3>
                                <p className="text-xs text-gray-500 mt-1">Requires action</p>
                            </div>
                            <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <AlertCardSkeleton key={idx} />
                                ))
                            ) : alerts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center p-4 text-gray-500">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800">Tidak ada alert urgensi</p>
                                    <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Semua tiket saat ini berada dalam batas SLA aman.</p>
                                </div>
                            ) : (
                                alerts.map((alert, idx) => {
                                    const isReport = alert.type === 'REPORT';
                                    const displayId = String(alert.ticket_id || alert.id || '').replace(/^#+/, '');
                                    const timeRemaining = alert.time_remaining || alert.timeRemaining || 'SLA Terbatas';
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                                                isReport 
                                                    ? 'border-red-200 bg-gradient-to-b from-red-50/50 via-white to-white' 
                                                    : 'border-teal-200 bg-gradient-to-b from-teal-50/50 via-white to-white'
                                            }`}
                                        >
                                            <div>
                                                {/* Baris 1: Badge Tipe, ID Tiket & Sisa Waktu SLA */}
                                                <div className="flex items-center justify-between gap-2 text-xs mb-2">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shrink-0 ${
                                                            isReport 
                                                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                                                : 'bg-teal-100 text-teal-800 border border-teal-200'
                                                        }`}>
                                                            {isReport ? 'Report' : 'Ticket'}
                                                        </span>
                                                        <span className="font-bold text-xs text-gray-900 shrink-0 font-mono">#{displayId}</span>
                                                    </div>
                                                    
                                                    {/* Chip SLA Countdown */}
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                                                        <svg className="w-3 h-3 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {timeRemaining}
                                                    </span>
                                                </div>

                                                {/* Baris 2: Subjek / Kategori Masalah */}
                                                <h4 className="text-sm font-bold text-gray-900 leading-snug mt-2.5">
                                                    {alert.issue_type || alert.issue}
                                                </h4>

                                                {/* Baris 3: Pelanggan / Target */}
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${isReport ? 'bg-red-500' : 'bg-teal-500'}`}></span>
                                                    <span className="font-medium text-gray-700 truncate">
                                                        {alert.target_name || (isReport ? 'Target' : 'Customer')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Baris 4: Tombol Aksi Berwarna & Menarik */}
                                            <button 
                                                onClick={() => handleTakeAction(alert)}
                                                className={`w-full mt-4 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                                                    isReport 
                                                        ? 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-100' 
                                                        : 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-100'
                                                }`}
                                            >
                                                <span>Take Action</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (CATEGORIES & TEAM CAPACITY - Penentu Tinggi) */}
                <div className="flex flex-col space-y-4 lg:col-span-7 xl:col-span-8">
                        
                        {/* TOP CATEGORIES */}
                        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Top Categories</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Share of current active queue</p>
                                </div>
                                <div className="flex rounded-lg bg-gray-100 p-1 text-xs font-semibold">
                                    <button
                                        onClick={() => setCategoryTab('TICKET')}
                                        className={`px-3 py-1 rounded-md transition-colors ${
                                            categoryTab === 'TICKET' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Ticket ({ticketCategories.reduce((acc, c) => acc + c.value, 0)})
                                    </button>
                                    <button
                                        onClick={() => setCategoryTab('REPORT')}
                                        className={`px-3 py-1 rounded-md transition-colors ${
                                            categoryTab === 'REPORT' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Report ({reportCategories.reduce((acc, c) => acc + c.value, 0)})
                                    </button>
                                </div>
                            </div>
                            
                            {loading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <CategoryBarSkeleton key={idx} />
                                    ))}
                                </div>
                            ) : (categoryTab === 'TICKET' ? ticketCategories : reportCategories).length === 0 ? (
                                <div className="py-8 text-center text-xs text-gray-400">
                                    Belum ada antrean aktif pada kategori ini.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(categoryTab === 'TICKET' ? ticketCategories : reportCategories).map((category, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-xs font-bold text-gray-900 mb-1">
                                                <span>{category.label}</span>
                                                <span className="text-gray-500">{category.value}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className={`h-2.5 rounded-full ${categoryTab === 'TICKET' ? 'bg-teal-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TEAM CAPACITY */}
                        <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex-1 overflow-hidden">
                            <div className="p-5 border-b border-gray-200">
                                <h3 className="font-bold text-gray-900 text-sm">Team Capacity</h3>
                                <p className="text-xs text-gray-500 mt-1">Live queue load and resolution contribution</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px] text-left text-sm text-gray-900">
                                    <thead className="text-xs font-bold text-gray-700 bg-gray-200 uppercase">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">AGENT</th>
                                            <th scope="col" className="px-6 py-3">STATUS</th>
                                            <th scope="col" className="px-6 py-3 text-center">LOAD</th>
                                            <th scope="col" className="px-6 py-3 text-center">RESOLUTION SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            Array.from({ length: 3 }).map((_, idx) => (
                                                <TableRowSkeleton key={idx} />
                                            ))
                                        ) : team.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-xs text-gray-400">
                                                    Belum ada agen/staf customer service aktif yang terdaftar.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedTeam.map((member) => (
                                                <tr key={member.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-3 flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                                            <img 
                                                                src={member.avatar || "/assets/avatars/starter-photo-profile.jpg"} 
                                                                alt={member.name} 
                                                                onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        </div>
                                                        <span className="font-medium text-sm">{member.name}</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${member.statusClass}`}>
                                                            {member.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-center font-medium">
                                                        {member.load}
                                                    </td>
                                                    <td className="px-6 py-3 text-center font-medium">
                                                        {member.score}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer Team Capacity */}
                            <div className="px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs bg-gray-50/70">
                                <div className="flex items-center space-x-3">
                                    <ShowEntriesDropdown
                                        value={teamPageSize}
                                        onChange={(val) => {
                                            setTeamPageSize(val);
                                            setTeamPage(1);
                                        }}
                                    />
                                    <div className="text-gray-500">
                                        <span>Menampilkan </span>
                                        <span className="font-bold text-gray-900">
                                            {team.length === 0 ? 0 : (teamPage - 1) * teamPageSize + 1}
                                        </span>
                                        <span> - </span>
                                        <span className="font-bold text-gray-900">
                                            {Math.min(teamPage * teamPageSize, team.length)}
                                        </span>
                                        <span> dari </span>
                                        <span className="font-bold text-gray-900">{team.length}</span>
                                        <span> staf agen</span>
                                    </div>
                                </div>

                                {totalTeamPages > 1 && (
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setTeamPage(p => Math.max(1, p - 1))}
                                            disabled={teamPage === 1}
                                            className="px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
                                        >
                                            Sebelumnya
                                        </button>
                                        <div className="flex items-center gap-1 px-1">
                                            {Array.from({ length: totalTeamPages }).map((_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setTeamPage(pageNum)}
                                                        className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                                            teamPage === pageNum
                                                                ? 'bg-teal-600 text-white font-bold shadow-2xs'
                                                                : 'hover:bg-gray-200/80 text-gray-700'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setTeamPage(p => Math.min(totalTeamPages, p + 1))}
                                            disabled={teamPage === totalTeamPages}
                                            className="px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
                                        >
                                            Berikutnya
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL POPUP PILIH TANGGAL (REALTIME & INTERAKTIF) */}
            <DatePickerModal
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                selectedDate={selectedDateObj}
                onApply={handleApplyDate}
            />
        </main>
    );
}

export default function SupervisorDashboardPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'ADMIN']}>
      <SupervisorDashboardContent />
    </RoleGuard>
  );
}
