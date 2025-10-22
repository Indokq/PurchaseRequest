using MediatR;
using PRMS.Domain.Entities;
using PRMS.Domain.Interfaces;

namespace PRMS.Application.Queries;

public class GetAllUsersQuery : IRequest<List<UserDto>>
{
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; } = new();
}

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllUsersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _unitOfWork.Repository<User>().GetAllAsync(cancellationToken);
        
        var userDtos = new List<UserDto>();
        
        foreach (var user in users)
        {
            var department = await _unitOfWork.Repository<Department>()
                .GetByIdAsync(user.DepartmentId, cancellationToken);
            
            userDtos.Add(new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmployeeId = user.EmployeeId,
                FullName = user.FullName,
                DepartmentName = department?.Name ?? "N/A",
                IsActive = user.IsActive,
                Roles = user.Roles.Select(r => r.Name).ToList()
            });
        }
        
        return userDtos;
    }
}
