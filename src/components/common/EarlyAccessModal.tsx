"use client";

import React, { useState, useEffect } from "react";
import { useEarlyAccess } from "@/context/EarlyAccessContext";
import { User, Store } from "lucide-react";

export const EarlyAccessModal = () => {
  const { isOpen, initialRole, closeEarlyAccess } = useEarlyAccess();
  const [role, setRole] = useState<"user" | "merchant">(initialRole);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Jakarta Selatan");
  const [businessName, setBusinessName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setRole(initialRole);
    setSubmitted(false);
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeEarlyAccess}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Tutup"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#00c2a8] bg-[#e6f9f6] px-3 py-1 rounded-full inline-block mb-2">
                Tahap Pilot Proyek Jakarta &middot; Rilis Q4 2026
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900">
                Daftar Akses Awal Toentoen
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Dapatkan prioritas undangan atau pendampingan onboarding langsung untuk bisnis Anda.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  role === "user"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Konsumen (Toeners)</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("merchant")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  role === "merchant"
                    ? "bg-[#00c2a8] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Store className="w-3.5 h-3.5 shrink-0" />
                <span>Pelaku Usaha (Merchant)</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#00c2a8] focus:outline-none focus:ring-1 focus:ring-[#00c2a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxx"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#00c2a8] focus:outline-none focus:ring-1 focus:ring-[#00c2a8]"
                />
              </div>

              {role === "merchant" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Toko / Usaha / Jasa
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Warung Kopi Sejahtera / Servis AC Barokah"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#00c2a8] focus:outline-none focus:ring-1 focus:ring-[#00c2a8]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Wilayah Domisili (Area Pilot)
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#00c2a8] focus:outline-none focus:ring-1 focus:ring-[#00c2a8]"
                >
                  <option value="Jakarta Selatan">DKI Jakarta - Jakarta Selatan</option>
                  <option value="Jakarta Pusat">DKI Jakarta - Jakarta Pusat</option>
                  <option value="Jakarta Barat">DKI Jakarta - Jakarta Barat</option>
                  <option value="Jakarta Timur">DKI Jakarta - Jakarta Timur</option>
                  <option value="Jakarta Utara">DKI Jakarta - Jakarta Utara</option>
                  <option value="Jabodetabek Lainnya">Bodetabek (Bogor, Depok, Tangerang, Bekasi)</option>
                  <option value="Luar Jabodetabek">Kota Lain di Indonesia</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#00c2a8] py-3 text-sm font-bold text-white shadow-md hover:bg-[#00a892] transition-colors"
                >
                  {role === "merchant" ? "Daftarkan Bisnis Sekarang (Gratis)" : "Gabung Antrean Akses Awal"}
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-400">
                Data Anda aman dan hanya digunakan untuk verifikasi akses pilot Toentoen.
              </p>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f9f6] text-[#00c2a8]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              Pendaftaran Berhasil!
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Terima kasih, <strong>{name}</strong>. Anda telah terdaftar sebagai calon pengguna/mitra pilot Toentoen area <strong>{location}</strong>. Tim kami akan menghubungi Anda via WhatsApp di <strong>{phone}</strong> menjelang rilis.
            </p>
            <button
              type="button"
              onClick={closeEarlyAccess}
              className="rounded-full bg-[#00c2a8] px-8 py-2.5 text-sm font-bold text-white hover:bg-[#00a892] transition-colors"
            >
              Tutup & Kembali ke Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
