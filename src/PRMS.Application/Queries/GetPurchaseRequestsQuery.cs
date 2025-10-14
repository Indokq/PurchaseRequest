using MediatR;
using PRMS.Shared.DTOs;

namespace PRMS.Application.Queries;

public class GetPurchaseRequestsQuery : IRequest<List<PurchaseRequestDto>>
{
    public Guid? RequesterId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetPurchaseRequestsQueryHandler : IRequestHandler<GetPurchaseRequestsQuery, List<PurchaseRequestDto>>
{
    private readonly PRMS.Domain.Interfaces.IUnitOfWork _unitOfWork;

    public GetPurchaseRequestsQueryHandler(PRMS.Domain.Interfaces.IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<PurchaseRequestDto>> Handle(GetPurchaseRequestsQuery request, CancellationToken cancellationToken)
    {
        var purchaseRequests = await _unitOfWork.Repository<PRMS.Domain.Entities.PurchaseRequest>().GetAllAsync(cancellationToken);

        var filtered = purchaseRequests.AsEnumerable();

        if (request.RequesterId.HasValue)
            filtered = filtered.Where(pr => pr.RequesterId == request.RequesterId.Value);

        if (!string.IsNullOrEmpty(request.Status))
            filtered = filtered.Where(pr => pr.Status.ToString() == request.Status);

        if (request.FromDate.HasValue)
            filtered = filtered.Where(pr => pr.RequestDate >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            filtered = filtered.Where(pr => pr.RequestDate <= request.ToDate.Value);

        var result = filtered
            .OrderByDescending(pr => pr.RequestDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(pr => new PurchaseRequestDto
            {
                Id = pr.Id,
                RequestNumber = pr.RequestNumber,
                Title = pr.Title,
                Description = pr.Description,
                Status = pr.Status.ToString(),
                Priority = pr.Priority.ToString(),
                Urgency = pr.Urgency.ToString(),
                TotalAmount = pr.TotalAmount,
                Currency = pr.Currency,
                RequestDate = pr.RequestDate,
                RequiredByDate = pr.RequiredByDate,
                CurrentApprovalLevel = pr.CurrentApprovalLevel
            })
            .ToList();

        return result;
    }
}
