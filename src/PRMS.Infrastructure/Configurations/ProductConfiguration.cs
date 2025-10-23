using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PRMS.Domain.Entities;

namespace PRMS.Infrastructure.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.ProductCode)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.HasIndex(p => p.ProductCode)
            .IsUnique();
        
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(2000);
        
        builder.Property(p => p.StandardPrice)
            .HasPrecision(18, 2);
        
        builder.Property(p => p.RowVersion)
            .IsRowVersion();
    }
}
