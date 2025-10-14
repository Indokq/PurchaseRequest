using PRMS.Domain.Enums;

namespace PRMS.Domain.Entities;

public class Vendor : BaseEntity
{
    public string VendorCode { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? LegalName { get; set; }
    public string? TaxId { get; set; }
    
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Website { get; set; }
    
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string Country { get; set; } = string.Empty;
    
    public VendorStatus Status { get; set; }
    public PaymentTerm DefaultPaymentTerm { get; set; }
    
    public decimal? CreditLimit { get; set; }
    public string Currency { get; set; } = "USD";
    
    public decimal Rating { get; set; }
    public int DeliveryScore { get; set; }
    public int QualityScore { get; set; }
    public int PriceScore { get; set; }
    
    public DateTime? CertifiedDate { get; set; }
    public DateTime? LastAuditDate { get; set; }
    
    public bool IsPreferred { get; set; }
    public string? Notes { get; set; }
    
    public virtual ICollection<Contract> Contracts { get; set; } = new List<Contract>();
    public virtual ICollection<VendorPerformance> PerformanceRecords { get; set; } = new List<VendorPerformance>();
    public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
}
