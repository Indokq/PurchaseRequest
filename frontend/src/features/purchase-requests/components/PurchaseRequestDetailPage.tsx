import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, Send } from 'lucide-react';
import { usePurchaseRequest, useSubmitPurchaseRequest } from '../hooks/usePurchaseRequests';
import { Button, Card, Spinner } from '../../../shared/components';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { useState } from 'react';
import { ApproveRejectModal } from './ApproveRejectModal';

export function PurchaseRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data: pr, isLoading, error } = usePurchaseRequest(id!);
  const submitMutation = useSubmitPurchaseRequest();

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await submitMutation.mutateAsync(id);
      alert('Purchase request submitted successfully!');
    } catch (err: any) {
      alert(`Failed to submit: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !pr) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <p className="text-red-600">Error loading purchase request</p>
          <Button onClick={() => navigate('/purchase-requests')} className="mt-4">
            Back to List
          </Button>
        </Card>
      </div>
    );
  }

  const canEdit = pr.status === 'Draft';
  const canSubmit = pr.status === 'Draft' && pr.items.length > 0;
  const canApprove = pr.status === 'InApproval';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/purchase-requests')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pr.requestNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">{pr.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/purchase-requests/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {canSubmit && (
            <Button onClick={handleSubmit} loading={submitMutation.isPending}>
              <Send className="w-4 h-4 mr-2" />
              Submit for Approval
            </Button>
          )}
          {canApprove && (
            <>
              <Button
                variant="danger"
                onClick={() => setShowRejectModal(true)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setShowApproveModal(true)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={pr.status} className="mt-1" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ${pr.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requester</p>
                <p className="text-sm text-gray-900 mt-1">{pr.requesterName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-sm text-gray-900 mt-1">{pr.departmentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {format(new Date(pr.requestDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm text-gray-900 mt-1">
                  {format(new Date(pr.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
            {pr.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm text-gray-900 mt-1">{pr.description}</p>
              </div>
            )}
          </Card>

          {/* Line Items */}
          <Card padding="none">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pr.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-500">{item.productCode}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${item.totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Total Amount:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${pr.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Approvals */}
          {pr.approvals && pr.approvals.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h2>
              <div className="space-y-3">
                {pr.approvals.map((approval) => (
                  <div key={approval.id} className="border-l-2 border-gray-300 pl-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Level {approval.approvalLevel}
                      </p>
                      <StatusBadge status={approval.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{approval.approverName}</p>
                    {approval.comments && (
                      <p className="text-xs text-gray-600 mt-1">{approval.comments}</p>
                    )}
                    {approval.approvedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(approval.approvedAt), 'MMM d, yyyy HH:mm')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Audit Trail */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="text-gray-900">{pr.createdBy}</p>
                <p className="text-xs text-gray-400">
                  {format(new Date(pr.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              {pr.updatedAt && (
                <div className="mt-3">
                  <p className="text-gray-500">Last Updated By</p>
                  <p className="text-gray-900">{pr.updatedBy}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(pr.updatedAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <ApproveRejectModal
          type="approve"
          purchaseRequestId={id!}
          onClose={() => setShowApproveModal(false)}
        />
      )}
      {showRejectModal && (
        <ApproveRejectModal
          type="reject"
          purchaseRequestId={id!}
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
}
