using PRMS.Domain.Enums;

namespace PRMS.Domain.Entities;

public class PurchaseRequest : BaseEntity
{
    public string RequestNumber { get; set; } = string.Empty;
    public Guid RequesterId { get; set; }
    public virtual User Requester { get; set; } = null!;
    
    public Guid DepartmentId { get; set; }
    public virtual Department Department { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Justification { get; set; }
    
    public PurchaseRequestStatus Status { get; set; }
    public PriorityLevel Priority { get; set; }
    public UrgencyLevel Urgency { get; set; }
    
    public DateTime RequestDate { get; set; }
    public DateTime? RequiredByDate { get; set; }
    
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    
    public Guid? BudgetId { get; set; }
    public virtual Budget? Budget { get; set; }
    
    public Guid? ProjectId { get; set; }
    public virtual Project? Project { get; set; }
    
    public string? ApprovalWorkflowId { get; set; }
    public int CurrentApprovalLevel { get; set; }
    
    public virtual ICollection<PurchaseRequestItem> Items { get; set; } = new List<PurchaseRequestItem>();
    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();
    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    
    public Guid? PurchaseOrderId { get; set; }
    public virtual PurchaseOrder? PurchaseOrder { get; set; }
    
    public string? RejectionReason { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public DateTime? RejectedDate { get; set; }
    public DateTime? CompletedDate { get; set; }
}
