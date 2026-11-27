"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  appAccountsApi,
  type AppAccountItem,
  type AppAccountRole,
  type AppAccountStatus,
  type BlocklistItem,
  type ReasonCategory,
} from '@/constants/api/admin/appAccounts';
import {
  AppAccountRoleBadge,
  AppAccountStatusBadge,
} from './AppAccountStatusBadge';
import { ShowEntriesDropdown } from '@/components/common/ShowEntriesDropdown';
import { KycTableRowSkeleton } from '@/components/ui/Skeleton';

const ROLE_OPTIONS: { value: AppAccountRole | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua role' },
  { value: 'customer', label: 'Customer' },
  { value: 'owner', label: 'Owner' },
  { value: 'business_admin', label: 'Business Admin' },
];

const STATUS_OPTIONS: { value: AppAccountStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'banned', label: 'Banned' },
  { value: 'pending_deletion', label: 'Pending Deletion' },
];

const REASON_OPTIONS: { value: ReasonCategory; label: string }[] = [
  { value: 'FRAUD', label: 'Fraud / Penipuan' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'POLICY_VIOLATION', label: 'Pelanggaran Kebijakan' },
  { value: 'KYC_MISMATCH', label: 'Ketidaksesuaian KYC' },
  { value: 'USER_REQUEST', label: 'Permintaan Pengguna' },
  { value: 'OTHER', label: 'Lainnya' },
];

