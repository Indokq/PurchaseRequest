namespace PRMS.Domain.Entities;

public class Department : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public Guid? ParentDepartmentId { get; set; }
    public virtual Department? ParentDepartment { get; set; }
    
    public Guid? ManagerId { get; set; }
    public virtual User? Manager { get; set; }
    
    public string? CostCenter { get; set; }
    public bool IsActive { get; set; }
    
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();
}
