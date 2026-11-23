// src/app/login/sales/supervisor/page.tsx
"use client";

import React, { useState } from 'react';
import { SalesAuthGuard } from '@/components/sales/SalesAuthGuard';
import { SalesSidebar } from '@/components/sales/SalesSidebar';
import { SalesTopBar } from '@/components/sales/SalesTopBar';
import { SupervisorDashboardView } from '@/components/sales/SupervisorDashboardView';
import { SupervisorAccountView } from '@/components/sales/SupervisorAccountView';
import { SupervisorStaffDetailView } from '@/components/sales/SupervisorStaffDetailView';
import {
  SUPERVISOR_PROFILE,
  SUPERVISOR_TEAM_MEMBERS,
  SupervisorSalesMember,
} from '@/constants/salesSupervisorData';
import { SalesProfile } from '@/constants/salesData';

export default function SalesSupervisorPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'account' | 'staff-detail'>('dashboard');
  const [selectedStaff, setSelectedStaff] = useState<SupervisorSalesMember>(SUPERVISOR_TEAM_MEMBERS[1]); // default Fitri

  const handleSelectStaff = (staff: SupervisorSalesMember) => {
    setSelectedStaff(staff);
    setCurrentView('staff-detail');
  };

  return (
    <SalesAuthGuard allowedRoles={['SALES_MARKETING_SPV', 'SUPER_ADMIN', 'C_LEVEL']}>
      {({ onLogout, user }) => {
        const dynamicProfile: SalesProfile = {
          ...SUPERVISOR_PROFILE,
          name: user?.name || SUPERVISOR_PROFILE.name,
          role: 'Supervisor Sales',
          registeredEmail: user?.email || SUPERVISOR_PROFILE.registeredEmail,
        };

        return (
          // flex h-screen overflow-hidden memastikan sidebar terkunci dan tidak bisa di-scroll
          <div className="flex h-[100dvh] w-full bg-[#F9FAFB] font-sans text-gray-800 overflow-hidden">
            {/* Left Minimal Sidebar (Terkunci permanen, tidak bisa ke-scroll) */}
            <SalesSidebar
              currentView={currentView === 'staff-detail' ? 'dashboard' : currentView}
              onNavigate={(view) => setCurrentView(view)}
            />

            {/* Main Scrollable Area */}
            <div className="flex-1 h-[100dvh] overflow-y-auto overflow-x-hidden min-w-0">
              <main className="w-full bg-white min-h-screen pb-8">
                {/* Top Bar with user pill & logout */}
                <SalesTopBar
                  profile={dynamicProfile}
                  referralCode="SS01"
                  onOpenAccount={() => setCurrentView('account')}
                  onLogout={onLogout}
                />

                <div className="px-3 sm:px-6 pt-2 space-y-4">
                  {/* View Switcher */}
                  {currentView === 'dashboard' && (
                    <SupervisorDashboardView onSelectStaff={handleSelectStaff} />
                  )}

                  {currentView === 'account' && (
                    <SupervisorAccountView
                      onBackToDashboard={() => setCurrentView('dashboard')}
                    />
                  )}

                  {currentView === 'staff-detail' && (
                    <SupervisorStaffDetailView
                      staff={selectedStaff}
                      onBack={() => setCurrentView('dashboard')}
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
        );
      }}
    </SalesAuthGuard>
  );
}
