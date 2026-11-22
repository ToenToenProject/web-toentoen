"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Mobile: navigasi bawah (bottom bar). md ke atas: sidebar ikon di kiri.
const GRID_ICON = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const pathIcon = (d: string) => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);

const ITEMS = [
  { href: '/login/admin/staff', label: 'Dashboard', exact: true, icon: GRID_ICON },
  {
    href: '/login/admin/staff/inbox',
    label: 'Inbox',
    icon: pathIcon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'),
  },
  {
    href: '/login/admin/staff/report',
    label: 'Report',
    icon: pathIcon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname() ?? '';

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full shrink-0 select-none items-center border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:h-screen md:w-16 md:flex-col md:border-r md:border-t-0 md:py-4 md:pb-4">
      <div className="hidden h-10 w-10 items-center justify-center rounded bg-teal-500 text-center text-xs font-bold leading-none text-white md:mb-8 md:flex">
        TO<br />EN
      </div>
      <nav className="flex w-full flex-row items-center justify-around text-gray-400 md:w-auto md:flex-col md:justify-start md:gap-6">
        {ITEMS.map((item) => {
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
              {item.icon}
              <span className="text-[10px] font-medium leading-none md:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
