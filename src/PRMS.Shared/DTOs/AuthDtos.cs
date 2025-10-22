namespace PRMS.Shared.DTOs;

public record LoginRequestDto(
    string Email,
    string Password
);

public record RegisterRequestDto(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string EmployeeId,
    Guid DepartmentId,
    string? Role = "Employee"
);

public record LoginResponseDto(
    string Token,
    DateTime ExpiresAt,
    Guid UserId,
    string Email,
    string FullName
);
