"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/adminService';

import { Header } from '@/components/admin/dashboard/Header';
import { PerformanceGrid } from '@/components/admin/dashboard/PerformanceGrid';
import { UrgentAlerts } from '@/components/admin/dashboard/UrgentAlerts';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { MetricCardSkeleton, AlertCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

function AdminStaffDashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
    const [metricsData, setMetricsData] = useState<any[]>([]);
  const [alertsData, setAlertsData] = useState<any[]>([]);
  const [profile, setProfile] = useState({ name: "", role: "", avatarUrl: "" });
  const [currentDate, setCurrentDate] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const DEFAULT_METRICS = [
    {
      title: "ACTIVE TICKETS",
      mainValue: "500",
      subMetrics: [
        { label: "Open", value: "200", color: "text-gray-600" },
        { label: "Pending", value: "100", color: "text-gray-600" },
        { label: "Unassigned", value: "200", color: "text-red-500" },
      ]
    },
    {
      title: "RESPONSE TIME",
      mainValue: "8m 12s",
      trend: "↗ 12% faster",
      trendText: "than yesterday",
      trendColor: "text-green-500"
    },
    {
      title: "AVG RESOLUTION TIME",
      mainValue: "1h 12s",
      trend: "↗ 6% faster",
      trendText: "than yesterday",
      trendColor: "text-green-500"
    },
    {
      title: "CSAT SCORE",
      mainValue: "90%",
      trend: "+2 pts",
      trendText: "from 500 responses",
      trendColor: "text-green-500"
    },
    {
      title: "SLA COMPLIANCE",
      mainValue: "80%",
      trend: "19",
      trendText: "breaches in current period",
      trendColor: "text-red-500",
      isBreach: true
    }
  ];

  const DEFAULT_ALERTS = [
    {
      id: "TCK-1024",
      timeRemaining: "15m",
      issue: "Payment pending verification"
    },
    {
      id: "TCK-1025",
      timeRemaining: "45m",
      issue: "Merchant onboarding inquiry"
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const userAvatar = (user as any)?.avatar_url;
        setProfile({
          name: user?.name || "Admin Staff",
          role: user?.role || "Customer Service",
          avatarUrl: (userAvatar && !userAvatar.includes('unsplash.com') && !userAvatar.includes('pravatar.cc'))
            ? userAvatar
            : "/assets/avatars/starter-photo-profile.jpg"
        });
        setCurrentDate(new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

        const apiData: any = await adminService.getCsDashboard().catch(() => null);

        if (!apiData) {
          setMetricsData(DEFAULT_METRICS);
          setAlertsData(DEFAULT_ALERTS);
          return;
        }

                if (apiData.summary) {
          const s = apiData.summary;
          const mappedMetrics = [
            {
              title: "ACTIVE TICKETS",
              mainValue: (s.unresolvedTickets ?? 28).toString(),
              subMetrics: [
                { label: "Active Chats", value: (s.activeChats ?? 14).toString(), color: "text-gray-600" },
                { label: "Queue", value: (s.waitingQueue ?? 3).toString(), color: "text-red-500" },
              ]
            },
            {
              title: "RESPONSE TIME",
              mainValue: "24s",
              trend: "↗ 95% faster",
              trendText: "dalam batas SLA",
              trendColor: "text-green-500"
            },
            {
              title: "CSAT SCORE",
              mainValue: `${s.averageCsat ?? 4.8} / 5.0`,
              trend: "+0.3 pts",
              trendText: "kepuasan pelanggan",
              trendColor: "text-green-500"
            },
            {
              title: "SLA COMPLIANCE",
              mainValue: `${s.slaComplianceRate ?? 96.5}%`,
              trend: "96.5%",
              trendText: "target terpenuhi",
              trendColor: "text-green-500",
              isBreach: false
            }
          ];
          setMetricsData(mappedMetrics);

          if (apiData.urgentTickets && Array.isArray(apiData.urgentTickets)) {
            setAlertsData(
              apiData.urgentTickets.map((t: any) => ({
                id: t.id || "TKT-URGENT",
                timeRemaining: t.priority === "VIP" ? "Prioritas VIP" : "Mendesak",
                issue: t.subject || "Tiket Perlu Penanganan",
              }))
            );
          } else {
            setAlertsData(DEFAULT_ALERTS);
          }
        } else if (apiData.performance_overview) {
                    const perf = apiData.performance_overview;
          setMetricsData([
            {
              title: "ACTIVE TICKETS",
              mainValue: perf.active_tickets?.total?.toString() || "0",
              subMetrics: [
                { label: "Open", value: perf.active_tickets?.breakdown?.open?.toString() || "0", color: "text-gray-600" },
                { label: "Pending", value: perf.active_tickets?.breakdown?.pending?.toString() || "0", color: "text-gray-600" },
                { label: "Unassigned", value: perf.active_tickets?.breakdown?.unassigned?.toString() || "0", color: "text-red-500" },
              ]
            },
            {
              title: "RESPONSE TIME",
              mainValue: perf.response_time?.value || "-",
              trend: `↗ ${perf.response_time?.trend?.percentage || 0}%`,
              trendText: perf.response_time?.trend?.description || "",
              trendColor: "text-green-500"
            },
            {
              title: "CSAT SCORE",
              mainValue: `${perf.csat_score?.percentage || 0}%`,
              trend: `+${perf.csat_score?.trend?.points_changed || 0} pts`,
              trendText: perf.csat_score?.trend?.description || "",
              trendColor: "text-green-500"
            },
            {
              title: "SLA COMPLIANCE",
              mainValue: `${perf.sla_compliance?.percentage || 0}%`,
              trend: perf.sla_compliance?.breaches_count?.toString() || "0",
              trendText: perf.sla_compliance?.description || "",
              trendColor: "text-red-500",
              isBreach: true
            }
          ]);
        } else {
          setMetricsData(DEFAULT_METRICS);
          setAlertsData(DEFAULT_ALERTS);
        }

      } catch (err: any) {
        setMetricsData(DEFAULT_METRICS);
        setAlertsData(DEFAULT_ALERTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <main className="w-full bg-gray-50 min-h-screen">
        <Header
          onLogout={handleLogout}
          userName={profile.name}
          userRole={profile.role}
          avatarUrl={profile.avatarUrl}
        />
        <div className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
          <div className="flex flex-wrap justify-between items-end gap-2">
            <Skeleton className="h-7 w-36 rounded-md" />
            <Skeleton className="h-7 w-40 rounded-md" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <Skeleton className="h-4 w-44 rounded" />
              <AlertCardSkeleton />
              <AlertCardSkeleton />
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      <Header 
        onLogout={handleLogout}
        userName={profile.name} 
        userRole={profile.role}
        avatarUrl={profile.avatarUrl}
      />

      <div className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200">
            {currentDate}
          </span>
        </div>

        <PerformanceGrid metrics={metricsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <UrgentAlerts alerts={alertsData} />
        </div>
      </div>
    </main>
  );
}

export default function AdminStaffDashboard() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'ADMIN_SPV', 'SUPERVISOR_ADMIN', 'STAFF']}>
      <AdminStaffDashboardContent />
    </RoleGuard>
  );
}