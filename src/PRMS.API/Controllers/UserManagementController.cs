using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRMS.Application.Commands;
using PRMS.Application.Queries;
using PRMS.Domain.Entities;
using PRMS.Domain.Interfaces;

namespace PRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UserManagementController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UserManagementController> _logger;

    public UserManagementController(
        IMediator mediator,
        IUnitOfWork unitOfWork,
        ILogger<UserManagementController> logger)
    {
        _mediator = mediator;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        try
        {
            var query = new GetAllUsersQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, new { message = "An error occurred while retrieving users" });
        }
    }

    [HttpPut("users/{id}/role")]
    public async Task<ActionResult> UpdateUserRole(Guid id, [FromBody] UpdateRoleRequest request)
    {
        try
        {
            var command = new UpdateUserRoleCommand(id, request.RoleName);
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = $"User role updated to {request.RoleName}" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to update user role");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user role for user {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while updating user role" });
        }
    }

    [HttpGet("roles")]
    public async Task<ActionResult<List<RoleDto>>> GetAllRoles()
    {
        try
        {
            var roles = await _unitOfWork.Repository<Role>().GetAllAsync();
            var roleDtos = roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description
            }).ToList();

            return Ok(roleDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving roles");
            return StatusCode(500, new { message = "An error occurred while retrieving roles" });
        }
    }
}

public record UpdateRoleRequest(string RoleName);

public class RoleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
