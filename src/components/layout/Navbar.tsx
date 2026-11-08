import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, LogOut } from 'lucide-react';
// ✅ To this (add the word "type"):
import type { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, switchDemoRole, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1.5 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Role: {role.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <span className="px-2 text-slate-400">Switch:</span>
          {(['admin', 'faculty', 'student', 'placement_officer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchDemoRole(r)}
              className={
                role === r
                  ? 'px-2.5 py-1 rounded-lg capitalize transition bg-white text-indigo-600 shadow-sm font-bold'
                  : 'px-2.5 py-1 rounded-lg capitalize transition text-slate-600 hover:text-slate-900'
              }
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="text-right">
          <p className="text-xs font-bold text-slate-900">{user?.first_name} {user?.last_name}</p>
          <p className="text-[10px] text-slate-500">{user?.email}</p>
        </div>

        <button onClick={logout} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
