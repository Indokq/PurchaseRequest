namespace PRMS.Domain.Entities;

public class User : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    
    public string PasswordHash { get; set; } = string.Empty;
    
    public Guid DepartmentId { get; set; }
    public virtual Department Department { get; set; } = null!;
    
    public string JobTitle { get; set; } = string.Empty;
    public int ApprovalLevel { get; set; }
    public decimal ApprovalLimit { get; set; }
    
    public Guid? ManagerId { get; set; }
    public virtual User? Manager { get; set; }
    
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();
    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();
    
    public string FullName => $"{FirstName} {LastName}";
}
