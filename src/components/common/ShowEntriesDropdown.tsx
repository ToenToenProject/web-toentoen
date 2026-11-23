"use client";

import React from 'react';

interface ShowEntriesDropdownProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export const ShowEntriesDropdown: React.FC<ShowEntriesDropdownProps> = ({
  value,
  onChange,
  options = [10, 20, 50, 70, 100],
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-1.5 text-xs text-gray-600 font-medium ${className}`}>
      <span>Show</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-2xs transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span>entries</span>
    </div>
  );
};
