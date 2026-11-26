"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { kycApi, pick, type AnyRecord, type KycRole, type KycStatus } from '@/constants/api/admin/kyc';
import KycStatusBadge from '@/components/admin/kyc/KycStatusBadge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PERMISSIONS } from '@/types/auth';
import { ShowEntriesDropdown } from '@/components/common/ShowEntriesDropdown';
import { KycTableRowSkeleton } from '@/components/ui/Skeleton';

const STATUS_OPTIONS: { value: KycStatus; label: string }[] = [
  { value: 'all', label: 'Semua status' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'unverified', label: 'Unverified' },
];

const ROLE_OPTIONS: { value: KycRole; label: string }[] = [
  { value: 'all', label: 'Semua role' },
  { value: 'owner', label: 'Owner' },
  { value: 'business_admin', label: 'Business Admin' },
];

function formatDate(v: unknown) {
  if (!v) return '-';
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

function SupervisorKycContent() {
  const [status, setStatus] = useState<KycStatus>('all');
  const [role, setRole] = useState<KycRole>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [items, setItems] = useState<AnyRecord[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await kycApi.getSubmissions({ status, role, search, page, limit });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages ?? (res.total != null ? Math.max(1, Math.ceil(res.total / limit)) : null));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data KYC');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status, role, search, page, limit]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) load();
    });
    return () => {
      active = false;
    };
  }, [load]);

    useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

    const displayedItems = useMemo(() => {
    if (!searchInput.trim()) return items;
    const q = searchInput.toLowerCase().trim();
    const cleanQ = q.replace(/[\s.-]/g, '');

    return items.filter((item) => {
      const name = String(pick(item, ['name', 'fullName', 'full_name', 'account.name', 'user.name', 'ktpName', 'ktp_name']) ?? '').toLowerCase();
      const contact = String(pick(item, ['email', 'account.email', 'user.email', 'phone', 'phoneNumber', 'account.phone']) ?? '').toLowerCase();
      const accountId = String(pick(item, ['accountId', 'account_id', 'id']) ?? '').toLowerCase();
      const store = String(pick(item, ['storeName', 'store_name']) ?? '').toLowerCase();
      const nik = String(pick(item, ['ktp.number', 'ktp.nik', 'nik', 'ktpNumber', 'ktp_number', 'ktp_no', 'idCardNumber', 'ktp.no']) ?? '').toLowerCase();
      const cleanNik = nik.replace(/[\s.-]/g, '');
      const ktpName = String(pick(item, ['ktp.name', 'ktpName']) ?? '').toLowerCase();

      return (
        name.includes(q) ||
        contact.includes(q) ||
        accountId.includes(q) ||
        store.includes(q) ||
        ktpName.includes(q) ||
        nik.includes(q) ||
        (cleanQ.length > 2 && cleanNik.includes(cleanQ))
      );
    });
  }, [items, searchInput]);

  const hasNext = totalPages != null ? page < totalPages : items.length === limit;

  return (
    <main className="w-full bg-white min-h-screen p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Verifikasi KYC</h1>
        <p className="text-sm text-gray-500">Daftar pengajuan verifikasi identitas (KTP, dll).</p>
      </div>

      {/* FILTER & REALTIME SEARCH */}
      <div className="border border-gray-300 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as KycStatus); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value as KycRole); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
        >
          {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Realtime Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ketik untuk cari nama, email, NIK, toko..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              title="Hapus pencarian"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button onClick={load} className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}

      {/* TABLE */}
      <div className="border border-gray-300 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-900">
          <thead className="text-xs font-bold text-gray-700 bg-gray-100 uppercase">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email / Telepon</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Diajukan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <KycTableRowSkeleton count={Math.min(limit, 8)} />
            ) : displayedItems.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Tidak ada data KYC yang sesuai.</td></tr>
            ) : (
              displayedItems.map((item, idx) => {
                const accountId = String(pick(item, ['accountId', 'account_id', 'account.id', 'userId', 'user_id', 'id']) ?? '');
                const itemRole = pick(item, ['role', 'kycRole', 'type']);
                const name = pick(item, ['name', 'fullName', 'full_name', 'account.name', 'user.name', 'ktpName', 'ktp_name']);
                const contact = pick(item, ['email', 'account.email', 'user.email', 'phone', 'phoneNumber', 'account.phone']);
                const st = pick(item, ['kycStatus', 'kyc_status', 'status', 'state']);
                const date = pick(item, ['kycSubmittedAt', 'kyc_submitted_at', 'submittedAt', 'submitted_at', 'createdAt', 'created_at', 'updatedAt', 'date']);
                const href = `/admin/supervisor/kyc/${encodeURIComponent(accountId)}${
                  itemRole === 'owner' || itemRole === 'business_admin' ? `?role=${itemRole}` : ''
                }`;
                return (
                  <tr key={`${accountId}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{String(name ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-600">{String(contact ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-600">{String(itemRole ?? '-')}</td>
                    <td className="px-4 py-3"><KycStatusBadge status={st} /></td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(date)}</td>
                    <td className="px-4 py-3 text-right">
                      {accountId ? (
                        <Link href={href} className="border border-gray-900 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-gray-50">
                          Lihat detail
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">ID tidak ada</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        <div className="flex items-center space-x-3">
          <ShowEntriesDropdown
            value={limit}
            onChange={(val) => {
              setLimit(val);
              setPage(1);
            }}
          />
          <span>
            Halaman {page}{totalPages ? ` dari ${totalPages}` : ''}{total != null ? ` - ${total} data` : ''}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border border-gray-300 px-3 py-1.5 rounded-lg disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            disabled={!hasNext || loading}
            onClick={() => setPage((p) => p + 1)}
            className="border border-gray-300 px-3 py-1.5 rounded-lg disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SupervisorKycPage() {
  return (
    <RoleGuard
      allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'C_LEVEL', 'CMO']}
      requiredPermission={PERMISSIONS.KYC_VIEW_ALL}
    >
      <SupervisorKycContent />
    </RoleGuard>
  );
}
