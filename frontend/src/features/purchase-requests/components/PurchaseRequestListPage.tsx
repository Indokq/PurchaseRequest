import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { usePurchaseRequests } from '../hooks/usePurchaseRequests';
import { Button, Card, Spinner } from '../../../shared/components';
import { StatusBadge } from './StatusBadge';
import type { PurchaseRequestFilters, PurchaseRequestStatus } from '../../../shared/types';
import { format } from 'date-fns';

export function PurchaseRequestListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PurchaseRequestFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: purchaseRequests, isLoading, error } = usePurchaseRequests(filters);

  const handleStatusFilter = (status: PurchaseRequestStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you'd debounce this and add to filters
  };

  const filteredRequests = purchaseRequests?.filter((pr) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pr.requestNumber.toLowerCase().includes(query) ||
      pr.title.toLowerCase().includes(query) ||
      pr.requesterName.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <p className="text-red-600">Error loading purchase requests: {error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all purchase requests
          </p>
        </div>
        <Button
          onClick={() => navigate('/purchase-requests/new')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by number, title, or requester..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as PurchaseRequestStatus | '')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="InApproval">In Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredRequests && filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((pr) => (
                  <tr
                    key={pr.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/purchase-requests/${pr.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {pr.requestNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {pr.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pr.requesterName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pr.departmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={pr.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pr.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(pr.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/purchase-requests/${pr.id}`);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No purchase requests found</p>
            <Button
              onClick={() => navigate('/purchase-requests/new')}
              className="mt-4"
              variant="secondary"
            >
              Create Your First Request
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
