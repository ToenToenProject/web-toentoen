// src/components/ui/Skeleton.tsx
// Kumpulan Skeleton Loader Components untuk ToenToen Operations

import React from 'react';

export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200/80 rounded-md ${className}`}
      {...props}
    />
  );
}

// 1. Skeleton Card Metric (Dashboard Overview)
export function MetricCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-[130px] animate-pulse bg-white">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-7 w-16 rounded-md mt-2" />
      </div>
      <div className="flex space-x-2 pt-2">
        <Skeleton className="h-2.5 w-12 rounded" />
        <Skeleton className="h-2.5 w-12 rounded" />
        <Skeleton className="h-2.5 w-12 rounded" />
      </div>
    </div>
  );
}

// 2. Skeleton Urgent Alert Card
export function AlertCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 animate-pulse bg-white">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3.5 w-20 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <Skeleton className="h-4 w-4/5 rounded" />
      <Skeleton className="h-9 w-full rounded-lg mt-2" />
    </div>
  );
}

// 3. Skeleton Category Bar
export function CategoryBarSkeleton() {
  return (
    <div className="space-y-1.5 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-28 rounded" />
        <Skeleton className="h-3 w-8 rounded" />
      </div>
      <Skeleton className="h-2.5 w-full rounded-full" />
    </div>
  );
}

// 4. Skeleton Table Row (Team Capacity)
export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-3 flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
        </div>
      </td>
      <td className="px-6 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-6 py-3 text-center">
        <Skeleton className="h-4 w-8 mx-auto rounded" />
      </td>
      <td className="px-6 py-3 text-center">
        <Skeleton className="h-4 w-10 mx-auto rounded" />
      </td>
    </tr>
  );
}

// 5. Skeleton Kanban Card (Report & Support Ticket)
export function KanbanCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-3 animate-pulse">
      <div className="flex items-center space-x-2.5">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-10 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-4/5 rounded" />
      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
        <Skeleton className="h-2.5 w-20 rounded" />
        <Skeleton className="h-2.5 w-12 rounded" />
      </div>
    </div>
  );
}

// 6. Skeleton Inbox Ticket List Card
export function InboxTicketCardSkeleton() {
  return (
    <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-2.5 animate-pulse">
      <div className="flex items-center space-x-2.5">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <Skeleton className="h-2.5 w-36 rounded" />
        </div>
      </div>
      <Skeleton className="h-3 w-4/5 rounded" />
    </div>
  );
}

// 7. Skeleton Chat Messages
export function ChatBubbleSkeleton() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {/* Pesan Masuk (Customer) */}
      <div className="flex items-start space-x-3">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="space-y-2 max-w-[70%]">
          <Skeleton className="h-3 w-20 rounded" />
          <div className="p-3 bg-gray-100 rounded-2xl space-y-1.5">
            <Skeleton className="h-3 w-48 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        </div>
      </div>

      {/* Pesan Keluar (Agent / Supervisor) */}
      <div className="flex items-start justify-end space-x-3">
        <div className="space-y-2 max-w-[70%] flex flex-col items-end">
          <Skeleton className="h-3 w-20 rounded" />
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-2xl space-y-1.5">
            <Skeleton className="h-3 w-44 rounded" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      </div>
    </div>
  );
}

// 8. Skeleton Customer Profile Sidebar
export function CustomerProfileSkeleton() {
  return (
    <div className="p-4 space-y-5 animate-pulse">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3 w-36 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-3">
        <Skeleton className="h-3.5 w-28 rounded" />
        <div className="space-y-2">
          <div className="flex justify-between"><Skeleton className="h-3 w-20 rounded" /><Skeleton className="h-3 w-16 rounded" /></div>
          <div className="flex justify-between"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-3 w-20 rounded" /></div>
          <div className="flex justify-between"><Skeleton className="h-3 w-16 rounded" /><Skeleton className="h-3 w-14 rounded" /></div>
        </div>
      </div>
    </div>
  );
}
