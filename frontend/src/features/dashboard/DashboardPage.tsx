import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => (
  <section className="space-y-6">
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
        Workspace Overview
      </span>
      <h2 className="mt-6 text-3xl font-semibold text-white">Welcome back</h2>
      <p className="mt-4 max-w-xl text-sm text-slate-300">
        Use the navigation to review purchase requests, capture new submissions, and track approvals. Real-time data is
        fetched directly from the backend so every action reflects the latest state.
      </p>
      <Link
        to="/app/requests"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-indigoGlow to-emeraldGlow px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
      >
        Manage purchase requests
      </Link>
    </div>
  </section>
);
