import React from 'react';

export default function KycStatusBadge({ status }: { status?: unknown }) {
  const s = String(status ?? '-').toLowerCase();
  const cls =
    s === 'verified' || s === 'approved'
      ? 'bg-green-100 text-green-700'
      : s === 'rejected'
      ? 'bg-red-100 text-red-700'
      : s === 'pending'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-gray-100 text-gray-600';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cls}`}>{s}</span>;
}
