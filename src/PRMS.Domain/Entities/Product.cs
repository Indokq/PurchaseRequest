using PRMS.Domain.Enums;

namespace PRMS.Domain.Entities;

public class Product : BaseEntity
{
    public string ProductCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public ProductCategory Category { get; set; }
    public string? SubCategory { get; set; }
    
    public string? PartNumber { get; set; }
    public string? Manufacturer { get; set; }
    public string? Brand { get; set; }
    
    public string Unit { get; set; } = "EA";
    public decimal? StandardPrice { get; set; }
    
    public int? MinOrderQuantity { get; set; }
    public int? MaxOrderQuantity { get; set; }
    public int? LeadTimeDays { get; set; }
    
    public bool IsActive { get; set; }
    public bool RequiresApproval { get; set; }
    
    public string? ImageUrl { get; set; }
    public string? Specification { get; set; }
    
    public virtual ICollection<PriceHistory> PriceHistory { get; set; } = new List<PriceHistory>();
    public virtual ICollection<VendorProduct> VendorProducts { get; set; } = new List<VendorProduct>();
}
