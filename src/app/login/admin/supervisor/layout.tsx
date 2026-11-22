import React from 'react';
// Pastikan path import AdminSidebar ini sesuai dengan lokasi file Anda
import AdminSidebar from '@/components/layout/admin/supervisor/SPVSidebar'; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Pembungkus background putih/abu-abu dan layout flex kita pindahkan ke sini
    <div className="flex h-[100dvh] bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile: navigasi bawah. md ke atas: sidebar kiri */}
      <AdminSidebar />
      
      {/* children ini adalah isi dari page.tsx (Dashboard, Inbox, dll) */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-16 md:pb-0">
        {children}
      </div>
      
    </div>
  );
}