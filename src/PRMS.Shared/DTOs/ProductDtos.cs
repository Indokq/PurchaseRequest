namespace PRMS.Shared.DTOs;

public record CreateProductDto(
    string ProductCode,
    string Name,
    string Description,
    string Category,
    string? SubCategory,
    string? PartNumber,
    string? Manufacturer,
    string? Brand,
    string Unit,
    decimal? StandardPrice,
    int? MinOrderQuantity,
    int? MaxOrderQuantity,
    int? LeadTimeDays,
    bool IsActive,
    bool RequiresApproval,
    string? ImageUrl,
    string? Specification
);

public record UpdateProductDto(
    Guid Id,
    string ProductCode,
    string Name,
    string Description,
    string Category,
    string? SubCategory,
    string? PartNumber,
    string? Manufacturer,
    string? Brand,
    string Unit,
    decimal? StandardPrice,
    int? MinOrderQuantity,
    int? MaxOrderQuantity,
    int? LeadTimeDays,
    bool IsActive,
    bool RequiresApproval,
    string? ImageUrl,
    string? Specification
);

public record ProductResponseDto(
    Guid Id,
    string ProductCode,
    string Name,
    string Description,
    string Category,
    string? SubCategory,
    string? PartNumber,
    string? Manufacturer,
    string? Brand,
    string Unit,
    decimal? StandardPrice,
    int? MinOrderQuantity,
    int? MaxOrderQuantity,
    int? LeadTimeDays,
    bool IsActive,
    bool RequiresApproval,
    string? ImageUrl,
    string? Specification,
    DateTime CreatedAt,
    string CreatedBy,
    DateTime? UpdatedAt,
    string? UpdatedBy
);
