/**
 * Reusable skeleton loading placeholders for ToenToen operational workflows.
 */

import React from 'react';

export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200/80 rounded-md ${className}`}
      {...props}
    />
  );
}
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
export function KycTableRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-gray-100 hover:bg-gray-50/40">
          <td className="px-4 py-3.5">
            <Skeleton className="h-4 w-32 rounded mb-1" />
            <Skeleton className="h-2.5 w-20 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <Skeleton className="h-3.5 w-36 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <Skeleton className="h-3.5 w-20 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <Skeleton className="h-5 w-16 rounded-full" />
          </td>
          <td className="px-4 py-3.5">
            <Skeleton className="h-3.5 w-24 rounded" />
          </td>
          <td className="px-4 py-3.5 text-right">
            <Skeleton className="h-7 w-20 rounded-lg ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
export function SalesTableRowSkeleton({ count = 5, cols = 7 }: { count?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-gray-100">
          <td className="py-3.5 px-4">
            <Skeleton className="h-4 w-28 rounded mb-1" />
            <Skeleton className="h-2.5 w-16 rounded" />
          </td>
          <td className="py-3.5 px-4">
            <Skeleton className="h-4 w-32 rounded mb-1" />
            <Skeleton className="h-2.5 w-20 rounded" />
          </td>
          <td className="py-3.5 px-4 text-center">
            <Skeleton className="h-5 w-16 mx-auto rounded-full" />
          </td>
          <td className="py-3.5 px-4 text-center">
            <Skeleton className="h-5 w-20 mx-auto rounded-full" />
          </td>
          <td className="py-3.5 px-4 text-center">
            <Skeleton className="h-5 w-20 mx-auto rounded-full" />
          </td>
          <td className="py-3.5 px-4 text-center">
            <Skeleton className="h-6 w-24 mx-auto rounded-lg" />
          </td>
          <td className="py-3.5 px-4 text-right">
            <div className="flex items-center justify-end space-x-2">
              <Skeleton className="h-7 w-18 rounded-lg" />
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
export function KycDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        {/* Dokumen Card */}
        <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
        </div>

        {/* Data Pengajuan Card */}
        <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
          <Skeleton className="h-4 w-32 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b border-gray-50 pb-2 space-y-1">
                <Skeleton className="h-2.5 w-20 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tindakan Box */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white h-fit space-y-4">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}
export function CmoDivisionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b border-gray-100 last:border-b-0 pb-6 space-y-3">
          <Skeleton className="h-3.5 w-24 rounded" />
          <div className="p-3 bg-gray-50/60 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-1/4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-2.5 w-16 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1 w-full">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-2.5 w-16 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-2 w-20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardShellSkeleton({ withSidebar = true }: { withSidebar?: boolean }) {
  return (
    <div className="flex h-[100dvh] w-full bg-gray-50 overflow-hidden">
      {withSidebar && (
        <aside className="hidden md:flex w-16 shrink-0 flex-col items-center gap-6 border-r border-gray-200 bg-white py-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex flex-col gap-4 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-9 h-9 rounded-xl" />
            ))}
          </div>
        </aside>
      )}
      <div className="flex-1 min-w-0 bg-white overflow-hidden">
        <div className="bg-white border border-gray-200 px-3 sm:px-6 py-3 flex justify-between items-center m-3 sm:m-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-2.5 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="px-3 sm:px-6 pt-2 space-y-4">
          <Skeleton className="h-7 w-36 rounded-md" />
          <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
            <Skeleton className="h-4 w-48 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-40 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <Skeleton className="h-4 w-36 rounded" />
            <CmoDivisionSkeleton count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MerchantHistorySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
            <Skeleton className="h-2.5 w-20 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-100 px-3 py-2.5 flex gap-4">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-3 py-3 flex items-center justify-between gap-4">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-3.5 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
