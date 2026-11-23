// src/app/login/sales/staff/page.tsx
"use client";

import React, { useState } from 'react';
import { SalesAuthGuard } from '@/components/sales/SalesAuthGuard';
import { SalesSidebar } from '@/components/sales/SalesSidebar';
import { SalesTopBar } from '@/components/sales/SalesTopBar';
import { SalesDashboardView } from '@/components/sales/SalesDashboardView';
import { SalesAccountView } from '@/components/sales/SalesAccountView';
import { INITIAL_SALES_PROFILE, SalesProfile } from '@/constants/salesData';

export default function SalesStaffPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'account'>('dashboard');
  const [profile] = useState<SalesProfile>(INITIAL_SALES_PROFILE);

  return (
    <SalesAuthGuard allowedRoles={['SALES', 'SALES_MARKETING_SPV', 'SUPER_ADMIN', 'C_LEVEL']}>
      {({ onLogout, user }) => {
        const dynamicProfile: SalesProfile = {
          ...profile,
          name: user?.name || profile.name,
          role: user?.role === 'SALES_MARKETING_SPV' ? 'Supervisor Sales' : (user?.role || 'Sales'),
          registeredEmail: user?.email || profile.registeredEmail,
        };

        return (
          // flex h-screen overflow-hidden memastikan sidebar terkunci dan tidak bisa di-scroll
          <div className="flex h-[100dvh] w-full bg-[#F9FAFB] font-sans text-gray-800 overflow-hidden">
            {/* Left Minimal Sidebar (Terkunci permanen, tidak bisa ke-scroll) */}
            <SalesSidebar
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
            />

            {/* Main Scrollable Area (Hanya area ini yang bisa di-scroll) */}
            <div className="flex-1 h-[100dvh] overflow-y-auto overflow-x-hidden min-w-0">
              <main className="p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-16">
                {/* Top Bar with user pill & logout */}
                <SalesTopBar
                  profile={dynamicProfile}
                  referralCode="SL01"
                  onOpenAccount={() => setCurrentView('account')}
                  onLogout={onLogout}
                />

                {/* View Switcher */}
                {currentView === 'dashboard' ? (
                  <SalesDashboardView />
                ) : (
                  <SalesAccountView
                    profile={dynamicProfile}
                    onBackToDashboard={() => setCurrentView('dashboard')}
                  />
                )}
              </main>
            </div>
          </div>
        );
      }}
    </SalesAuthGuard>
  );
}
