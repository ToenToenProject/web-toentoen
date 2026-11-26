"use client";

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { kycApi, pick, type AnyRecord, type KycReviewRole } from '@/constants/api/admin/kyc';
import KycStatusBadge from '@/components/admin/kyc/KycStatusBadge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PERMISSIONS } from '@/types/auth';
import { KycDetailSkeleton } from '@/components/ui/Skeleton';

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|bmp|heic)(\?.*)?$/i;
const IMAGE_KEY = /(photo|foto|image|img|ktp|selfie|picture|document|file|url)/i;

function isImageValue(key: string, value: unknown) {
  if (typeof value !== 'string') return false;
  if (value.startsWith('data:image')) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  return IMAGE_EXT.test(value) || IMAGE_KEY.test(key);
}

function humanize(key: string) {
  const map: Record<string, string> = {
    kycSubmittedAt: 'Waktu Pengajuan KYC',
    kyc_submitted_at: 'Waktu Pengajuan KYC',
    submittedAt: 'Waktu Pengajuan KYC',
    submitted_at: 'Waktu Pengajuan KYC',
    createdAt: 'Waktu Dibuat',
    created_at: 'Waktu Dibuat',
    kycStatus: 'Status KYC',
    kyc_status: 'Status KYC',
    fullName: 'Nama Lengkap',
    full_name: 'Nama Lengkap',
    storeName: 'Nama Toko',
    store_name: 'Nama Toko',
    accountId: 'ID Akun',
    account_id: 'ID Akun',
    phoneNumber: 'Nomor Telepon',
    phone: 'Nomor Telepon',
    email: 'Alamat Email',
    role: 'Peran Akun',
    'ktp.number': 'Nomor KTP (NIK)',
    'ktp.name': 'Nama di KTP',
    'ktp.imageUrl': 'Foto KTP',
    'selfie.imageUrl': 'Foto Selfie',
  };
  if (map[key]) return map[key];
  return key
    .replace(/[_.]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Flattens nested object properties into key-value tuples. */
function flatten(obj: AnyRecord, prefix = ''): [string, unknown][] {
  const out: [string, unknown][] = [];
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flatten(v as AnyRecord, key));
    } else {
      out.push([key, v]);
    }
  }
  return out;
}

function renderValue(v: unknown) {
  if (v === null || v === undefined || v === '') return <span className="text-gray-400">-</span>;
  if (typeof v === 'boolean') return v ? 'Ya' : 'Tidak';
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    }
  }
  if (Array.isArray(v)) return v.length ? v.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(', ') : '-';
  return String(v);
}

