using PRMS.Domain.Enums;

namespace PRMS.Domain.Entities;

public class PurchaseOrder : BaseEntity
{
    public string PONumber { get; set; } = string.Empty;
    
    public Guid PurchaseRequestId { get; set; }
    public virtual PurchaseRequest PurchaseRequest { get; set; } = null!;
    
    public Guid VendorId { get; set; }
    public virtual Vendor Vendor { get; set; } = null!;
    
    public DateTime OrderDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    
    public decimal TotalAmount { get; set; }
    public decimal? TaxAmount { get; set; }
    public decimal? ShippingAmount { get; set; }
    public decimal GrandTotal { get; set; }
    
    public string Currency { get; set; } = "USD";
    public PaymentTerm PaymentTerm { get; set; }
    
    public string Status { get; set; } = string.Empty;
    
    public string ShippingAddress { get; set; } = string.Empty;
    public string BillingAddress { get; set; } = string.Empty;
    
    public string? Terms { get; set; }
    public string? Notes { get; set; }
    
    public virtual ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}

public class PurchaseOrderItem : BaseEntity
{
    public Guid PurchaseOrderId { get; set; }
    public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
    
    public int LineNumber { get; set; }
    
    public Guid ProductId { get; set; }
    public virtual Product Product { get; set; } = null!;
    
    public decimal Quantity { get; set; }
    public decimal ReceivedQuantity { get; set; }
    public string Unit { get; set; } = "EA";
    
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    
    public DateTime? ExpectedDate { get; set; }
    public DateTime? ReceivedDate { get; set; }
}
