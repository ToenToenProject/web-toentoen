"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  appAccountsApi,
  type AppAccountAuditLog,
  type AppAccountDetail,
  type ReasonCategory,
} from '@/constants/api/admin/appAccounts';
import {
  AppAccountRoleBadge,
  AppAccountStatusBadge,
} from './AppAccountStatusBadge';
import { KycDetailSkeleton } from '@/components/ui/Skeleton';

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

interface AppAccountDetailViewProps {
  accountId: string;
  backHref: string;
  readOnly?: boolean;
}

export function AppAccountDetailView({
  accountId,
  backHref,
  readOnly = false,
}: AppAccountDetailViewProps) {
  const [detail, setDetail] = useState<AppAccountDetail | null>(null);
  const [auditLogs, setAuditLogs] = useState<AppAccountAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Status moderation state
  const [targetStatus, setTargetStatus] = useState<'active' | 'suspended' | 'banned'>('suspended');
  const [reasonCategory, setReasonCategory] = useState<ReasonCategory>('POLICY_VIOLATION');
  const [reasonDetail, setReasonDetail] = useState('');
  const [blockIdentity, setBlockIdentity] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await appAccountsApi.getAccountDetail(accountId);
      setDetail(data);

      if (data.status === 'active') {
        setTargetStatus('suspended');
      } else {
        setTargetStatus('active');
      }

      if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
        setAuditLogs(data.auditLogs);
      } else if (!readOnly) {
        try {
          const logs = await appAccountsApi.getAuditLogs(accountId);
          setAuditLogs(logs);
        } catch {
          // Ignore if audit logs endpoint returns 403 or empty
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat detail akun');
    } finally {
      setLoading(false);
    }
  }, [accountId, readOnly]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reasonDetail.trim().length < 5) {
      setError('Detail alasan wajib diisi minimal 5 karakter.');
      return;
    }

    setSubmitting(true);
    setError('');
    setFeedback('');
    try {
      const res = await appAccountsApi.updateAccountStatus(accountId, {
        status: targetStatus,
        reasonCategory,
        reasonDetail: reasonDetail.trim(),
        blockIdentity: targetStatus === 'banned' ? blockIdentity : false,
      });
      setFeedback(
        res?.message || `Status akun berhasil diubah menjadi ${targetStatus}.`
      );
      setReasonDetail('');
      setBlockIdentity(false);
      await loadDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah status akun');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-white min-h-screen p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            &larr; Kembali
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Detail Akun Pengguna</h1>
            <p className="text-xs text-gray-500 font-mono">
              {accountId}
              {readOnly ? ' • Read-Only (PII disamarkan)' : ''}
            </p>
          </div>
        </div>
        {detail && (
          <div className="flex items-center gap-2">
            <AppAccountRoleBadge role={detail.role} />
            <AppAccountStatusBadge status={detail.status} />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3">
          {feedback}
        </div>
      )}

      {loading ? (
        <KycDetailSkeleton />
      ) : detail ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Profile, Businesses, Audit Trail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="border border-gray-300 rounded-xl p-5 space-y-4">
              <h2 className="text-base font-bold text-gray-900">Informasi Akun</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Nama Lengkap</dt>
                  <dd className="font-semibold text-gray-900 mt-0.5">
                    {detail.fullName || detail.name || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Username</dt>
                  <dd className="font-medium text-gray-800 mt-0.5">
                    {detail.username ? `@${detail.username}` : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-800 mt-0.5">{detail.email || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Nomor Telepon</dt>
                  <dd className="font-medium text-gray-800 mt-0.5">
                    {detail.phoneNumber || detail.phone || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Terdaftar Pada</dt>
                  <dd className="text-gray-700 mt-0.5">{formatDate(detail.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Login Terakhir</dt>
                  <dd className="text-gray-700 mt-0.5">{formatDate(detail.lastLoginAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Related Businesses (Owner / Business Admin) */}
            {(detail.role === 'owner' ||
              detail.role === 'business_admin' ||
              (detail.businesses && detail.businesses.length > 0)) && (
              <div className="border border-gray-300 rounded-xl p-5 space-y-3">
                <h2 className="text-base font-bold text-gray-900">
                  Toko / Bisnis Terkait ({detail.businesses?.length ?? 0})
                </h2>
                {detail.businesses && detail.businesses.length > 0 ? (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
                    {detail.businesses.map((biz) => {
                      const active = biz.isActive ?? biz.is_active ?? true;
                      return (
                        <div
                          key={biz.id}
                          className="px-4 py-3 flex items-center justify-between gap-3 text-sm"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">{biz.name}</div>
                            <div className="text-xs text-gray-500">
                              {biz.category || 'Bisnis'}
                              {biz.city ? ` • ${biz.city}` : ''}
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Belum ada toko yang terhubung.</p>
                )}
              </div>
            )}

            {/* Audit Trail (Supervisor / Managerial / C-Level only) */}
            {!readOnly && (
              <div className="border border-gray-300 rounded-xl p-5 space-y-3">
                <h2 className="text-base font-bold text-gray-900">
                  Riwayat Audit Trail ({auditLogs.length})
                </h2>
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-gray-400">Belum ada catatan audit untuk akun ini.</p>
                ) : (
                  <div className="space-y-2.5">
                    {auditLogs.map((log, idx) => (
                      <div
                        key={log.id || idx}
                        className="border border-gray-200 rounded-lg p-3 text-xs space-y-1 bg-gray-50/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-gray-900">
                            {log.action ||
                              `${log.previousStatus || '?'} → ${log.newStatus || '?'}`}
                          </span>
                          <span className="text-gray-500">
                            {formatDate(log.createdAt || log.created_at)}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          <span className="font-semibold">
                            {log.reasonCategory || log.reason_category || 'OTHER'}:
                          </span>{' '}
                          {log.reasonDetail || log.reason_detail || '-'}
                        </div>
                        {(log.actorName || log.actorId || log.actor_id) && (
                          <div className="text-gray-400">
                            Oleh: {log.actorName || log.actorId || log.actor_id}
                            {log.ipAddress || log.ip_address
                              ? ` • IP ${log.ipAddress || log.ip_address}`
                              : ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Moderation Action Panel */}
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-xl p-5 space-y-4">
              <h2 className="text-base font-bold text-gray-900">Tindakan Moderasi</h2>

              {readOnly ? (
                <p className="text-sm text-gray-500">
                  Akun Staff Admin hanya memiliki akses Read-Only. Perubahan status akun hanya dapat
                  dilakukan oleh Supervisor, Managerial, atau C-Level.
                </p>
              ) : (
                <form onSubmit={handleStatusChange} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Ubah Status Menjadi
                    </label>
                    <select
                      value={targetStatus}
                      onChange={(e) =>
                        setTargetStatus(e.target.value as 'active' | 'suspended' | 'banned')
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="active">Active (Aktifkan kembali)</option>
                      <option value="suspended">Suspended (Tangguhkan)</option>
                      <option value="banned">Banned (Blokir Permanen)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Kategori Alasan
                    </label>
                    <select
                      value={reasonCategory}
                      onChange={(e) => setReasonCategory(e.target.value as ReasonCategory)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      {REASON_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Detail Alasan (minimal 5 karakter)
                    </label>
                    <textarea
                      rows={3}
                      required
                      minLength={5}
                      value={reasonDetail}
                      onChange={(e) => setReasonDetail(e.target.value)}
                      placeholder="Jelaskan alasan tindakan moderasi ini..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    />
                  </div>

                  {targetStatus === 'banned' && (
                    <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={blockIdentity}
                        onChange={(e) => setBlockIdentity(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>
                        Masukkan email &amp; nomor HP ke blocklist khusus role{' '}
                        <strong>{detail.role}</strong>
                      </span>
                    </label>
                  )}

                  {detail.role === 'owner' && targetStatus !== 'active' && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                      Perhatian: Mengubah status <strong>owner</strong> ke{' '}
                      <strong>{targetStatus}</strong> otomatis menonaktifkan seluruh toko miliknya
                      dan mencabut sesi aktif.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer ${
                      targetStatus === 'banned'
                        ? 'bg-red-600 hover:bg-red-700'
                        : targetStatus === 'suspended'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-[#00A896] hover:bg-[#008f80]'
                    }`}
                  >
                    {submitting ? 'Memproses...' : `Terapkan Status: ${targetStatus}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
