// src/components/sales/SalesDashboardView.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  salesService,
  SalesOverviewCards,
  SalesMerchantItem,
} from '@/services/salesService';
import { RegisterMerchantModal } from './RegisterMerchantModal';
import { MerchantHistoryModal } from './MerchantHistoryModal';

const DEFAULT_OVERVIEW: SalesOverviewCards = {
  managedMerchants: {
    value: 10,
    label: "MANAGED MERCHANTS",
    subtitle: "+2 added this week",
    trend: "+2"
  },
  openStores: {
    value: 5,
    label: "OPEN STORES",
    subtitle: "12% portofolio health",
    trend: "12%"
  },
  weeklyGoals: {
    value: "86%",
    numericValue: 86,
    label: "WEEKLY GOALS",
    subtitle: "6% vs last week",
    trend: "6%"
  },
  monthlyGoals: {
    value: "86%",
    numericValue: 86,
    label: "MONTHLY GOALS",
    subtitle: "6% vs last month",
    trend: "6%"
  },
  storeOpenRate: {
    value: "90%",
    numericValue: 90,
    label: "STORE OPEN RATE",
    subtitle: "● Live online now 5 active outlets",
    activeOutlets: 5
  },
  incentiveSummary: {
    achievedMonthlyStores: 8,
    achievedWeeklyStores: 8,
    estimatedIncentiveAmount: 400000,
    formattedEstimatedIncentive: "Rp 400.000"
  }
};

