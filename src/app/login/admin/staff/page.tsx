"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/admin/dashboard/Header';
import { PerformanceGrid } from '@/components/admin/dashboard/PerformanceGrid';
import { UrgentAlerts } from '@/components/admin/dashboard/UrgentAlerts';

export default function AdminStaffDashboard() {
  const router = useRouter();
  
  // State Data Component
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
        const token = localStorage.getItem("token");

        // Jika tidak ada token, gunakan data dummy agar halaman bisa langsung diakses
        if (!token) {
          setProfile({
            name: "Farel Dimas",
            role: "Admin Staff",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&fit=crop"
          });
          setCurrentDate("Today, January 27, 2027");
          setMetricsData(DEFAULT_METRICS);
          setAlertsData(DEFAULT_ALERTS);
          return;
        }

        const res = await fetch("https://api-ops.toentoen.com/api/v1/dashboard/cs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
          }
        });

        if (!res.ok) throw new Error("Gagal mengambil data dari server.");

        const json = await res.json();
        const apiData = json.data; // Mengambil objek 'data' dari struktur JSON lu

        // 1. SET DATA PROFIL & TANGGAL
        setProfile({
          name: apiData.user.name,
          role: apiData.user.role,
          avatarUrl: apiData.user.avatar_url
        });
        setCurrentDate(apiData.filters.current_date_selection);

        // 2. MAPPING DATA PERFORMANCE
        const perf = apiData.performance_overview;
        const mappedMetrics = [
          {
            title: "ACTIVE TICKETS",
            mainValue: perf.active_tickets.total.toString(),
            subMetrics: [
              { label: "Open", value: perf.active_tickets.breakdown.open.toString(), color: "text-gray-600" },
              { label: "Pending", value: perf.active_tickets.breakdown.pending.toString(), color: "text-gray-600" },
              { label: "Unassigned", value: perf.active_tickets.breakdown.unassigned.toString(), color: "text-red-500" },
            ]
          },
          {
            title: "RESPONSE TIME",
            mainValue: perf.response_time.value,
            trend: `↗ ${perf.response_time.trend.percentage}% ${perf.response_time.trend.direction}`,
            trendText: perf.response_time.trend.description,
            trendColor: "text-green-500"
          },
          {
            title: "AVG RESOLUTION TIME",
            mainValue: perf.avg_resolution_time.value,
            trend: `↗ ${perf.avg_resolution_time.trend.percentage}% ${perf.avg_resolution_time.trend.direction}`,
            trendText: perf.avg_resolution_time.trend.description,
            trendColor: "text-green-500"
          },
          {
            title: "CSAT SCORE",
            mainValue: `${perf.csat_score.percentage}%`,
            trend: `+${perf.csat_score.trend.points_changed} pts`,
            trendText: perf.csat_score.trend.description,
            trendColor: "text-green-500"
          },
          {
            title: "SLA COMPLIANCE",
            mainValue: `${perf.sla_compliance.percentage}%`,
            trend: perf.sla_compliance.breaches_count.toString(),
            trendText: perf.sla_compliance.description,
            trendColor: "text-red-500", // SLA breaches pakai warna merah/abu-abu
            isBreach: true
          }
        ];
        setMetricsData(mappedMetrics);

        // 3. MAPPING DATA URGENT ALERTS
        const mappedAlerts = apiData.urgent_alerts.map((alert: any) => ({
          id: alert.ticket_id,
          timeRemaining: alert.time_remaining,
          issue: alert.issue_type
        }));
        setAlertsData(mappedAlerts);

      } catch (err: any) {
        // Fallback jika API gagal / offline
        setProfile({
          name: "Farel Dimas",
          role: "Admin Staff",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&fit=crop"
        });
        setCurrentDate("Today, January 27, 2027");
        setMetricsData(DEFAULT_METRICS);
        setAlertsData(DEFAULT_ALERTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;
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