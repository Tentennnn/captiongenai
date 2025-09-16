import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { UserIcon, LogoutIcon, ChevronDownIcon } from './icons';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useUser();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/60 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-blue-400" />
        </div>
        <span className="hidden sm:inline font-medium text-slate-300">{currentUser.username}</span>
        <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 animate-fade-in-fast z-10">
          <div className="px-4 py-2 border-b border-slate-700">
            <p className="font-semibold text-slate-200 truncate">{currentUser.username}</p>
            <p className="text-sm text-slate-400 truncate">{currentUser.email}</p>
          </div>
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Account Type</span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    currentUser.plan === 'pro' ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-300'
                }`}>
                    {currentUser.plan === 'pro' ? 'Pro' : 'Free'}
                </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700/60 hover:text-red-500 transition-colors"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      )}
      <style>{`
        @keyframes fade-in-fast {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-fast {
            animation: fade-in-fast 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;