"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { kycApi, pick, type AnyRecord, type KycRole, type KycStatus } from '@/constants/api/admin/kyc';
import KycStatusBadge from '@/components/admin/kyc/KycStatusBadge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PERMISSIONS } from '@/types/auth';
import { ShowEntriesDropdown } from '@/components/common/ShowEntriesDropdown';

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

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const hasNext = totalPages != null ? page < totalPages : items.length === limit;

  return (
    <main className="w-full bg-white min-h-screen p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Verifikasi KYC</h1>
        <p className="text-sm text-gray-500">Daftar pengajuan verifikasi identitas (KTP, dll).</p>
      </div>

      {/* FILTER */}
      <div className="border border-gray-300 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as KycStatus); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value as KycRole); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
        >
          {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <form onSubmit={onSearch} className="flex gap-2 flex-1 min-w-[220px]">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama, email, NIK..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 text-gray-700"
          />
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Cari
          </button>
        </form>
        <button onClick={load} className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          Refresh
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
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Tidak ada data.</td></tr>
            ) : (
              items.map((item, idx) => {
                const accountId = String(pick(item, ['accountId', 'account_id', 'account.id', 'userId', 'user_id', 'id']) ?? '');
                const itemRole = pick(item, ['role', 'kycRole', 'type']);
                const name = pick(item, ['name', 'fullName', 'full_name', 'account.name', 'user.name', 'ktpName', 'ktp_name']);
                const contact = pick(item, ['email', 'account.email', 'user.email', 'phone', 'phoneNumber', 'account.phone']);
                const st = pick(item, ['status', 'kycStatus', 'kyc_status']);
                const date = pick(item, ['submittedAt', 'submitted_at', 'createdAt', 'created_at', 'updatedAt']);
                const href = `/login/admin/supervisor/kyc/${encodeURIComponent(accountId)}${
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
      allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN']}
      requiredPermission={PERMISSIONS.KYC_VIEW_ALL}
    >
      <SupervisorKycContent />
    </RoleGuard>
  );
}
