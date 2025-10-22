using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PRMS.Domain.Entities;

namespace PRMS.Infrastructure.Configurations;

public class PurchaseRequestConfiguration : IEntityTypeConfiguration<PurchaseRequest>
{
    public void Configure(EntityTypeBuilder<PurchaseRequest> builder)
    {
        builder.ToTable("PurchaseRequests");
        
        builder.HasKey(pr => pr.Id);
        
        builder.Property(pr => pr.RequestNumber)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(pr => pr.RequestNumber)
            .IsUnique();
        
        builder.Property(pr => pr.Title)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(pr => pr.Description)
            .IsRequired()
            .HasMaxLength(2000);
        
        builder.Property(pr => pr.Justification)
            .HasMaxLength(2000);
        
        builder.Property(pr => pr.TotalAmount)
            .HasPrecision(18, 2);
        
        builder.Property(pr => pr.Currency)
            .HasMaxLength(3);
        
        builder.Property(pr => pr.RowVersion)
            .IsRowVersion();
        
        builder.HasOne(pr => pr.Requester)
            .WithMany(u => u.PurchaseRequests)
            .HasForeignKey(pr => pr.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(pr => pr.Department)
            .WithMany(d => d.PurchaseRequests)
            .HasForeignKey(pr => pr.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(pr => pr.Budget)
            .WithMany(b => b.PurchaseRequests)
            .HasForeignKey(pr => pr.BudgetId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.HasOne(pr => pr.Project)
            .WithMany(p => p.PurchaseRequests)
            .HasForeignKey(pr => pr.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.HasOne(pr => pr.PurchaseOrder)
            .WithOne(po => po.PurchaseRequest)
            .HasForeignKey<PurchaseRequest>(pr => pr.PurchaseOrderId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.HasMany(pr => pr.Items)
            .WithOne(pri => pri.PurchaseRequest)
            .HasForeignKey(pri => pri.PurchaseRequestId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(pr => pr.Approvals)
            .WithOne(a => a.PurchaseRequest)
            .HasForeignKey(a => a.PurchaseRequestId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(pr => pr.Documents)
            .WithOne(d => d.PurchaseRequest)
            .HasForeignKey(d => d.PurchaseRequestId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(pr => pr.Comments)
            .WithOne(c => c.PurchaseRequest)
            .HasForeignKey(c => c.PurchaseRequestId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(pr => pr.AuditLogs)
            .WithOne()
            .HasForeignKey("EntityId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.EmployeeId)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(u => u.EmployeeId)
            .IsUnique();
        
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);
        
        builder.HasIndex(u => u.Email)
            .IsUnique();
        
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(u => u.ApprovalLimit)
            .HasPrecision(18, 2);
        
        builder.HasOne(u => u.Department)
            .WithMany(d => d.Users)
            .HasForeignKey(u => u.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(u => u.Manager)
            .WithMany()
            .HasForeignKey(u => u.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity(j => 
            {
                j.ToTable("UserRoles");
                j.Property<Guid>("UserId");
                j.Property<Guid>("RoleId");
                j.HasKey("UserId", "RoleId");
            });
        
        builder.Property(u => u.RowVersion)
            .IsRowVersion();
        
        builder.Ignore(u => u.FullName);
    }
}

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Departments");
        
        builder.HasKey(d => d.Id);
        
        builder.HasOne(d => d.Manager)
            .WithMany()
            .HasForeignKey(d => d.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(d => d.ParentDepartment)
            .WithMany()
            .HasForeignKey(d => d.ParentDepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(d => d.RowVersion)
            .IsRowVersion();
    }
}

public class ApprovalConfiguration : IEntityTypeConfiguration<Approval>
{
    public void Configure(EntityTypeBuilder<Approval> builder)
    {
        builder.ToTable("Approvals");
        
        builder.HasKey(a => a.Id);
        
        builder.HasOne(a => a.Approver)
            .WithMany(u => u.Approvals)
            .HasForeignKey(a => a.ApproverId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(a => a.DelegatedTo)
            .WithMany()
            .HasForeignKey(a => a.DelegatedToId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(a => a.RowVersion)
            .IsRowVersion();
        
        builder.Ignore(a => a.IsOverdue);
    }
}

public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
{
    public void Configure(EntityTypeBuilder<Vendor> builder)
    {
        builder.ToTable("Vendors");
        
        builder.HasKey(v => v.Id);
        
        builder.Property(v => v.VendorCode)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(v => v.VendorCode)
            .IsUnique();
        
        builder.Property(v => v.CompanyName)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(v => v.Email)
            .IsRequired()
            .HasMaxLength(255);
        
        builder.Property(v => v.Rating)
            .HasPrecision(3, 2);
        
        builder.Property(v => v.CreditLimit)
            .HasPrecision(18, 2);
        
        builder.Property(v => v.RowVersion)
            .IsRowVersion();
    }
}
