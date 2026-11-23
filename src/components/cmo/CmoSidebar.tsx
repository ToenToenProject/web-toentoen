"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CmoSidebarProps {
  currentView: 'dashboard' | 'post';
  onNavigate: (view: 'dashboard' | 'post') => void;
}

export const CmoSidebar: React.FC<CmoSidebarProps> = ({ currentView, onNavigate }) => {
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
        {/* Dashboard Grid Icon */}
        <button
          type="button"
          aria-label="Dashboard"
          title="CMO Executive Dashboard"
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

        {/* Akses Admin Hub */}
        <Link
          href="/login/admin/supervisor"
          aria-label="Admin & CS Operations"
          title="Akses Admin & CS Operations"
          className="p-2.5 rounded-xl transition-all text-gray-400 hover:text-teal-600 hover:bg-teal-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>

        {/* Akses Sales Hub */}
        <Link
          href="/login/sales/supervisor"
          aria-label="Sales Operations"
          title="Akses Sales Operations & Merchant Matrix"
          className="p-2.5 rounded-xl transition-all text-gray-400 hover:text-teal-600 hover:bg-teal-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Link>

        {/* Post Icon */}
        <button
          type="button"
          aria-label="Post"
          title="Social Media Posts"
          onClick={() => onNavigate('post')}
          className={`p-2.5 rounded-xl transition-all ${
            currentView === 'post'
              ? 'bg-gray-100 text-gray-900 shadow-xs'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </button>
      </nav>
    </aside>
  );
};
