// src/components/sales/SalesTopBar.tsx
"use client";

import React, { useState } from 'react';
import { SalesProfile } from '@/constants/salesData';
import { Check, Copy } from 'lucide-react';

interface SalesTopBarProps {
  profile: SalesProfile;
  onOpenAccount: () => void;
  onLogout: () => void;
  referralCode?: string;
}

export const SalesTopBar: React.FC<SalesTopBarProps> = ({ 
  profile, 
  onOpenAccount, 
  onLogout,
  referralCode
}) => {
  const [copied, setCopied] = useState(false);
  const activeReferral = referralCode || profile.referralCode || 'SL01';
  const cleanAvatar = (profile.avatar && !profile.avatar.includes('unsplash.com') && !profile.avatar.includes('pravatar.cc'))
    ? profile.avatar
    : "/assets/avatars/starter-photo-profile.jpg";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeReferral);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-white border border-gray-300 px-3 sm:px-6 py-3 flex justify-between items-center gap-3 m-3 sm:m-4 rounded-xl shadow-sm">
      {/* Profil Pengguna (Sama persis seperti Header Admin) */}
      <div 
        onClick={onOpenAccount}
        className="flex items-center space-x-3 min-w-0 cursor-pointer group"
        title="Buka Pengaturan Akun"
      >
        <div className="w-10 h-10 shrink-0 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
          <img 
            src={cleanAvatar} 
            alt="Profile" 
            onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
          />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-none group-hover:text-teal-600 transition-colors">
            {profile.name}
          </h2>
          <span className="text-xs text-gray-500 block mt-1">
            {profile.role}
          </span>
        </div>
      </div>

      {/* Bagian Kanan: Kartu Referral Code & Tombol Logout */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Kartu Kode Referral */}
        <div className="flex items-center space-x-2 bg-teal-50/70 border border-teal-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
          <div className="leading-tight">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold block">
              Referral Code
            </span>
            <span className="text-xs font-mono font-black text-teal-800 tracking-wider">
              {activeReferral}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-teal-300 text-teal-700 hover:bg-teal-100 transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
            title="Salin Kode Referral"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-teal-600" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        {/* Tombol Log Out (Gaya identik Admin) */}
        <button 
          onClick={onLogout} 
          className="shrink-0 bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors cursor-pointer"
          title="Keluar dari akun"
        >
          <span className="hidden sm:inline">Log Out</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};
