"use client";

import React, { useState } from 'react';
import { salesService, RegisterMerchantPayload } from '@/services/salesService';

interface RegisterMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultReferralCode?: string;
}

const CATEGORIES = [
  'Kelontong',
  'Kuliner',
  'Fashion',
  'Elektronik',
  'Jasa',
  'Kesehatan & Kecantikan',
  'Otomotif',
  'Lainnya'
];

export const RegisterMerchantModal: React.FC<RegisterMerchantModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultReferralCode = 'SL01',
}) => {
  const [formData, setFormData] = useState<RegisterMerchantPayload>({
    name: '',
    storeName: '',
    category: 'Kelontong',
    ownerPhone: '',
    referralCode: defaultReferralCode,
    status: 'OPEN',
  });

  const [loading, setLoading] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pre-check store name and phone number uniqueness
  const handleCheckDuplicate = async () => {
    if (!formData.ownerPhone.trim() && !formData.storeName.trim()) return;

    try {
      setCheckingDuplicate(true);
      setDuplicateWarning(null);
      const res = await salesService.checkDuplicate({
        phone: formData.ownerPhone.trim() || undefined,
        storeName: formData.storeName.trim() || undefined,
      });

      if (res.isDuplicate) {
        setDuplicateWarning(res.message || 'Toko atau nomor HP ini sudah terdaftar.');
      } else {
        setDuplicateWarning(null);
      }
    } catch {
    } finally {
      setCheckingDuplicate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.storeName.trim() || !formData.ownerPhone.trim()) {
      setErrorMessage('Mohon lengkapi seluruh field yang wajib diisi.');
      return;
    }

    if (duplicateWarning) {
      setErrorMessage('Toko atau nomor HP terdeteksi duplikat. Mohon periksa kembali data.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      await salesService.registerMerchant(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftarkan merchant baru.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-teal-50/40 to-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">Daftarkan Merchant Baru</h3>
              <p className="text-[11px] text-gray-400">Registrasi toko binaan baru ke sistem ToenToen</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {duplicateWarning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
              <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{duplicateWarning}</span>
            </div>
          )}

          {/* Nama Pemilik */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nama Pemilik Toko <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Raharja"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50/40"
            />
          </div>

          {/* Nama Toko */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nama Toko / Outlet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Warung Kopi Nusantara"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              onBlur={handleCheckDuplicate}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50/40"
            />
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Toko</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status Awal</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white cursor-pointer"
              >
                <option value="OPEN">Buka (Online)</option>
                <option value="CLOSED">Tutup (Closed)</option>
              </select>
            </div>
          </div>

          {/* Nomor WhatsApp Pemilik */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">
                Nomor WhatsApp Pemilik <span className="text-red-500">*</span>
              </label>
              {checkingDuplicate && (
                <span className="text-[10px] text-teal-600 animate-pulse font-medium">Memeriksa duplikasi...</span>
              )}
            </div>
            <input
              type="tel"
              required
              placeholder="Contoh: 081298765432"
              value={formData.ownerPhone}
              onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
              onBlur={handleCheckDuplicate}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-gray-50/40"
            />
            <p className="text-[10px] text-gray-400 mt-1">Digunakan untuk follow-up dan notifikasi otomatis WhatsApp.</p>
          </div>

          {/* Kode Referral */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Kode Referral Sales</label>
            <input
              type="text"
              readOnly
              value={formData.referralCode}
              className="w-full px-3.5 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
            />
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
              disabled={loading || !!duplicateWarning}
              className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <span>Simpan Merchant</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
