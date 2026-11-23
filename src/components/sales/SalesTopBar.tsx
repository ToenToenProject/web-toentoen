// src/components/sales/SalesTopBar.tsx
"use client";

import React, { useState } from 'react';
import { SalesProfile } from '@/constants/salesData';

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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeReferral);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between w-full gap-3 pb-4 sm:pb-6 flex-wrap">
      {/* Kartu Kode Referral Sendiri */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent border border-teal-200/80 rounded-2xl px-3.5 py-2">
        <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </span>
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block leading-none">
            Kode Referral Anda
          </span>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-sm font-mono font-black text-teal-800 tracking-wider">
              {activeReferral}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-teal-300 text-teal-700 hover:bg-teal-50 transition-colors shadow-2xs"
              title="Salin Kode Referral"
            >
              {copied ? '✓ Tersalin' : 'Salin'}
            </button>
          </div>
        </div>
      </div>

      {/* Right controls: Profile pill, notification, logout */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* User profile button / pill */}
        <button
          type="button"
          onClick={onOpenAccount}
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors text-left group border border-gray-200 bg-white"
          title="Buka Pengaturan Akun"
        >
          <img
            src={profile.avatar || "/assets/avatars/starter-photo-profile.jpg"}
            alt={profile.name}
            onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
            className="w-9 h-9 rounded-full object-cover border-2 border-teal-400 shadow-2xs"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 group-hover:text-teal-600 transition-colors leading-tight">
              {profile.name}
            </span>
            <span className="text-[10px] text-gray-400 leading-tight">
              {profile.role}
            </span>
          </div>
        </button>

        {/* Log Out Button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
        >
          <span>Log Out</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
};
