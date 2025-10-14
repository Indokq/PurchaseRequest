namespace PRMS.Shared.DTOs;

public class PurchaseRequestDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Justification { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Urgency { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public DateTime? RequiredByDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public int CurrentApprovalLevel { get; set; }
    public List<PurchaseRequestItemDto> Items { get; set; } = new();
    public List<ApprovalDto> Approvals { get; set; } = new();
}

public class PurchaseRequestItemDto
{
    public Guid Id { get; set; }
    public int LineNumber { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "EA";
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? PreferredVendorName { get; set; }
    public DateTime? RequiredDate { get; set; }
}

public class ApprovalDto
{
    public Guid Id { get; set; }
    public int Level { get; set; }
    public string ApproverName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? ApprovedAt { get; set; }
    public string? Comments { get; set; }
    public DateTime DueDate { get; set; }
    public bool IsOverdue { get; set; }
}

public class CreatePurchaseRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Justification { get; set; }
    public int Priority { get; set; }
    public int Urgency { get; set; }
    public DateTime? RequiredByDate { get; set; }
    public Guid DepartmentId { get; set; }
    public Guid? BudgetId { get; set; }
    public Guid? ProjectId { get; set; }
    public List<CreatePurchaseRequestItemDto> Items { get; set; } = new();
}

public class CreatePurchaseRequestItemDto
{
    public Guid? ProductId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Specification { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "EA";
    public decimal UnitPrice { get; set; }
    public Guid? PreferredVendorId { get; set; }
}

public class UpdatePurchaseRequestDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Justification { get; set; }
    public int Priority { get; set; }
    public DateTime? RequiredByDate { get; set; }
}
