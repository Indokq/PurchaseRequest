namespace PRMS.Shared.DTOs;

public record CreateDepartmentDto(
    string Code,
    string Name,
    string? Description,
    bool IsActive
);

public record UpdateDepartmentDto(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    bool IsActive
);

public record DepartmentResponseDto(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt,
    string CreatedBy,
    DateTime? UpdatedAt,
    string? UpdatedBy
);
