namespace PRMS.Domain.Entities;

public class Budget : BaseEntity
{
    public string BudgetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    
    public Guid DepartmentId { get; set; }
    public virtual Department Department { get; set; } = null!;
    
    public int FiscalYear { get; set; }
    public int? Quarter { get; set; }
    
    public decimal AllocatedAmount { get; set; }
    public decimal SpentAmount { get; set; }
    public decimal CommittedAmount { get; set; }
    public decimal AvailableAmount => AllocatedAmount - SpentAmount - CommittedAmount;
    
    public string Currency { get; set; } = "USD";
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public bool IsActive { get; set; }
    public bool AutoApprove { get; set; }
    
    public decimal? WarningThreshold { get; set; }
    
    public virtual ICollection<BudgetTransaction> Transactions { get; set; } = new List<BudgetTransaction>();
    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();
}

public class BudgetTransaction : BaseEntity
{
    public Guid BudgetId { get; set; }
    public virtual Budget Budget { get; set; } = null!;
    
    public string TransactionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    
    public Guid? ReferenceId { get; set; }
    public string? ReferenceType { get; set; }
    
    public DateTime TransactionDate { get; set; }
}
