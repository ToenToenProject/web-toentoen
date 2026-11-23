"use client";

import React, { useState } from "react";
import { LoginPayload } from "@/constants/api/admin/login";

interface LoginFormProps {
  onSubmit: (payload: LoginPayload) => void;
  isLoading: boolean;
  error: string;
}

// 8-Pointed Star Icon matching the Figma design
const SparkleStarIcon = ({ className = "h-8 w-8 text-white" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.0 1.5 L13.3 8.8 L18.0 6.0 L15.2 10.7 L22.5 12.0 L15.2 13.3 L18.0 18.0 L13.3 15.2 L12.0 22.5 L10.7 15.2 L6.0 18.0 L8.8 13.3 L1.5 12.0 L8.8 10.7 L6.0 6.0 L10.7 8.8Z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    onSubmit({
      identifier: trimmed,
      email: trimmed,
      workerId: trimmed,
      password,
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-14 items-stretch min-h-[calc(100vh-140px)] pb-4 sm:pb-6">
          
          {/* Kolom Kiri: Brand Hero Banner (Gradient Hijau-Teal Tinggi Penuh) */}
          <div
            className="w-full lg:w-[48%] rounded-[28px] sm:rounded-[32px] p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden shadow-md flex-1 min-h-[480px] lg:min-h-0"
            style={{
              background: "radial-gradient(circle at 85% 15%, #4de3b6 0%, #00b4a8 42%, #014d43 100%)",
            }}
          >
            {/* Ambient Lighting Overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)",
              }}
            />

            {/* Top: 8-Pointed Star Icon */}
            <div className="relative z-10">
              <SparkleStarIcon className="h-9 w-9 text-white drop-shadow-xs" />
            </div>

            {/* Bottom: Typography */}
            <div className="relative z-10 mt-16 lg:mt-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.18] mb-4 tracking-tight">
                Temukan Apapun di<br />
                Sekitarmu bersama<br />
                ToenToen
              </h1>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-md pb-6 border-b border-white/20 font-normal">
                Hubungkan kebutuhanmu dengan berbagai bisnis lokal terdekat. Cepat, tepat, dan mudah.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Form Masukan Akun Anda */}
          <div className="w-full lg:w-[52%] flex items-center justify-center p-2 sm:p-6 lg:p-10">
            <div className="w-full max-w-[440px]">
              
              {/* Star Icon Hijau Teal */}
              <div className="mb-3">
                <SparkleStarIcon className="h-7 w-7 text-[#00c2a8]" />
              </div>

              {/* Header Teks Form */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">
                Masukan Akun Anda
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                Masuk untuk mengelola bisnis, melihat sinyal permintaan, dan terhubung dengan komunitas lokal Anda.
              </p>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Field 1: Email atau Nomor Ponsel */}
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email atau Nomor Ponsel
                  </label>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="mitra.toentoen@gmail.com"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#00c2a8] focus:outline-none focus:ring-2 focus:ring-[#00c2a8]/20 transition-all shadow-2xs"
                  />
                </div>

                {/* Field 2: Kata Sandi */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-xs sm:text-sm font-semibold text-gray-700"
                    >
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("Silakan hubungi administrator Toentoen jika Anda lupa kata sandi akun.")}
                      className="text-xs font-semibold text-[#00c2a8] hover:text-[#009b86] transition-colors cursor-pointer"
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="SecretToen2025"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#00c2a8] focus:outline-none focus:ring-2 focus:ring-[#00c2a8]/20 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
                      aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="rounded-xl bg-red-50 p-3.5 text-xs sm:text-sm text-red-600 border border-red-200 text-center font-medium">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-[#00c2a8] hover:bg-[#00a892] text-white py-3.5 px-6 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00c2a8]/25 hover:shadow-[#00c2a8]/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{isLoading ? "Memproses..." : "Masuk Sekarang"}</span>
                    {!isLoading && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
