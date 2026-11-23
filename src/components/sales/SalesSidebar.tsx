"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePermission } from '@/hooks/usePermission';

interface SalesSidebarProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'account') => void;
}

export const SalesSidebar: React.FC<SalesSidebarProps> = ({ currentView, onNavigate }) => {
  const { isCLevel } = usePermission();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full shrink-0 select-none items-center border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:z-20 md:h-screen md:w-16 md:flex-col md:gap-6 md:overflow-hidden md:border-r md:border-t-0 md:py-4">
      {/* Brand Icon */}
      <div 
        onClick={() => onNavigate('dashboard')}
        className="w-10 h-10 hidden md:flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
      >
        <Image
          src="/assets/logo/toentoen-logo.png"
          alt="ToenToen Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-xl object-contain shadow-xs"
        />
      </div>

      {/* Navigation Icons */}
      <nav className="flex w-full flex-row items-center justify-around md:w-auto md:flex-col md:justify-start md:gap-4">
        {/* Tombol kembali ke CMO Hub jika akun adalah CMO / C_LEVEL */}
        {isCLevel() && (
          <Link
            href="/login/cmo"
            title="Kembali ke CMO Hub"
            className="p-2.5 rounded-xl transition-all text-teal-600 hover:bg-teal-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
          </Link>
        )}

        {/* Dashboard Grid Icon */}
        <button
          type="button"
          aria-label="Dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`p-2.5 rounded-xl transition-all ${
            currentView === 'dashboard'
              ? 'bg-gray-100 text-gray-900 shadow-xs'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </button>
      </nav>
    </aside>
  );
};
