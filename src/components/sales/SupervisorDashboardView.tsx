// src/components/sales/SupervisorDashboardView.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  salesService,
  SalesOverviewCards,
  SalesMerchantItem,
  SalesFilterOption,
} from '@/services/salesService';
import { SupervisorSalesMember } from '@/constants/salesSupervisorData';
import { RegisterMerchantModal } from './RegisterMerchantModal';
import { MerchantHistoryModal } from './MerchantHistoryModal';
import { ReassignMerchantModal } from './ReassignMerchantModal';

interface SupervisorDashboardViewProps {
  onSelectStaff?: (staff: SupervisorSalesMember) => void;
}

const PAGE_SIZE = 10;

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

export const SupervisorDashboardView: React.FC<SupervisorDashboardViewProps> = ({ onSelectStaff }) => {
  const [overview, setOverview] = useState<SalesOverviewCards>(DEFAULT_OVERVIEW);
  const [merchants, setMerchants] = useState<SalesMerchantItem[]>([]);
  const [salesOptions, setSalesOptions] = useState<SalesFilterOption[]>([]);
  const [selectedSalesIds, setSelectedSalesIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedHistoryMerchant, setSelectedHistoryMerchant] = useState<{ id: string; name: string } | null>(null);
  const [selectedReassignMerchant, setSelectedReassignMerchant] = useState<SalesMerchantItem | null>(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch sales checklist filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await salesService.getFilterOptions();
        if (res?.salesOptions && res.salesOptions.length > 0) {
          setSalesOptions(res.salesOptions);
        }
      } catch {
        // Fallback default options
      }
    };
    fetchOptions();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await salesService.getSalesDashboard({
        date: selectedDate,
        salesIds: selectedSalesIds.length > 0 ? selectedSalesIds.join(',') : undefined,
        status: statusFilter,
        search: searchQuery.trim() || undefined,
      });

      if (res) {
        if (res.overview) setOverview(res.overview);
        if (Array.isArray(res.merchants)) setMerchants(res.merchants);
        if (Array.isArray(res.filterSalesOptions) && res.filterSalesOptions.length > 0 && salesOptions.length === 0) {
          setSalesOptions(res.filterSalesOptions);
        }
      }
    } catch (err) {
      console.warn("Menggunakan data fallback untuk dashboard supervisor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchDashboard();
  }, [selectedDate, statusFilter, selectedSalesIds]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchDashboard();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSalesFilter = (id: string) => {
    setSelectedSalesIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSalesIds.length === salesOptions.length) {
      setSelectedSalesIds([]);
    } else {
      setSelectedSalesIds(salesOptions.map((m) => m.id));
    }
  };

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

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(merchants.length / PAGE_SIZE));
  const paginatedMerchants = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return merchants.slice(start, start + PAGE_SIZE);
  }, [merchants, currentPage]);

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
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard Supervisor Sales</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitoring performa seluruh tim sales, rotasi binaan toko, dan evaluasi kepatuhan merchant
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Daftarkan Toko Baru */}
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
            <h2 className="text-base font-bold text-gray-900">Support Operations Overview (Tim Sales)</h2>
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

            {/* Export CSV Report */}
            <a
              href={salesService.getExportReportUrl(selectedDate)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs transition-colors"
              title="Unduh laporan kinerja tim sales format CSV"
            >
              <span>Export CSV</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>

        {/* 5 Cards Overview */}
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
                  Total Estimasi Insentif Tim: <span className="text-teal-700 font-black">{overview.incentiveSummary.formattedEstimatedIncentive}</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  {overview.incentiveSummary.achievedMonthlyStores} toko binaan telah mencapai target bulanan &amp; {overview.incentiveSummary.achievedWeeklyStores} toko mencapai target mingguan.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-teal-600 text-white rounded-full shadow-2xs whitespace-nowrap">
              Supervisor Overview
            </span>
          </div>
        )}
      </section>

      {/* SECTION 2: Team Capacity (Toko Binaan Tim Sales) */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Team Capacity / Toko Binaan Tim Sales</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Pengawasan kinerja tim, penugasan ulang binaan toko, dan pemenuhan target harian
            </p>
          </div>

          {/* Search bar & Filter Sales Checklist Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Multi-Select Checklist Sales */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowFilterDropdown((prev) => !prev)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-2xs transition-colors"
              >
                <span>Filter Sales {selectedSalesIds.length > 0 ? `(${selectedSalesIds.length})` : '(Semua)'}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Filter Checklist Popup */}
              {showFilterDropdown && (
                <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 p-4 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">Filter Perwakilan Sales</span>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[11px] font-semibold text-teal-600 hover:underline"
                    >
                      {selectedSalesIds.length === salesOptions.length
                        ? 'Batal Pilih'
                        : 'Pilih Semua'}
                    </button>
                  </div>

                  <div className="py-2 space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {salesOptions.length === 0 ? (
                      <p className="text-xs text-gray-400 py-2 text-center">Memuat opsi tim sales...</p>
                    ) : (
                      salesOptions.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center justify-between text-xs text-gray-700 hover:bg-teal-50/60 p-2 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={selectedSalesIds.includes(member.id)}
                              onChange={() => toggleSalesFilter(member.id)}
                              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
                            />
                            <div>
                              <span className="font-semibold text-gray-900 block leading-tight">{member.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{member.workerId}</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                            {member.storeCount} Toko
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
            <div className="relative w-60">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari Merchant, Toko, Sales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead className="bg-[#f8fafc] text-gray-600 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Assigned Sales Rep</th>
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
                  <td colSpan={8} className="py-14 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg className="w-6 h-6 animate-spin text-teal-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Memuat data merchant seluruh tim...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedMerchants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Tidak ada data merchant yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedMerchants.map((m) => {
                  const isExpanded = expandedId === m.id;
                  const daily = m.expandableDailySubColumns;
                  const isOnline = m.status === 'Online' || m.status === 'OPEN';
                  const salesName = m.salesRep || m.assignedSales?.name || m.sales?.name || 'Sales Staff';
                  const salesWorkerId = m.salesWorkerId || m.assignedSales?.workerId || m.sales?.workerId || 'SLS';

                  return (
                    <React.Fragment key={m.id}>
                      <tr className="hover:bg-gray-50/70 transition-colors">
                        {/* Kolom Assigned Sales Rep */}
                        <td className="py-3.5 px-4 font-medium text-gray-900">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {salesName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 leading-tight">{salesName}</div>
                              <div className="text-[10px] text-gray-400 font-mono font-medium">({salesWorkerId})</div>
                            </div>
                          </div>
                        </td>

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
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs ${
                              isOnline
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Klik untuk mengubah status Buka / Tutup toko"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                            <span>{isOnline ? 'Online' : 'Tutup'}</span>
                          </button>
                        </td>

                        {/* Monthly Goals */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            m.monthlyGoals === 'Achieved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {m.monthlyGoals === 'Achieved' ? '✓ Tercapai' : '✕ Belum'}
                          </span>
                        </td>

                        {/* Weekly Goals */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            m.weeklyGoals === 'Achieved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {m.weeklyGoals === 'Achieved' ? '✓ Tercapai' : '✕ Belum'}
                          </span>
                        </td>

                        {/* Daily Goals (Tampilan Ringkas, Intuitif & Elegan) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200/90 rounded-xl px-2 py-1 shadow-2xs">
                            <span
                              title={`Jam Buka: ${daily?.minimumOpenHours?.value ?? 0} Jam (Target ≥ 6 Jam)`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                daily?.minimumOpenHours?.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200/70 text-gray-600'
                              }`}
                            >
                              ⏱ {daily?.minimumOpenHours?.value ?? 0}j
                            </span>
                            <span
                              title={`Postingan: ${daily?.numberOfPostsToday?.value ?? 0} (Target ≥ 1 Post)`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                daily?.numberOfPostsToday?.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200/70 text-gray-600'
                              }`}
                            >
                              📝 {daily?.numberOfPostsToday?.value ?? 0}p
                            </span>
                            <span
                              title={`Balasan Sinyal: ${daily?.signalPostReplyToday?.value ?? 0} (Target ≥ 1)`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                daily?.signalPostReplyToday?.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200/70 text-gray-600'
                              }`}
                            >
                              💬 {daily?.signalPostReplyToday?.value ?? 0}b
                            </span>

                            {/* Tombol Rincian Harian yang Halus */}
                            <button
                              type="button"
                              onClick={() => toggleExpand(m.id)}
                              className={`ml-1 p-1 rounded-md transition-colors ${
                                isExpanded ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
                              }`}
                              title={isExpanded ? 'Tutup rincian harian' : 'Buka rincian harian'}
                            >
                              <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </td>

                        {/* Aksi: Follow-up WA, Pindahkan Binaan (Reassign), Riwayat 30H */}
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {m.whatsappReminderUrl && (
                            <a
                              href={m.whatsappReminderUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center space-x-1 shadow-2xs transition-colors"
                              title="Kirim pesan pengingat ke pemilik via WhatsApp"
                            >
                              <span>WA</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedReassignMerchant(m)}
                            className="px-2.5 py-1 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg transition-colors border border-teal-200 shadow-2xs"
                            title="Pindahkan binaan toko ke sales lain"
                          >
                            Pindahkan
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedHistoryMerchant({ id: m.id, name: m.store?.name || m.merchantInvited?.name })}
                            className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-300 shadow-2xs"
                            title="Lihat riwayat kepatuhan 30 hari"
                          >
                            Riwayat 30H
                          </button>
                        </td>
                      </tr>

                      {/* Sub-Kolom Harian yang Di-expand (Desain Elegan) */}
                      {isExpanded && daily && (
                        <tr className="bg-teal-50/20">
                          <td colSpan={8} className="p-4">
                            <div className="border border-teal-200/70 rounded-2xl p-4 bg-white shadow-xs max-w-3xl mx-auto">
                              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>📅</span>
                                  <span>Rincian Kepatuhan Harian: {m.store?.name}</span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {daily.date || selectedDate}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Minimum Open Hours */}
                                <div className="text-center p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                                  <p className="text-[11px] text-gray-500 font-medium">Jam Buka (Target ≥ 6 Jam)</p>
                                  <p className={`text-sm font-black mt-1 ${daily.minimumOpenHours.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {daily.minimumOpenHours.value} Jam [{daily.minimumOpenHours.icon}]
                                  </p>
                                </div>

                                {/* Number of Posts Today */}
                                <div className="text-center p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                                  <p className="text-[11px] text-gray-500 font-medium">Postingan (Target ≥ 1 Post)</p>
                                  <p className={`text-sm font-black mt-1 ${daily.numberOfPostsToday.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {daily.numberOfPostsToday.value} Post [{daily.numberOfPostsToday.icon}]
                                  </p>
                                </div>

                                {/* Signal Post Reply */}
                                <div className="text-center p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                                  <p className="text-[11px] text-gray-500 font-medium">Sinyal Balasan (Target ≥ 1)</p>
                                  <p className={`text-sm font-black mt-1 ${daily.signalPostReplyToday.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {daily.signalPostReplyToday.value} Reply [{daily.signalPostReplyToday.icon}]
                                  </p>
                                </div>
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

        {/* Pagination Footer (Maksimal 10 baris per halaman) */}
        <div className="px-6 py-4 border-t border-gray-200/80 bg-gray-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-gray-500 font-medium">
            <span>Menampilkan </span>
            <span className="font-bold text-gray-900">
              {merchants.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            </span>
            <span> - </span>
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * PAGE_SIZE, merchants.length)}
            </span>
            <span> dari </span>
            <span className="font-bold text-gray-900">{merchants.length}</span>
            <span> merchant</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                Sebelumnya
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all shadow-2xs text-xs ${
                        currentPage === pNum
                          ? 'bg-teal-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal Registrasi Merchant Baru */}
      <RegisterMerchantModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={fetchDashboard}
        defaultReferralCode="SS01"
      />

      {/* Modal Riwayat 30 Hari */}
      <MerchantHistoryModal
        isOpen={!!selectedHistoryMerchant}
        merchantId={selectedHistoryMerchant?.id || null}
        storeName={selectedHistoryMerchant?.name}
        onClose={() => setSelectedHistoryMerchant(null)}
      />

      {/* Modal Pindahkan Binaan Toko (Reassign) */}
      <ReassignMerchantModal
        isOpen={!!selectedReassignMerchant}
        merchantId={selectedReassignMerchant?.id || null}
        merchantName={selectedReassignMerchant?.merchantInvited?.name}
        storeName={selectedReassignMerchant?.store?.name}
        currentSalesName={selectedReassignMerchant?.salesRep || selectedReassignMerchant?.assignedSales?.name}
        salesOptions={salesOptions}
        onClose={() => setSelectedReassignMerchant(null)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};
