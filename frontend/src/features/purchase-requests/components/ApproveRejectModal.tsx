import { useState } from 'react';
import { useApprovePurchaseRequest, useRejectPurchaseRequest } from '../hooks/usePurchaseRequests';
import { Modal, Button, TextArea } from '../../../shared/components';

interface ApproveRejectModalProps {
  type: 'approve' | 'reject';
  purchaseRequestId: string;
  onClose: () => void;
}

export function ApproveRejectModal({ type, purchaseRequestId, onClose }: ApproveRejectModalProps) {
  const [comments, setComments] = useState('');
  const approveMutation = useApprovePurchaseRequest();
  const rejectMutation = useRejectPurchaseRequest();

  const isApprove = type === 'approve';
  const mutation = isApprove ? approveMutation : rejectMutation;

  const handleSubmit = async () => {
    try {
      if (isApprove) {
        await approveMutation.mutateAsync({ id: purchaseRequestId, comments });
        alert('Purchase request approved successfully!');
      } else {
        if (!comments.trim()) {
          alert('Rejection reason is required');
          return;
        }
        await rejectMutation.mutateAsync({ id: purchaseRequestId, reason: comments });
        alert('Purchase request rejected');
      }
      onClose();
    } catch (err: any) {
      alert(`Failed to ${isApprove ? 'approve' : 'reject'}: ${err.message}`);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isApprove ? 'Approve Purchase Request' : 'Reject Purchase Request'}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? 'primary' : 'danger'}
            onClick={handleSubmit}
            loading={mutation.isPending}
          >
            {isApprove ? 'Approve' : 'Reject'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {isApprove
            ? 'You are about to approve this purchase request. You can optionally add comments.'
            : 'You are about to reject this purchase request. Please provide a reason for rejection.'}
        </p>
        <TextArea
          label={isApprove ? 'Comments (Optional)' : 'Rejection Reason'}
          required={!isApprove}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder={
            isApprove
              ? 'Add any comments about this approval...'
              : 'Explain why this request is being rejected...'
          }
          rows={4}
        />
      </div>
    </Modal>
  );
}
