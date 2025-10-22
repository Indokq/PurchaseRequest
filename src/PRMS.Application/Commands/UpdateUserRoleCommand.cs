using FluentValidation;
using MediatR;
using PRMS.Domain.Entities;
using PRMS.Domain.Interfaces;

namespace PRMS.Application.Commands;

public record UpdateUserRoleCommand(
    Guid UserId,
    string RoleName) : IRequest<bool>;

public class UpdateUserRoleCommandValidator : AbstractValidator<UpdateUserRoleCommand>
{
    public UpdateUserRoleCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.RoleName)
            .NotEmpty().WithMessage("Role name is required")
            .Must(role => role == "Admin" || role == "Employee")
            .WithMessage("Role must be either 'Admin' or 'Employee'");
    }
}

public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateUserRoleCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Repository<User>().GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            return false;
        }

        // Find the new role
        var newRoles = await _unitOfWork.Repository<Role>().FindAsync(
            r => r.Name == request.RoleName,
            cancellationToken);
        
        var newRole = newRoles.FirstOrDefault();
        if (newRole == null)
        {
            throw new InvalidOperationException($"Role '{request.RoleName}' not found");
        }

        // Clear existing roles and add new role
        user.Roles.Clear();
        user.Roles.Add(newRole);

        await _unitOfWork.Repository<User>().UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
