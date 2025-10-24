import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Package, Users, Building } from 'lucide-react';
import { Card } from '../../../shared/components';

export const DashboardPage: React.FC = () => {
  const quickLinks = [
    {
      title: 'Purchase Requests',
      description: 'Manage and approve purchase requests',
      icon: FileText,
      href: '/purchase-requests',
      color: 'from-primary/20 to-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Products',
      description: 'Browse product catalog',
      icon: Package,
      href: '/products',
      color: 'from-emerald-500/20 to-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Departments',
      description: 'Manage departments',
      icon: Building,
      href: '/departments',
      color: 'from-amber-500/20 to-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Users',
      description: 'User management',
      icon: Users,
      href: '/users',
      color: 'from-purple-500/20 to-purple-500/10',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome to Purchase Request Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} to={link.href}>
              <Card className={`p-6 bg-gradient-to-br ${link.color} border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1`}>
                <div className={`rounded-full w-12 h-12 flex items-center justify-center bg-slate-900/60 mb-4 ${link.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{link.title}</h3>
                <p className="text-sm text-slate-400">{link.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Requests</span>
              <span className="text-2xl font-bold text-white">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pending Approvals</span>
              <span className="text-2xl font-bold text-amber-400">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Approved This Month</span>
              <span className="text-2xl font-bold text-emerald-400">-</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <p className="text-slate-500">No recent activity</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
