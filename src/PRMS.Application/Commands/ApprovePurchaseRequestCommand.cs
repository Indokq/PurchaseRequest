using MediatR;

namespace PRMS.Application.Commands;

public class ApprovePurchaseRequestCommand : IRequest<bool>
{
    public Guid PurchaseRequestId { get; set; }
    public Guid ApproverId { get; set; }
    public string? Comments { get; set; }
}

public class ApprovePurchaseRequestCommandHandler : IRequestHandler<ApprovePurchaseRequestCommand, bool>
{
    private readonly PRMS.Domain.Interfaces.IUnitOfWork _unitOfWork;

    public ApprovePurchaseRequestCommandHandler(PRMS.Domain.Interfaces.IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(ApprovePurchaseRequestCommand request, CancellationToken cancellationToken)
    {
        var approval = (await _unitOfWork.Repository<PRMS.Domain.Entities.Approval>()
            .FindAsync(a => a.PurchaseRequestId == request.PurchaseRequestId 
                         && a.ApproverId == request.ApproverId 
                         && a.Status == PRMS.Domain.Enums.ApprovalStatus.Pending, cancellationToken))
            .FirstOrDefault();

        if (approval == null)
            return false;

        approval.Status = PRMS.Domain.Enums.ApprovalStatus.Approved;
        approval.ApprovedAt = DateTime.UtcNow;
        approval.Comments = request.Comments;

        await _unitOfWork.Repository<PRMS.Domain.Entities.Approval>().UpdateAsync(approval, cancellationToken);

        var pr = await _unitOfWork.Repository<PRMS.Domain.Entities.PurchaseRequest>()
            .GetByIdAsync(request.PurchaseRequestId, cancellationToken);

        if (pr != null)
        {
            var allApprovals = await _unitOfWork.Repository<PRMS.Domain.Entities.Approval>()
                .FindAsync(a => a.PurchaseRequestId == request.PurchaseRequestId, cancellationToken);

            if (allApprovals.All(a => a.Status == PRMS.Domain.Enums.ApprovalStatus.Approved))
            {
                pr.Status = PRMS.Domain.Enums.PurchaseRequestStatus.Approved;
                pr.ApprovedDate = DateTime.UtcNow;
                await _unitOfWork.Repository<PRMS.Domain.Entities.PurchaseRequest>().UpdateAsync(pr, cancellationToken);
            }
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
