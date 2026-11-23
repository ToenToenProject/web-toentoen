import React from 'react';

interface HeaderProps {
  onLogout: () => void;
  userName: string;
  userRole: string;
  avatarUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userName, userRole, avatarUrl }) => (
  <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center m-2 sm:m-4 rounded-xl shadow-sm gap-2">
    <div className="flex items-center space-x-3 min-w-0">
      <div className="w-10 h-10 shrink-0 rounded-full bg-gray-300 overflow-hidden">
        <img 
          src={avatarUrl || "/assets/avatars/starter-photo-profile.jpg"} 
          alt="Profile" 
          onError={(e) => { e.currentTarget.src = "/assets/avatars/starter-photo-profile.jpg"; }}
          className="w-full h-full object-cover" 
        />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900 leading-none">{userName}</h2>
        <span className="text-xs text-gray-500">{userRole}</span>
      </div>
    </div>
    <button 
      onClick={onLogout} 
      className="shrink-0 bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
      aria-label="Log Out"
    >
      <span className="hidden sm:inline">Log Out</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
      </svg>
    </button>
  </header>
);