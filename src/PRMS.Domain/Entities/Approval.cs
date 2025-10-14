using PRMS.Domain.Enums;

namespace PRMS.Domain.Entities;

public class Approval : BaseEntity
{
    public Guid PurchaseRequestId { get; set; }
    public virtual PurchaseRequest PurchaseRequest { get; set; } = null!;
    
    public int Level { get; set; }
    public int Sequence { get; set; }
    
    public Guid ApproverId { get; set; }
    public virtual User Approver { get; set; } = null!;
    
    public ApprovalStatus Status { get; set; }
    public ApprovalLevel ApprovalLevel { get; set; }
    
    public DateTime? ApprovedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    
    public string? Comments { get; set; }
    public string? RejectionReason { get; set; }
    
    public Guid? DelegatedToId { get; set; }
    public virtual User? DelegatedTo { get; set; }
    
    public DateTime? DelegatedAt { get; set; }
    public DateTime? EscalatedAt { get; set; }
    
    public DateTime DueDate { get; set; }
    public bool IsOverdue => Status == ApprovalStatus.Pending && DateTime.UtcNow > DueDate;
    
    public string? SignatureData { get; set; }
    public string? IpAddress { get; set; }
    public string? DeviceInfo { get; set; }
}