function formatDate(v?: string) {
  if (!v) return '-';
  const d = new Date(v);
  return isNaN(d.getTime())
    ? v
    : d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

interface AppAccountsManagerProps {
  detailBasePath: string;
  readOnly?: boolean;
}

export function AppAccountsManager({
  detailBasePath,
  readOnly = false,
}: AppAccountsManagerProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'blocklist'>('accounts');

  // Accounts list state
  const [role, setRole] = useState<AppAccountRole | 'all'>('all');
  const [status, setStatus] = useState<AppAccountStatus | 'all'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [items, setItems] = useState<AppAccountItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Blocklist state
  const [blockRoleFilter, setBlockRoleFilter] = useState<AppAccountRole | 'all'>('all');
  const [blocklist, setBlocklist] = useState<BlocklistItem[]>([]);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState('');

  // Add blocklist modal/inline state
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [newRoleGroup, setNewRoleGroup] = useState<AppAccountRole>('customer');
  const [newIdType, setNewIdType] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [newIdValue, setNewIdValue] = useState('');
  const [newReasonCat, setNewReasonCat] = useState<ReasonCategory>('SPAM');
  const [newReasonDetail, setNewReasonDetail] = useState('');
  const [submittingBlock, setSubmittingBlock] = useState(false);

  // Unblock state
  const [unblockTarget, setUnblockTarget] = useState<BlocklistItem | null>(null);
  const [unblockReason, setUnblockReason] = useState('');
  const [submittingUnblock, setSubmittingUnblock] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await appAccountsApi.getAccounts({
        role,
        status,
        search,
        page,
        limit,
      });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat daftar akun aplikasi');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [role, status, search, page, limit]);

  const loadBlocklist = useCallback(async () => {
    if (readOnly) return;
    setBlockLoading(true);
    setBlockError('');
    try {
      const rows = await appAccountsApi.getBlocklist(blockRoleFilter);
      setBlocklist(rows);
    } catch (e) {
      setBlockError(e instanceof Error ? e.message : 'Gagal memuat daftar blokir');
      setBlocklist([]);
    } finally {
      setBlockLoading(false);
    }
  }, [blockRoleFilter, readOnly]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (activeTab === 'blocklist' && !readOnly) {
      loadBlocklist();
    }
  }, [activeTab, readOnly, loadBlocklist]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleAddBlocklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdValue.trim() || newReasonDetail.trim().length < 5) {
      setBlockError('Identitas wajib diisi dan detail alasan minimal 5 karakter.');
      return;
    }
    setSubmittingBlock(true);
    setBlockError('');
    try {
      await appAccountsApi.addToBlocklist({
        roleGroup: newRoleGroup,
        identifierType: newIdType,
        identifierValue: newIdValue.trim(),
        reasonCategory: newReasonCat,
        reasonDetail: newReasonDetail.trim(),
      });
      setShowAddBlock(false);
      setNewIdValue('');
      setNewReasonDetail('');
      await loadBlocklist();
    } catch (err) {
      setBlockError(err instanceof Error ? err.message : 'Gagal menambahkan ke blocklist');
    } finally {
      setSubmittingBlock(false);
    }
  };

  const handleUnblock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unblockTarget || unblockReason.trim().length < 5) {
      setBlockError('Alasan buka blokir wajib diisi minimal 5 karakter.');
      return;
    }
    setSubmittingUnblock(true);
    setBlockError('');
    try {
      const id = unblockTarget.blocklistId || unblockTarget.id;
      await appAccountsApi.unblockIdentity(id, unblockReason.trim());
      setUnblockTarget(null);
      setUnblockReason('');
      await loadBlocklist();
    } catch (err) {
      setBlockError(err instanceof Error ? err.message : 'Gagal membuka blokir identitas');
    } finally {
      setSubmittingUnblock(false);
    }
  };

  const hasNext = totalPages != null ? page < totalPages : items.length === limit;

  return (
    <main className="w-full bg-white min-h-screen p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Akun Pengguna</h1>
          <p className="text-sm text-gray-500">
            Tata kelola akun aplikasi mobile ToenToen (Customer, Owner, dan Business Admin).
            {readOnly ? ' Mode Read-Only (PII disamarkan).' : ''}
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('accounts')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-[#00A896] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Daftar Akun
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blocklist')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'blocklist'
                  ? 'bg-[#00A896] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Blocklist Identitas
            </button>
          </div>
        )}
      </div>

      {activeTab === 'accounts' ? (
        <>
          {/* FILTER & SEARCH */}
          <div className="border border-gray-300 rounded-xl p-4 flex flex-wrap gap-3 items-center">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as AppAccountRole | 'all');
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as AppAccountStatus | 'all');
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <div className="relative flex-1 min-w-[240px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari Account ID, email, username, atau nomor HP..."
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={loadAccounts}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {/* TABLE */}
          <div className="border border-gray-300 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-900">
              <thead className="text-xs font-bold text-gray-700 bg-gray-100 uppercase">
                <tr>
                  <th className="px-4 py-3">Akun</th>
                  <th className="px-4 py-3">Email / Telepon</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Terdaftar</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <KycTableRowSkeleton count={Math.min(limit, 8)} />
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      Tidak ada akun yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const accountId = item.accountId || item.id || '';
                    const href = `${detailBasePath}/${encodeURIComponent(accountId)}`;
                    return (
                      <tr key={accountId} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">
                            {item.fullName || item.name || item.username || '-'}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {accountId}
                            {item.username ? ` • @${item.username}` : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{item.email || '-'}</div>
                          <div className="text-xs text-gray-400">{item.phoneNumber || '-'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <AppAccountRoleBadge role={item.role} />
                        </td>
                        <td className="px-4 py-3">
                          <AppAccountStatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          {accountId ? (
                            <Link
                              href={href}
                              className="border border-gray-900 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 inline-block"
                            >
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
                Halaman {page}
                {totalPages ? ` dari ${totalPages}` : ''}
                {total != null ? ` - ${total} data` : ''}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border border-gray-300 px-3 py-1.5 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                disabled={!hasNext || loading}
                onClick={() => setPage((p) => p + 1)}
                className="border border-gray-300 px-3 py-1.5 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </>
      ) : (
        /* BLOCKLIST TAB (Supervisor / Managerial / C-Level only) */
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={blockRoleFilter}
                onChange={(e) => setBlockRoleFilter(e.target.value as AppAccountRole | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={loadBlocklist}
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Refresh
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAddBlock((v) => !v)}
              className="bg-[#00A896] hover:bg-[#008f80] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              {showAddBlock ? 'Tutup Form' : '+ Tambah ke Blocklist'}
            </button>
          </div>

          {blockError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {blockError}
            </div>
          )}

          {showAddBlock && (
            <form
              onSubmit={handleAddBlocklist}
              className="border border-gray-300 rounded-xl p-4 bg-gray-50/50 space-y-3"
            >
              <h3 className="text-sm font-bold text-gray-900">
                Tambah Identitas ke Blocklist (Per Role Group)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Role Group
                  </label>
                  <select
                    value={newRoleGroup}
                    onChange={(e) => setNewRoleGroup(e.target.value as AppAccountRole)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="owner">Owner</option>
                    <option value="business_admin">Business Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Tipe Identitas
                  </label>
                  <select
                    value={newIdType}
                    onChange={(e) => setNewIdType(e.target.value as 'EMAIL' | 'PHONE')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="EMAIL">EMAIL</option>
                    <option value="PHONE">PHONE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email / Nomor HP
                  </label>
                  <input
                    type="text"
                    required
                    value={newIdValue}
                    onChange={(e) => setNewIdValue(e.target.value)}
                    placeholder={newIdType === 'EMAIL' ? 'user@example.com' : '+628123456789'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Kategori Alasan
                  </label>
                  <select
                    value={newReasonCat}
                    onChange={(e) => setNewReasonCat(e.target.value as ReasonCategory)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    {REASON_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Detail Alasan (minimal 5 karakter)
                </label>
                <input
                  type="text"
                  required
                  minLength={5}
                  value={newReasonDetail}
                  onChange={(e) => setNewReasonDetail(e.target.value)}
                  placeholder="Contoh: Spam berulang pada ulasan merchant"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlock(false)}
                  className="border border-gray-300 px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingBlock}
                  className="bg-[#00A896] hover:bg-[#008f80] text-white px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {submittingBlock ? 'Menyimpan...' : 'Simpan Blocklist'}
                </button>
              </div>
            </form>
          )}

          {unblockTarget && (
            <form
              onSubmit={handleUnblock}
              className="border border-amber-300 rounded-xl p-4 bg-amber-50/40 space-y-3"
            >
              <h3 className="text-sm font-bold text-gray-900">
                Buka Blokir: {unblockTarget.identifierValue} ({unblockTarget.roleGroup})
              </h3>
              <input
                type="text"
                required
                minLength={5}
                value={unblockReason}
                onChange={(e) => setUnblockReason(e.target.value)}
                placeholder="Masukkan alasan buka blokir (minimal 5 karakter)..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUnblockTarget(null);
                    setUnblockReason('');
                  }}
                  className="border border-gray-300 px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingUnblock}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {submittingUnblock ? 'Memproses...' : 'Konfirmasi Buka Blokir'}
                </button>
              </div>
            </form>
          )}

          <div className="border border-gray-300 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-900">
              <thead className="text-xs font-bold text-gray-700 bg-gray-100 uppercase">
                <tr>
                  <th className="px-4 py-3">Identitas</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Role Group</th>
                  <th className="px-4 py-3">Alasan</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blockLoading ? (
                  <KycTableRowSkeleton count={5} />
                ) : blocklist.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      Tidak ada identitas di blocklist.
                    </td>
                  </tr>
                ) : (
                  blocklist.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{b.identifierValue}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-600">
                        {b.identifierType}
                      </td>
                      <td className="px-4 py-3">
                        <AppAccountRoleBadge role={b.roleGroup} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-gray-800">
                          {b.reasonCategory}
                        </div>
                        <div className="text-xs text-gray-500">{b.reasonDetail}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(b.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {b.isActive !== false ? (
                          <button
                            type="button"
                            onClick={() => setUnblockTarget(b)}
                            className="border border-gray-900 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                          >
                            Buka Blokir
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Sudah dibuka</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
