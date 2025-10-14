import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, FileText, CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-gray-200 text-gray-800',
      'Submitted': 'bg-blue-200 text-blue-800',
      'PendingApproval': 'bg-yellow-200 text-yellow-800',
      'Approved': 'bg-green-200 text-green-800',
      'Rejected': 'bg-red-200 text-red-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'text-green-600',
      'Medium': 'text-yellow-600',
      'High': 'text-orange-600',
      'Critical': 'text-red-600',
      'Emergency': 'text-red-800 font-bold'
    };
    return colors[priority] || 'text-gray-600';
  };

  const chartData = [
    { name: 'Jan', requests: 45, approved: 38 },
    { name: 'Feb', requests: 52, approved: 48 },
    { name: 'Mar', requests: 61, approved: 55 },
    { name: 'Apr', requests: 48, approved: 42 },
    { name: 'May', requests: 70, approved: 65 },
    { name: 'Jun', requests: 58, approved: 52 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">Purchase Request Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-blue-700 rounded-full transition">
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">JD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">My Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.myRequests}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overdueApprovals}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPendingPRs}</p>
              </div>
              <FileText className="h-12 w-12 text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalApprovedAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-80" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Purchase Request Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
                <Bar dataKey="approved" fill="#10b981" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Notifications</h2>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications yet</p>
              ) : (
                notifications.map((notif, index) => (
                  <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-gray-800">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Purchase Requests</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              + New Request
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : purchaseRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No purchase requests found
                    </td>
                  </tr>
                ) : (
                  purchaseRequests.map((pr) => (
                    <tr key={pr.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {pr.requestNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{pr.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pr.status)}`}>
                          {pr.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPriorityColor(pr.priority)}`}>
                        {pr.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${pr.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pr.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-green-600 hover:text-green-900">Approve</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
