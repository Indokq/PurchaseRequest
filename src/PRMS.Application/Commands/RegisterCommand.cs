using FluentValidation;
using MediatR;
using PRMS.Domain.Entities;
using PRMS.Domain.Interfaces;
using PRMS.Shared.DTOs;

namespace PRMS.Application.Commands;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string EmployeeId,
    Guid DepartmentId,
    string? Role = "Employee") : IRequest<LoginResponseDto>;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required");

        RuleFor(x => x.EmployeeId)
            .NotEmpty().WithMessage("Employee ID is required");

        RuleFor(x => x.DepartmentId)
            .NotEmpty().WithMessage("Department ID is required");

        RuleFor(x => x.Role)
            .Must(role => role == null || role == "Admin" || role == "Employee")
            .WithMessage("Role must be either 'Admin' or 'Employee'");
    }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, LoginResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public RegisterCommandHandler(
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<LoginResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        var existingUsers = await _unitOfWork.Repository<User>().FindAsync(
            u => u.Email == request.Email,
            cancellationToken);
        
        if (existingUsers.Any())
        {
            throw new InvalidOperationException("Email already registered");
        }

        // Validate department exists
        var department = await _unitOfWork.Repository<Department>().GetByIdAsync(
            request.DepartmentId,
            cancellationToken);
        
        if (department == null)
        {
            throw new InvalidOperationException("Department not found");
        }

        // Hash password
        var passwordHash = _passwordHasher.HashPassword(request.Password);

        // Create new user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            EmployeeId = request.EmployeeId,
            DepartmentId = request.DepartmentId,
            IsActive = true,
            ApprovalLevel = 0,
            ApprovalLimit = 0,
            JobTitle = string.Empty
        };

        // Assign role (default "Employee" or specified role)
        var roleName = request.Role ?? "Employee";
        var roles = await _unitOfWork.Repository<Role>().FindAsync(
            r => r.Name == roleName,
            cancellationToken);
        
        var userRole = roles.FirstOrDefault();
        if (userRole != null)
        {
            user.Roles.Add(userRole);
        }
        else
        {
            throw new InvalidOperationException($"Role '{roleName}' not found in the system");
        }

        await _unitOfWork.Repository<User>().AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Reload user with roles for token generation
        var userWithRoles = await _unitOfWork.Repository<User>()
            .GetByIdWithIncludesAsync(user.Id, new[] { "Roles" }, cancellationToken);

        // Generate JWT token
        var token = _jwtTokenService.GenerateToken(userWithRoles!);
        var expiresAt = DateTime.UtcNow.AddHours(24);

        return new LoginResponseDto(
            Token: token,
            ExpiresAt: expiresAt,
            UserId: user.Id,
            Email: user.Email,
            FullName: user.FullName
        );
    }
}
