"use client";

import React, { useState, useEffect } from 'react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onApply: (date: Date, formattedLabel: string, isoDate: string, period?: string) => void;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function DatePickerModal({
  isOpen,
  onClose,
  selectedDate,
  onApply,
}: DatePickerModalProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(new Date(selectedDate || today));
  const [tempDate, setTempDate] = useState<Date>(new Date(selectedDate || today));
  const [selectedPreset, setSelectedPreset] = useState<string>("today");
  useEffect(() => {
    if (isOpen) {
      const initial = new Date(selectedDate || today);
      setViewDate(new Date(initial));
      setTempDate(new Date(initial));
    }
  }, [isOpen, selectedDate]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value, 10), currentMonth, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(currentYear, parseInt(e.target.value, 10), 1));
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setTempDate(newDate);
    setSelectedPreset("custom");
  };

  const formatOutput = (date: Date) => {
    const isToday = date.toDateString() === today.toDateString();
    const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();

    const formattedLabel = isToday 
      ? `Hari Ini, ${day} ${month} ${year}` 
      : `${dayName}, ${day} ${month} ${year}`;

    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return { formattedLabel, isoDate };
  };

  const handleApplyPreset = (preset: 'today' | 'yesterday' | 'this_week' | 'this_month') => {
    let target = new Date();
    if (preset === 'yesterday') {
      target.setDate(target.getDate() - 1);
    }
    setTempDate(new Date(target));
    setViewDate(new Date(target));
    setSelectedPreset(preset);

    const { formattedLabel, isoDate } = formatOutput(target);
    onApply(target, formattedLabel, isoDate, preset);
    onClose();
  };

  const handleConfirm = () => {
    const { formattedLabel, isoDate } = formatOutput(tempDate);
    onApply(tempDate, formattedLabel, isoDate, selectedPreset);
    onClose();
  };
  const baseYear = today.getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => baseYear - 5 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        role="dialog" 
        aria-modal="true" 
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleUp"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h3 className="text-base font-bold text-gray-900">Pilih Tanggal Dashboard</h3>
            <p className="text-xs text-gray-500 mt-0.5">Filter data operasional & performa SLA</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Konten Utama */}
        <div className="p-6">
          {/* Preset Cepat */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            <button
              onClick={() => handleApplyPreset('today')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                selectedPreset === 'today'
                  ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => handleApplyPreset('yesterday')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                selectedPreset === 'yesterday'
                  ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Kemarin
            </button>
            <button
              onClick={() => handleApplyPreset('this_week')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                selectedPreset === 'this_week'
                  ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => handleApplyPreset('this_month')}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                selectedPreset === 'this_month'
                  ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          {/* Kalender Header (Bulan, Tahun, Navigasi) */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                className="bg-gray-100/80 hover:bg-gray-100 text-gray-900 text-xs font-bold py-1 px-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={handleYearChange}
                className="bg-gray-100/80 hover:bg-gray-100 text-gray-900 text-xs font-bold py-1 px-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Bulan Sebelumnya"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Bulan Berikutnya"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Grid Nama Hari */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((day, idx) => (
              <span key={idx} className="text-[11px] font-bold text-gray-400 py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Hari dari bulan sebelumnya */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div 
                  key={`prev-${i}`} 
                  className="py-2 text-xs text-gray-300 font-medium select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Hari dalam bulan aktif */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = 
                tempDate.getDate() === dayNum &&
                tempDate.getMonth() === currentMonth &&
                tempDate.getFullYear() === currentYear;

              const isCurrentRealToday = 
                today.getDate() === dayNum &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear;

              return (
                <button
                  key={`curr-${dayNum}`}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md font-bold scale-105'
                      : isCurrentRealToday
                      ? 'text-teal-700 bg-teal-50/80 font-bold hover:bg-teal-100'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {dayNum}
                  {isCurrentRealToday && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Info Tanggal Terpilih */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Tanggal dipilih:</span>
            <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60">
              {formatOutput(tempDate).formattedLabel}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Terapkan Tanggal</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
