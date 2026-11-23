"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { usePermission } from '@/hooks/usePermission';

// Mobile: navigasi bawah (bottom bar). md ke atas: sidebar ikon di kiri.
const ITEMS = [
  {
    href: '/login/admin/supervisor',
    label: 'Dashboard',
    exact: true,
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
  {
    href: '/login/admin/supervisor/inbox',
    label: 'Inbox',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    href: '/login/admin/supervisor/report',
    label: 'Report',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    requiredPermission: 'reports:cs_evaluations',
  },
  {
    href: '/login/admin/supervisor/kyc',
    label: 'KYC',
    icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
    requiredPermission: 'kyc:view_all',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname() ?? '';
  const { hasPermission, isCLevel } = usePermission();

  const visibleItems = ITEMS.filter(
    (item) => !item.requiredPermission || hasPermission(item.requiredPermission)
  );

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full shrink-0 select-none items-center border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:h-screen md:w-16 md:flex-col md:border-r md:border-t-0 md:py-4 md:pb-4">
      <Link href="/login/admin/supervisor" className="hidden md:flex md:mb-8">
        <Image
          src="/assets/logo/toentoen-logo.png"
          alt="ToenToen Logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl object-contain shadow-xs hover:opacity-90 transition-opacity"
        />
      </Link>
      <nav className="flex w-full flex-row items-center justify-around text-gray-400 md:w-auto md:flex-col md:justify-start md:gap-6">
        {/* Tombol kembali ke CMO Hub jika akun adalah CMO / C_LEVEL */}
        {isCLevel() && (
          <Link
            href="/login/cmo"
            title="Kembali ke CMO Hub"
            className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-teal-600 hover:bg-teal-50 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            <span className="text-[9px] font-bold">CMO</span>
          </Link>
        )}
        {visibleItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-lg p-2 transition-colors ${
                active ? 'bg-gray-100 text-gray-800' : 'hover:text-gray-800'
              }`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium leading-none md:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
