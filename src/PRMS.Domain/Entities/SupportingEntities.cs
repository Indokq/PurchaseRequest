namespace PRMS.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();
}

public class Permission : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Resource { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}

public class Project : BaseEntity
{
    public string ProjectCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid ManagerId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal Budget { get; set; }
    public bool IsActive { get; set; }
    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();
}

public class Contract : BaseEntity
{
    public string ContractNumber { get; set; } = string.Empty;
    public Guid VendorId { get; set; }
    public virtual Vendor Vendor { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal? ContractValue { get; set; }
    public string? Terms { get; set; }
    public bool IsActive { get; set; }
    public DateTime? RenewalDate { get; set; }
}

public class Document : BaseEntity
{
    public Guid PurchaseRequestId { get; set; }
    public virtual PurchaseRequest PurchaseRequest { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Version { get; set; }
}

public class Comment : BaseEntity
{
    public Guid PurchaseRequestId { get; set; }
    public virtual PurchaseRequest PurchaseRequest { get; set; } = null!;
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}

public class AuditLog : BaseEntity
{
    public Guid EntityId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public string? ActionUrl { get; set; }
}

public class Invoice : BaseEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid PurchaseOrderId { get; set; }
    public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? PaidDate { get; set; }
}

public class PriceHistory : BaseEntity
{
    public Guid ProductId { get; set; }
    public virtual Product Product { get; set; } = null!;
    public Guid? VendorId { get; set; }
    public virtual Vendor? Vendor { get; set; }
    public decimal Price { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class VendorPerformance : BaseEntity
{
    public Guid VendorId { get; set; }
    public virtual Vendor Vendor { get; set; } = null!;
    public DateTime EvaluationDate { get; set; }
    public int DeliveryScore { get; set; }
    public int QualityScore { get; set; }
    public int PriceScore { get; set; }
    public int ServiceScore { get; set; }
    public string? Notes { get; set; }
}

public class VendorProduct : BaseEntity
{
    public Guid VendorId { get; set; }
    public virtual Vendor Vendor { get; set; } = null!;
    public Guid ProductId { get; set; }
    public virtual Product Product { get; set; } = null!;
    public string VendorProductCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int LeadTimeDays { get; set; }
    public bool IsPreferred { get; set; }
}
