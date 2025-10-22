import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Sparkles, ArrowUpRight, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'https://localhost:5001/api';

interface PurchaseRequest {
  id: string;
  requestNumber: string;
  title: string;
  status: string;
  priority: string;
  totalAmount: number;
  requestDate: string;
  requesterName?: string;
  departmentName?: string;
}

interface DashboardStats {
  myRequests: number;
  pendingApprovals: number;
  overdueApprovals: number;
  totalPendingPRs: number;
  totalApprovedAmount: number;
}

function App() {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    myRequests: 0,
    pendingApprovals: 0,
    overdueApprovals: 0,
    totalPendingPRs: 0,
    totalApprovedAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL.replace('/api', '')}/hubs/notification`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection.on('ReceiveNotification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 10));
    });

    connection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err));

    fetchPurchaseRequests();
    fetchDashboardStats();

    return () => {
      connection.stop();
    };
  }, []);

  const fetchPurchaseRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/PurchaseRequest`);
      setPurchaseRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    setStats({
      myRequests: 12,
      pendingApprovals: 5,
      overdueApprovals: 2,
      totalPendingPRs: 28,
      totalApprovedAmount: 125000
    });
  };

  type StatusVariant = {
    Icon: React.ElementType;
    className: string;
  };

  const statusVariants: Record<string, StatusVariant> = {
    Draft: { Icon: FileText, className: 'bg-slate-700/30 border border-slate-600/40 text-slate-200' },
    Submitted: { Icon: FileText, className: 'bg-primary/15 border border-primary/40 text-primary' },
    PendingApproval: { Icon: Clock, className: 'bg-amber-500/15 border border-amber-400/40 text-amber-200' },
    Approved: { Icon: CheckCircle, className: 'bg-emeraldGlow/15 border border-emeraldGlow/35 text-emerald-200' },
    Rejected: { Icon: AlertCircle, className: 'bg-rose-500/15 border border-rose-400/40 text-rose-200' },
    Default: { Icon: FileText, className: 'bg-white/10 border border-white/10 text-slate-200' },
  };

  const priorityVariants: Record<string, string> = {
    Low: 'text-emerald-300',
    Medium: 'text-amber-300',
    High: 'text-orange-300',
    Critical: 'text-rose-300',
    Emergency: 'text-rose-200 font-semibold',
    Default: 'text-slate-200',
  };

  const getStatusVariant = (status: string) => statusVariants[status] ?? statusVariants.Default;
  const getPriorityVariant = (priority: string) => priorityVariants[priority] ?? priorityVariants.Default;

  const formatLabel = (value: string) =>
    value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^(\w)/, (char) => char.toUpperCase());

  const chartData = [
    { name: 'Jan', requests: 45, approved: 38 },
    { name: 'Feb', requests: 52, approved: 48 },
    { name: 'Mar', requests: 61, approved: 55 },
    { name: 'Apr', requests: 48, approved: 42 },
    { name: 'May', requests: 70, approved: 65 },
    { name: 'Jun', requests: 58, approved: 52 }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute right-[-10%] top-20 h-80 w-80 rounded-full bg-indigoGlow/25 blur-[140px]" />
        <div className="absolute left-1/2 top-[65%] h-96 w-96 -translate-x-1/2 rounded-full bg-emeraldGlow/20 blur-[140px]" />
      </div>
      <div className="absolute inset-0 bg-radial-dashboard opacity-70" />

      <div className="relative z-10">
        <nav className="px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-4 shadow-glow backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-2 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-100 sm:text-2xl">Purchase Request Management</h1>
                  <p className="text-sm text-slate-400">Stay on top of approvals, spending, and team activity.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative rounded-full border border-white/10 bg-white/5 p-2 text-slate-100 transition hover:border-primary/60 hover:text-primary">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary via-indigoGlow to-emeraldGlow text-xs font-semibold text-white shadow-glow">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <button className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:border-primary/60 hover:text-primary md:flex">
                  <Sparkles className="h-4 w-4" />
                  Automations
                </button>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/10 to-white/5 px-4 py-1.5 text-sm font-semibold text-slate-100 shadow-inner shadow-white/10">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">JD</span>
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <header className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 px-8 py-10 shadow-glow">
              <div className="absolute inset-0">
                <div className="absolute -left-32 top-0 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
                <div className="absolute -right-24 bottom-[-20%] h-72 w-72 rounded-full bg-emeraldGlow/20 blur-[160px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-60" />
              </div>
              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Dashboard
                  </span>
                  <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    <span className="bg-gradient-to-r from-white via-primary/80 to-emerald-200 bg-clip-text text-transparent">Welcome back, Jordan!</span>
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-300">Monitor requests, approvals, and spending in real time with a workspace designed to stay out of your way while surfacing what matters.</p>
                </div>
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:gap-8 lg:w-auto lg:flex-col lg:items-end lg:border-l lg:border-white/10 lg:bg-transparent lg:px-8 lg:py-0 lg:pl-8">
                  <div className="text-left sm:text-right lg:text-right">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Approved</span>
                    <p className="mt-3 text-4xl font-semibold text-emerald-300">${stats.totalApprovedAmount.toLocaleString()}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emeraldGlow/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <ArrowUpRight className="h-4 w-4" />
                    +4.7% vs last month
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Live Activity</span>
                <span className="text-xs text-slate-500">Updated {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="space-y-3 text-sm text-slate-400">
                <p>• You have {stats.pendingApprovals} approvals awaiting review.</p>
                <p>• {stats.overdueApprovals} approvals are overdue—prioritize critical requests.</p>
                <p>• {purchaseRequests.length} purchase requests synced from API.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-10 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-slate-900/70 to-slate-950/80 p-6 shadow-glow transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(99,102,241,0.65)]">
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
              </div>
              <div className="relative flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-300">My Requests</span>
                    <p className="mt-2 text-3xl font-bold text-slate-50">{stats.myRequests}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-3 text-primary shadow-inner shadow-primary/20">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-xs text-slate-400">Track drafts and submissions awaiting completion.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/20 via-slate-900/70 to-slate-950/80 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(245,158,11,0.55)]">
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-amber-400/30 blur-2xl" />
              </div>
              <div className="relative flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-amber-200">Pending Approvals</span>
                    <p className="mt-2 text-3xl font-bold text-amber-100">{stats.pendingApprovals}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-3 text-amber-300 shadow-inner shadow-amber-500/20">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-xs text-amber-100/80">Review and unblock teammates to maintain velocity.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/20 via-slate-900/70 to-slate-950/80 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(244,63,94,0.55)]">
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-rose-400/30 blur-2xl" />
              </div>
              <div className="relative flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-rose-200">Overdue</span>
                    <p className="mt-2 text-3xl font-bold text-rose-100">{stats.overdueApprovals}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-3 text-rose-200 shadow-inner shadow-rose-500/25">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-xs text-rose-100/80">Escalate overdue approvals before they impact projects.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-slate-900/70 to-slate-950/80 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(168,85,247,0.55)]">
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-purple-400/30 blur-2xl" />
              </div>
              <div className="relative flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-violet-200">Total Pending</span>
                    <p className="mt-2 text-3xl font-bold text-violet-100">{stats.totalPendingPRs}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-3 text-violet-200 shadow-inner shadow-violet-500/25">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-xs text-violet-100/80">Keep an eye on workflow capacity across teams.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emeraldGlow/20 via-slate-900/70 to-slate-950/80 p-6 shadow-glow transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-20px_rgba(52,211,153,0.55)]">
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-emerald-400/25 blur-2xl" />
              </div>
              <div className="relative flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-emerald-200">Approved Amount</span>
                    <p className="mt-2 text-2xl font-bold text-emerald-100">${stats.totalApprovedAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/60 p-3 text-emerald-200 shadow-inner shadow-emerald-500/25">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-xs text-emerald-100/80">Approved purchases contributing to current quarter spend.</p>
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-glow">
              <div className="absolute -top-24 right-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative">
                <h2 className="text-lg font-semibold text-slate-100">Purchase Request Trends</h2>
                <p className="mt-1 text-sm text-slate-400">A six-month view comparing submitted versus approved volume.</p>
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderRadius: '0.75rem', border: '1px solid rgba(148,163,184,0.2)', color: '#e2e8f0' }} />
                      <Legend wrapperStyle={{ color: '#cbd5f5' }} />
                      <Bar dataKey="requests" fill="#6366f1" name="Requests" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="approved" fill="#34d399" name="Approved" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-glow">
              <div className="absolute -top-24 left-0 h-44 w-44 rounded-full bg-emeraldGlow/15 blur-3xl" />
              <div className="relative">
                <h2 className="text-lg font-semibold text-slate-100">Recent Notifications</h2>
                <p className="mt-1 text-sm text-slate-400">Stay aware of approvals, comments, and status updates.</p>
                <div className="mt-6 space-y-4">
                  {notifications.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-10 text-center">
                      <Sparkles className="mx-auto h-10 w-10 text-slate-500" />
                      <p className="mt-3 text-sm font-semibold text-slate-300">Nothing new just yet</p>
                      <p className="text-xs text-slate-500">Activity will appear here the moment your team makes a move.</p>
                    </div>
                  ) : (
                    notifications.map((notif, index) => {
                      const statusVariant = getStatusVariant(notif.status ?? 'Default');
                      const StatusIcon = statusVariant.Icon;
                      const formattedTimestamp = notif.timestamp ? new Date(notif.timestamp).toLocaleString() : 'Just now';

                      return (
                        <div key={index} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-4 pl-10 transition duration-300 hover:border-primary/50 hover:shadow-glow">
                          <span className="absolute left-4 top-4 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-gradient-to-br from-primary via-indigoGlow to-emeraldGlow shadow-[0_0_12px_rgba(99,102,241,0.7)]" />
                          {index !== notifications.length - 1 && (
                            <span className="absolute left-[16px] top-6 bottom-[-1.5rem] w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
                          )}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-100">{notif.title}</p>
                              <p className="mt-1 text-xs text-slate-400">{notif.message}</p>
                            </div>
                            <StatusIcon className="mt-1 h-4 w-4 text-primary" />
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{formattedTimestamp}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-glow">
            <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Recent Purchase Requests</h2>
                <p className="text-sm text-slate-400">Review the latest submissions and take action.</p>
              </div>
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-indigoGlow to-emeraldGlow px-5 py-2 text-sm font-semibold text-white shadow-glow transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-slate-900 hover:shadow-[0_20px_40px_-20px_rgba(99,102,241,0.7)]">
                <span>New Request</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left">
                  <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">Request #</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Priority</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Amount</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 text-center text-slate-400">Loading...</td>
                      </tr>
                    ) : purchaseRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-6 text-center text-slate-400">No purchase requests found</td>
                      </tr>
                    ) : (
                      purchaseRequests.map((pr) => {
                        const statusVariant = getStatusVariant(pr.status);
                        const StatusIcon = statusVariant.Icon;
                        const priorityClassName = getPriorityVariant(pr.priority);
                        const formattedStatus = formatLabel(pr.status);
                        const formattedPriority = formatLabel(pr.priority);

                        return (
                          <tr key={pr.id} className="group transition duration-200 hover:bg-white/5">
                            <td className="px-6 py-4 text-sm font-semibold text-primary">{pr.requestNumber}</td>
                            <td className="px-6 py-4 text-sm text-slate-100">{pr.title}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusVariant.className}`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {formattedStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium ${priorityClassName}`}>
                                <span className="h-2 w-2 rounded-full bg-current" />
                                {formattedPriority}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-emerald-200">${pr.totalAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-slate-400">{new Date(pr.requestDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-primary/40 hover:text-primary">View</button>
                                <button className="inline-flex items-center gap-2 rounded-full bg-emeraldGlow/30 px-4 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emeraldGlow/40">Approve</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
