using System.Security.Claims;
using PRMS.Domain.Entities;

namespace PRMS.Domain.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    ClaimsPrincipal ValidateToken(string token);
    Guid GetUserIdFromToken(string token);
}
