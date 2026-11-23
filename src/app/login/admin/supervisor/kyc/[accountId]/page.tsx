"use client";

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { kycApi, pick, type AnyRecord, type KycReviewRole } from '@/constants/api/admin/kyc';
import KycStatusBadge from '@/components/admin/kyc/KycStatusBadge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PERMISSIONS } from '@/types/auth';

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|bmp|heic)(\?.*)?$/i;
const IMAGE_KEY = /(photo|foto|image|img|ktp|selfie|picture|document|file|url)/i;

function isImageValue(key: string, value: unknown) {
  if (typeof value !== 'string') return false;
  if (value.startsWith('data:image')) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  return IMAGE_EXT.test(value) || IMAGE_KEY.test(key);
}

function humanize(key: string) {
  return key
    .replace(/[_.]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Ratakan object nested menjadi daftar [key, value]. */
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
  if (Array.isArray(v)) return v.length ? v.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(', ') : '-';
  return String(v);
}

function KycDetailContent() {
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
      setActionMsg({ type: 'ok', text: 'KYC berhasil disetujui.' });
      await load();
    } catch (e) {
      setActionMsg({ type: 'err', text: e instanceof Error ? e.message : 'Gagal menyetujui KYC' });
    } finally {
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
      setActionMsg({ type: 'ok', text: 'KYC berhasil ditolak.' });
      setShowReject(false);
      setReason('');
      await load();
    } catch (e) {
      setActionMsg({ type: 'err', text: e instanceof Error ? e.message : 'Gagal menolak KYC' });
    } finally {
      setSubmitting(false);
    }
  };

  const entries = detail ? flatten(detail) : [];
  const images = entries.filter(([k, v]) => isImageValue(k, v)) as [string, string][];
  const fields = entries.filter(([k, v]) => !isImageValue(k, v));
  const status = pick(detail, ['status', 'kycStatus', 'kyc_status']);
  const name = pick(detail, ['name', 'fullName', 'full_name', 'account.name', 'user.name', 'ktpName']);

  return (
    <main className="w-full bg-white min-h-screen p-6 space-y-4">
      <Link href="/login/admin/supervisor/kyc" className="text-sm text-teal-600 hover:underline">
        &larr; Kembali ke daftar KYC
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Detail KYC {name ? `- ${String(name)}` : ''}</h1>
          <p className="text-xs text-gray-500">Account ID: {accountId}</p>
        </div>
        {status !== undefined && <KycStatusBadge status={status} />}
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
        <p className="text-sm text-gray-500">Memuat detail...</p>
      ) : detail ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DATA */}
          <div className="lg:col-span-2 space-y-4">
            {images.length > 0 && (
              <div className="border border-gray-300 rounded-xl p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Dokumen</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map(([k, src]) => (
                    <button key={k} onClick={() => setPreviewImg(src)} className="text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={k} className="w-full h-36 object-cover rounded-lg border border-gray-200" />
                      <span className="text-xs text-gray-600 mt-1 block">{humanize(k)}</span>
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
                    <dd className="text-sm text-gray-900 break-words">{renderValue(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* AKSI */}
          <div className="border border-gray-300 rounded-xl p-4 h-fit space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Tindakan</h3>
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
              onClick={handleApprove}
              disabled={submitting}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Setujui
            </button>

            {!showReject ? (
              <button
                onClick={() => setShowReject(true)}
                disabled={submitting}
                className="w-full border border-red-500 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                />
                <p className={`text-xs ${wordCount < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                  {wordCount} kata (minimal 5)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowReject(false); setReason(''); }}
                    className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={submitting || wordCount < 5}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    Kirim penolakan
                  </button>
                </div>
              </div>
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
      allowedRoles={['ADMIN_SPV', 'SUPERVISOR_ADMIN']}
      requiredPermission={PERMISSIONS.KYC_REVIEW}
    >
      <Suspense fallback={<main className="p-6 text-sm text-gray-500">Memuat...</main>}>
        <KycDetailContent />
      </Suspense>
    </RoleGuard>
  );
}