export const SalesDashboardView: React.FC = () => {
  const [overview, setOverview] = useState<SalesOverviewCards>(DEFAULT_OVERVIEW);
  const [merchants, setMerchants] = useState<SalesMerchantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedHistoryMerchant, setSelectedHistoryMerchant] = useState<{ id: string; name: string } | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await salesService.getSalesDashboard({
        date: selectedDate,
        status: statusFilter,
        search: searchQuery.trim() || undefined,
      });

      if (res) {
        if (res.overview) setOverview(res.overview);
        if (Array.isArray(res.merchants)) setMerchants(res.merchants);
      }
    } catch (err) {
      console.warn("Menggunakan data fallback untuk dashboard sales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedDate, statusFilter]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboard();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleToggleStoreStatus = async (merchantId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Online' || currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await salesService.updateStoreStatus(merchantId, nextStatus);
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === merchantId || m.merchantId === merchantId
            ? { ...m, status: nextStatus === 'OPEN' ? 'Online' : 'Closed' }
            : m
        )
      );
    } catch (err: any) {
      alert(`Gagal mengubah status toko: ${err.message || 'Error server'}`);
    }
  };

  const overviewCards = [
    {
      label: overview.managedMerchants?.label || 'MANAGED MERCHANTS',
      value: overview.managedMerchants?.value ?? 0,
      subtitle: overview.managedMerchants?.subtitle || '+2 added this week',
      isHighlight: false,
    },
    {
      label: overview.openStores?.label || 'OPEN STORES',
      value: overview.openStores?.value ?? 0,
      subtitle: overview.openStores?.subtitle || '12% portofolio health',
      isHighlight: false,
    },
    {
      label: overview.weeklyGoals?.label || 'WEEKLY GOALS',
      value: overview.weeklyGoals?.value ?? '0%',
      subtitle: overview.weeklyGoals?.subtitle || 'vs last week',
      isHighlight: false,
    },
    {
      label: overview.monthlyGoals?.label || 'MONTHLY GOALS',
      value: overview.monthlyGoals?.value ?? '0%',
      subtitle: overview.monthlyGoals?.subtitle || 'vs last month',
      isHighlight: false,
    },
    {
      label: overview.storeOpenRate?.label || 'STORE OPEN RATE',
      value: overview.storeOpenRate?.value ?? '0%',
      subtitle: overview.storeOpenRate?.subtitle || 'Live outlets',
      isHighlight: true,
      activeOutlets: overview.storeOpenRate?.activeOutlets,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Sales Lapangan</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manajemen toko binaan, pemenuhan target harian, dan estimasi insentif
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Registrasi Toko Baru */}
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Daftarkan Toko Baru</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Support Operations Overview */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Support Operations Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time merchant onboarding, goals fulfillment &amp; daily active metrics
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Filter Tanggal */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-xl px-3 py-2 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-2xs cursor-pointer"
            />

            {/* Export Report Link (CSV) */}
            <a
              href={salesService.getExportReportUrl(selectedDate)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs transition-colors"
              title="Unduh laporan kinerja format CSV"
            >
              <span>Export CSV</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>

        {/* 5 Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {overviewCards.map((metric, idx) => (
            <div
              key={idx}
              className="border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between bg-white hover:border-teal-300 hover:shadow-xs transition-all"
            >
              <span className="text-[11px] font-bold text-gray-700 tracking-wider">
                {metric.label}
              </span>
              <div className="my-2.5">
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                  {metric.value}
                </span>
              </div>
              <div className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
                {metric.isHighlight ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>{metric.subtitle}</span>
                  </span>
                ) : (
                  <span className="text-teal-700 font-semibold">{metric.subtitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Incentive Summary Banner */}
        {overview.incentiveSummary && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 via-emerald-50/50 to-white border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                💰
              </span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Estimasi Insentif Periode Ini: <span className="text-teal-700 font-black">{overview.incentiveSummary.formattedEstimatedIncentive}</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  {overview.incentiveSummary.achievedMonthlyStores} toko binaan telah mencapai target bulanan &amp; {overview.incentiveSummary.achievedWeeklyStores} toko mencapai target mingguan.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-teal-600 text-white rounded-full shadow-2xs whitespace-nowrap">
              Incentive Active
            </span>
          </div>
        )}
      </section>

      {/* SECTION 2: Team Capacity (Daftar Toko Binaan) */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        {/* Section Heading & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Team Capacity / Toko Binaan</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Status operasional langsung, target mingguan/bulanan, dan pemenuhan tugas harian
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === 'ALL' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('OPEN')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === 'OPEN' ? 'bg-emerald-600 text-white shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CLOSED')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  statusFilter === 'CLOSED' ? 'bg-rose-600 text-white shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Tutup
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari Merchant, Toko..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-200 rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead className="bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Merchant Invited</th>
                <th className="py-3.5 px-4">Store Name / Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Monthly Goals</th>
                <th className="py-3.5 px-4 text-center">Weekly Goals</th>
                <th className="py-3.5 px-4 text-center">Daily Goals</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg className="w-6 h-6 animate-spin text-teal-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Memuat data merchant...</span>
                    </div>
                  </td>
                </tr>
              ) : merchants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    Belum ada data merchant yang ditemukan.
                  </td>
                </tr>
              ) : (
                merchants.map((m) => {
                  const isExpanded = expandedId === m.id;
                  const daily = m.expandableDailySubColumns;
                  const isOnline = m.status === 'Online' || m.status === 'OPEN';

                  return (
                    <React.Fragment key={m.id}>
                      <tr className="hover:bg-gray-50/70 transition-colors">
                        {/* Merchant Invited */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{m.merchantInvited?.name || 'Merchant'}</div>
                          <div className="text-[11px] text-gray-400">ID: {m.merchantInvited?.id || m.merchantId || m.id}</div>
                        </td>

                        {/* Store Name & Category */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{m.store?.name || '-'}</div>
                          <div className="text-[11px] text-gray-500 font-medium">({m.store?.category || 'Umum'})</div>
                        </td>

                        {/* Store Status with Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStoreStatus(m.id, m.status)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs ${
                              isOnline
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-gray-400 hover:bg-gray-500 text-white'
                            }`}
                            title="Klik untuk mengubah status Buka / Tutup toko"
                          >
                            {isOnline ? '● Online' : '○ Tutup'}
                          </button>
                        </td>

                        {/* Monthly Goals */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-bold ${m.monthlyGoals === 'Achieved' ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {m.monthlyGoals === 'Achieved' ? '✓ Achieved' : '✗ Not Achieved'}
                          </span>
                        </td>

                        {/* Weekly Goals */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-bold ${m.weeklyGoals === 'Achieved' ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {m.weeklyGoals === 'Achieved' ? '✓ Achieved' : '✗ Not Achieved'}
                          </span>
                        </td>

                        {/* Daily Goals Expand Button */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleExpand(m.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                              isExpanded 
                                ? 'bg-teal-50 border-teal-300 text-teal-700' 
                                : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
                            }`}
                          >
                            {isExpanded ? 'Tutup Detail ▲' : 'Buka Sub-Kolom ▼'}
                          </button>
                        </td>

                        {/* Aksi: Follow-up WA & Riwayat 30 Hari */}
                        <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                          {m.whatsappReminderUrl && (
                            <a
                              href={m.whatsappReminderUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg inline-flex items-center space-x-1 shadow-2xs transition-colors"
                              title="Kirim pesan pengingat ke pemilik via WhatsApp"
                            >
                              <span>Ingatkan WA</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedHistoryMerchant({ id: m.id, name: m.store?.name || m.merchantInvited?.name })}
                            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200"
                            title="Lihat riwayat kepatuhan 30 hari"
                          >
                            Riwayat 30H
                          </button>
                        </td>
                      </tr>

                      {/* Sub-Kolom Harian yang Di-expand */}
                      {isExpanded && daily && (
                        <tr className="bg-teal-50/30">
                          <td colSpan={7} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border border-teal-200/80 rounded-xl p-3.5 bg-white shadow-2xs">
                              {/* Minimum Open Hours */}
                              <div className="text-center p-2 rounded-lg bg-gray-50/60">
                                <p className="text-[11px] text-gray-500 font-medium">Min. Jam Buka (Target ≥ 6 Jam)</p>
                                <p className={`text-sm font-extrabold mt-0.5 ${daily.minimumOpenHours.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {daily.minimumOpenHours.value} Jam [{daily.minimumOpenHours.icon}]
                                </p>
                              </div>

                              {/* Number of Posts Today */}
                              <div className="text-center p-2 rounded-lg bg-gray-50/60 sm:border-x sm:border-gray-200">
                                <p className="text-[11px] text-gray-500 font-medium">Postingan Hari Ini (Target ≥ 1 Post)</p>
                                <p className={`text-sm font-extrabold mt-0.5 ${daily.numberOfPostsToday.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {daily.numberOfPostsToday.value} Post [{daily.numberOfPostsToday.icon}]
                                </p>
                              </div>

                              {/* Signal Post Reply */}
                              <div className="text-center p-2 rounded-lg bg-gray-50/60">
                                <p className="text-[11px] text-gray-500 font-medium">Balasan Sinyal Interaksi (Target ≥ 1)</p>
                                <p className={`text-sm font-extrabold mt-0.5 ${daily.signalPostReplyToday.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {daily.signalPostReplyToday.value} Reply [{daily.signalPostReplyToday.icon}]
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Registrasi Merchant Baru */}
      <RegisterMerchantModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={fetchDashboard}
        defaultReferralCode="SL01"
      />

      {/* Modal Riwayat 30 Hari */}
      <MerchantHistoryModal
        isOpen={!!selectedHistoryMerchant}
        merchantId={selectedHistoryMerchant?.id || null}
        storeName={selectedHistoryMerchant?.name}
        onClose={() => setSelectedHistoryMerchant(null)}
      />
    </div>
  );
};
