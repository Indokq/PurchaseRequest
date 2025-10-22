import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const AppLayout: React.FC = () => {
  const { auth, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Purchase Request Management</p>
            <h1 className="text-lg font-semibold text-white">Team Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">{auth?.fullName ?? 'User'}</p>
              <p className="text-xs text-slate-400">{auth?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-rose-400/50 hover:text-rose-200"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
        <nav className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl gap-4 px-6 py-3 text-sm">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 font-medium transition ${
                  isActive ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/app/requests"
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 font-medium transition ${
                  isActive ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              Purchase Requests
            </NavLink>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