function KycDetailContent() {
  const router = useRouter();
  const params = useParams<{ accountId: string }>();
  const searchParams = useSearchParams();
  const accountId = decodeURIComponent(String(params?.accountId ?? ''));
  const roleParam = searchParams.get('role');
  const initialRole: KycReviewRole | undefined =
    roleParam === 'owner' || roleParam === 'business_admin' ? roleParam : undefined;

  const [detail, setDetail] = useState<AnyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewRole, setReviewRole] = useState<KycReviewRole>(initialRole ?? 'owner');
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    setError('');
    try {
      const data = await kycApi.getSubmissionDetail(accountId, initialRole);
      setDetail(data);
      const r = pick(data, ['role', 'kycRole', 'type']);
      if (!initialRole && (r === 'owner' || r === 'business_admin')) setReviewRole(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat detail KYC');
    } finally {
      setLoading(false);
    }
  }, [accountId, initialRole]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) load();
    });
    return () => {
      active = false;
    };
  }, [load]);

  const wordCount = reason.trim().split(/\s+/).filter(Boolean).length;

  const handleApprove = async () => {
    if (!confirm('Setujui pengajuan KYC ini?')) return;
    setSubmitting(true);
    setActionMsg(null);
    try {
      await kycApi.approve(accountId, reviewRole);
      setActionMsg({ type: 'ok', text: 'KYC berhasil disetujui. Mengalihkan...' });
      // Redirect to KYC submission queue following approval
      router.push('/admin/supervisor/kyc');
    } catch (e) {
      setActionMsg({ type: 'err', text: e instanceof Error ? e.message : 'Gagal menyetujui KYC' });
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (wordCount < 5) {
      setActionMsg({ type: 'err', text: 'Alasan penolakan minimal 5 kata.' });
      return;
    }
    setSubmitting(true);
    setActionMsg(null);
    try {
      await kycApi.reject(accountId, reviewRole, reason);
      setActionMsg({ type: 'ok', text: 'KYC berhasil ditolak. Mengalihkan...' });
      setShowReject(false);
      setReason('');
      // Redirect to KYC submission queue following rejection
      router.push('/admin/supervisor/kyc');
    } catch (e) {
      setActionMsg({ type: 'err', text: e instanceof Error ? e.message : 'Gagal menolak KYC' });
      setSubmitting(false);
    }
  };

  const entries = detail ? flatten(detail) : [];
  const images = entries.filter(([k, v]) => isImageValue(k, v)) as [string, string][];
  const fields = entries.filter(([k, v]) => !isImageValue(k, v));
  const rawStatus = pick(detail, ['kycStatus', 'kyc_status', 'status', 'state']);
  const normalizedStatus = String(rawStatus ?? '').toLowerCase().trim();
  const isApproved = normalizedStatus === 'verified' || normalizedStatus === 'approved';
  const isRejected = normalizedStatus === 'rejected';
  const isPending = normalizedStatus === 'pending' || (!isApproved && !isRejected);

  const name = pick(detail, ['name', 'fullName', 'full_name', 'account.name', 'user.name', 'ktpName']);

  return (
    <main className="w-full bg-white min-h-screen p-6 space-y-4">
      <Link href="/admin/supervisor/kyc" className="text-sm text-teal-600 hover:underline inline-flex items-center gap-1.5 font-medium">
        <span>&larr;</span>
        <span>Kembali ke daftar KYC</span>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Detail KYC {name ? `- ${String(name)}` : ''}</h1>
          <p className="text-xs text-gray-500">Account ID: {accountId}</p>
        </div>
        {rawStatus !== undefined && <KycStatusBadge status={rawStatus} />}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}
      {actionMsg && (
        <div
          className={`text-sm rounded-lg p-3 border ${
            actionMsg.type === 'ok' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      {loading ? (
        <KycDetailSkeleton />
      ) : detail ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DATA */}
          <div className="lg:col-span-2 space-y-4">
            {images.length > 0 && (
              <div className="border border-gray-300 rounded-xl p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Dokumen</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map(([k, src]) => (
                    <button key={k} onClick={() => setPreviewImg(src)} className="text-left cursor-pointer group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={k} className="w-full h-36 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity" />
                      <span className="text-xs text-gray-600 mt-1 block truncate font-medium">{humanize(k)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-gray-300 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Data Pengajuan</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {fields.map(([k, v]) => (
                  <div key={k} className="border-b border-gray-100 pb-2">
                    <dt className="text-xs text-gray-500">{humanize(k)}</dt>
                    <dd className="text-sm text-gray-900 break-words font-medium">{renderValue(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* AKSI / STATUS TINDAKAN */}
          <div className="border border-gray-300 rounded-xl p-4 h-fit space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Tindakan</h3>

            {isApproved ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center space-y-2">
                <div className="w-9 h-9 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">Pengajuan Telah Disetujui</p>
                  <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
                    Berkas KYC akun ini telah disetujui. Aksi verifikasi ditutup dan tidak dapat diubah lagi.
                  </p>
                </div>
              </div>
            ) : isRejected ? (
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-center space-y-2">
                <div className="w-9 h-9 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-900">Pengajuan Telah Ditolak</p>
                  <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                    Berkas KYC akun ini telah ditolak. Aksi review ditutup dan pemohon dapat mengajukan verifikasi baru.
                  </p>
                </div>
              </div>
            ) : (
                            <>
                <label className="block text-xs text-gray-600">
                  Role yang direview
                  <select
                    value={reviewRole}
                    onChange={(e) => setReviewRole(e.target.value as KycReviewRole)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                  >
                    <option value="owner">Owner</option>
                    <option value="business_admin">Business Admin</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={submitting}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 cursor-pointer transition-colors shadow-2xs"
                >
                  {submitting ? 'Memproses...' : 'Setujui'}
                </button>

                {!showReject ? (
                  <button
                    type="button"
                    onClick={() => setShowReject(true)}
                    disabled={submitting}
                    className="w-full border border-red-500 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    Tolak
                  </button>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      placeholder="Contoh: Foto KTP buram dan NIK tidak terbaca jelas. Mohon unggah ulang."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <p className={`text-xs ${wordCount < 5 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      {wordCount} kata (minimal 5)
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setShowReject(false); setReason(''); }}
                        className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg text-sm text-gray-700 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={submitting || wordCount < 5}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? 'Memproses...' : 'Kirim penolakan'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}

      {previewImg && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setPreviewImg(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewImg} alt="Preview" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </main>
  );
}

export default function SupervisorKycDetailPage() {
  return (
    <RoleGuard
      allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN', 'C_LEVEL', 'CMO']}
      requiredPermission={PERMISSIONS.KYC_REVIEW}
    >
      <Suspense fallback={<main className="p-6 text-sm text-gray-500">Memuat...</main>}>
        <KycDetailContent />
      </Suspense>
    </RoleGuard>
  );
}
