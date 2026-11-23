// src/components/sales/ReassignMerchantModal.tsx
"use client";

import React, { useState } from 'react';
import { salesService, SalesFilterOption } from '@/services/salesService';

interface ReassignMerchantModalProps {
  isOpen: boolean;
  merchantId: string | null;
  merchantName?: string;
  storeName?: string;
  currentSalesName?: string;
  salesOptions: SalesFilterOption[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ReassignMerchantModal: React.FC<ReassignMerchantModalProps> = ({
  isOpen,
  merchantId,
  merchantName,
  storeName,
  currentSalesName,
  salesOptions,
  onClose,
  onSuccess,
}) => {
  const [selectedSalesId, setSelectedSalesId] = useState<string>(
    salesOptions[0]?.id || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !merchantId) return null;

  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalesId) {
      setError('Silakan pilih staf sales pengganti.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await salesService.reassignMerchant(merchantId, { salesId: selectedSalesId });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal memindahkan binaan toko.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-teal-50/40 to-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">Pindahkan Binaan Toko</h3>
              <p className="text-[11px] text-gray-400">Alihkan hak binaan merchant ke staf sales lain</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleReassign} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Info Toko */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Toko:</span>
              <span className="font-bold text-gray-900">{storeName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pemilik:</span>
              <span className="font-semibold text-gray-800">{merchantName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sales Pembina Saat Ini:</span>
              <span className="font-semibold text-teal-700">{currentSalesName || '-'}</span>
            </div>
          </div>

          {/* Pilihan Sales Baru */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Pilih Sales Pembina Baru <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedSalesId}
              onChange={(e) => setSelectedSalesId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white cursor-pointer"
            >
              {salesOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} ({opt.workerId}) — {opt.storeCount} Toko Aktif
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Konfirmasi Pindahkan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
