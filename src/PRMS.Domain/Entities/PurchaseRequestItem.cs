namespace PRMS.Domain.Entities;

public class PurchaseRequestItem : BaseEntity
{
    public Guid PurchaseRequestId { get; set; }
    public virtual PurchaseRequest PurchaseRequest { get; set; } = null!;
    
    public int LineNumber { get; set; }
    
    public Guid? ProductId { get; set; }
    public virtual Product? Product { get; set; }
    
    public string ItemName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Specification { get; set; }
    public string? PartNumber { get; set; }
    
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "EA";
    
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    
    public Guid? PreferredVendorId { get; set; }
    public virtual Vendor? PreferredVendor { get; set; }
    
    public string? AccountCode { get; set; }
    public string? CostCenter { get; set; }
    
    public DateTime? RequiredDate { get; set; }
    
    public string? Notes { get; set; }
}
