using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PRMS.Domain.Interfaces;

namespace PRMS.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId
    {
        get
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;

            return userIdClaim != null && Guid.TryParse(userIdClaim, out var userId)
                ? userId
                : Guid.Empty;
        }
    }

    public string? Email
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User
                .FindFirst(ClaimTypes.Email)?.Value;
        }
    }

    public bool IsAuthenticated
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
        }
    }

    public bool IsAdmin()
    {
        return HasRole("Admin");
    }

    public bool HasRole(string roleName)
    {
        return _httpContextAccessor.HttpContext?.User
            .IsInRole(roleName) ?? false;
    }

    public IEnumerable<string> GetRoles()
    {
        var claims = _httpContextAccessor.HttpContext?.User
            .FindAll(ClaimTypes.Role);

        return claims?.Select(c => c.Value) ?? Enumerable.Empty<string>();
    }
}
