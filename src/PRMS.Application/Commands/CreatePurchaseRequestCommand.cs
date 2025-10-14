using MediatR;
using PRMS.Shared.DTOs;

namespace PRMS.Application.Commands;

public class CreatePurchaseRequestCommand : IRequest<PurchaseRequestDto>
{
    public CreatePurchaseRequestDto PurchaseRequest { get; set; } = null!;
    public Guid RequesterId { get; set; }
}

public class CreatePurchaseRequestCommandHandler : IRequestHandler<CreatePurchaseRequestCommand, PurchaseRequestDto>
{
    private readonly PRMS.Domain.Interfaces.IUnitOfWork _unitOfWork;

    public CreatePurchaseRequestCommandHandler(PRMS.Domain.Interfaces.IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PurchaseRequestDto> Handle(CreatePurchaseRequestCommand request, CancellationToken cancellationToken)
    {
        var pr = new PRMS.Domain.Entities.PurchaseRequest
        {
            RequestNumber = await GenerateRequestNumberAsync(request.PurchaseRequest.DepartmentId),
            RequesterId = request.RequesterId,
            DepartmentId = request.PurchaseRequest.DepartmentId,
            Title = request.PurchaseRequest.Title,
            Description = request.PurchaseRequest.Description,
            Justification = request.PurchaseRequest.Justification,
            Priority = (PRMS.Domain.Enums.PriorityLevel)request.PurchaseRequest.Priority,
            Urgency = (PRMS.Domain.Enums.UrgencyLevel)request.PurchaseRequest.Urgency,
            Status = PRMS.Domain.Enums.PurchaseRequestStatus.Draft,
            RequestDate = DateTime.UtcNow,
            RequiredByDate = request.PurchaseRequest.RequiredByDate,
            BudgetId = request.PurchaseRequest.BudgetId,
            ProjectId = request.PurchaseRequest.ProjectId,
            Currency = "USD"
        };

        decimal totalAmount = 0;
        int lineNumber = 1;

        foreach (var itemDto in request.PurchaseRequest.Items)
        {
            var item = new PRMS.Domain.Entities.PurchaseRequestItem
            {
                LineNumber = lineNumber++,
                ProductId = itemDto.ProductId,
                ItemName = itemDto.ItemName,
                Description = itemDto.Description,
                Specification = itemDto.Specification,
                Quantity = itemDto.Quantity,
                Unit = itemDto.Unit,
                UnitPrice = itemDto.UnitPrice,
                TotalPrice = itemDto.Quantity * itemDto.UnitPrice,
                PreferredVendorId = itemDto.PreferredVendorId
            };

            totalAmount += item.TotalPrice;
            pr.Items.Add(item);
        }

        pr.TotalAmount = totalAmount;

        await _unitOfWork.Repository<PRMS.Domain.Entities.PurchaseRequest>().AddAsync(pr, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new PurchaseRequestDto
        {
            Id = pr.Id,
            RequestNumber = pr.RequestNumber,
            Title = pr.Title,
            Description = pr.Description,
            Status = pr.Status.ToString(),
            Priority = pr.Priority.ToString(),
            TotalAmount = pr.TotalAmount,
            RequestDate = pr.RequestDate
        };
    }

    private async Task<string> GenerateRequestNumberAsync(Guid departmentId)
    {
        var year = DateTime.UtcNow.Year;
        var count = await _unitOfWork.Repository<PRMS.Domain.Entities.PurchaseRequest>()
            .CountAsync(pr => pr.RequestDate.Year == year);
        
        return $"PR-{year}-{(count + 1):D6}";
    }
}
