// src/components/cmo/CmoTopBar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { CmoProfile } from '@/constants/cmoData';

interface CmoTopBarProps {
  profile: CmoProfile;
  onLogout: () => void;
}

export const CmoTopBar: React.FC<CmoTopBarProps> = ({ profile, onLogout }) => {
  const cleanAvatar = (profile.avatar && !profile.avatar.includes('unsplash.com') && !profile.avatar.includes('pravatar.cc'))
    ? profile.avatar
    : "/assets/avatars/starter-photo-profile.jpg";

  return (
    <header className="bg-white rounded-xl border border-gray-200 px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between mb-4 sm:mb-6 shadow-xs select-none gap-2">
      {/* User Info (Silvi - CMO) */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={cleanAvatar}
          alt={profile.name}
          onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
          className="w-10 h-10 shrink-0 rounded-full object-cover border border-gray-200 shadow-xs"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 leading-tight">
            {profile.name}
          </span>
          <span className="text-xs text-gray-500 font-medium leading-tight">
            {profile.role}
          </span>
        </div>
      </div>

      {/* Cross-Navigation: Akses Cepat Admin & Sales untuk CMO */}
      <div className="hidden md:flex items-center gap-1.5 bg-gray-100/90 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
        <span className="px-3 py-1 bg-white text-teal-800 rounded-lg shadow-2xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span>CMO Hub</span>
        </span>
        <Link
          href="/login/admin/supervisor"
          className="px-3 py-1 text-gray-600 hover:text-teal-700 hover:bg-white rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          title="Buka Dashboard Operasional Admin & CS"
        >
          <span>Admin & CS</span>
          <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
        <Link
          href="/login/sales/supervisor"
          className="px-3 py-1 text-gray-600 hover:text-teal-700 hover:bg-white rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          title="Buka Dashboard Monitoring Tim Sales"
        >
          <span>Sales</span>
          <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* Log Out Button */}
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log Out"
        className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#00A896] hover:bg-[#008f80] text-white text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-95"
      >
        <span className="hidden sm:inline">Log Out</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
};
