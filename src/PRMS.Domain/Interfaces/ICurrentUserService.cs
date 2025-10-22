namespace PRMS.Domain.Interfaces;

public interface ICurrentUserService
{
    Guid UserId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin();
    bool HasRole(string roleName);
    IEnumerable<string> GetRoles();
}
