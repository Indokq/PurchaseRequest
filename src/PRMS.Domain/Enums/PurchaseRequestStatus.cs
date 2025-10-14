namespace PRMS.Domain.Enums;

public enum PurchaseRequestStatus
{
    Draft = 0,
    Submitted = 1,
    PendingApproval = 2,
    PartiallyApproved = 3,
    Approved = 4,
    Rejected = 5,
    OnHold = 6,
    Cancelled = 7,
    ConvertedToPO = 8,
    Completed = 9
}

public enum ApprovalStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Delegated = 3,
    Escalated = 4
}

public enum PriorityLevel
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3,
    Emergency = 4
}

public enum UrgencyLevel
{
    Standard = 0,
    Urgent = 1,
    Rush = 2,
    Emergency = 3
}

public enum ApprovalLevel
{
    Supervisor = 1,
    Manager = 2,
    Director = 3,
    VP = 4,
    CFO = 5,
    CEO = 6
}

public enum VendorStatus
{
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Blacklisted = 3,
    UnderReview = 4
}

public enum PaymentTerm
{
    Net15 = 15,
    Net30 = 30,
    Net45 = 45,
    Net60 = 60,
    Net90 = 90,
    COD = 0,
    Prepaid = -1
}

public enum ProductCategory
{
    Electronics = 1,
    OfficeSupplies = 2,
    Furniture = 3,
    Software = 4,
    Hardware = 5,
    Services = 6,
    Consulting = 7,
    Marketing = 8,
    Travel = 9,
    Utilities = 10,
    Maintenance = 11,
    RawMaterials = 12,
    Other = 99
}
