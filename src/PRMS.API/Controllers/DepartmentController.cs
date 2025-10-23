using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PRMS.Domain.Entities;
using PRMS.Domain.Interfaces;
using PRMS.Shared.DTOs;

namespace PRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<DepartmentController> _logger;

    public DepartmentController(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        ILogger<DepartmentController> logger)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepartmentResponseDto>>> GetDepartments()
    {
        try
        {
            var departments = await _unitOfWork.Repository<Department>().GetAllAsync();

            var response = departments.Select(d => new DepartmentResponseDto(
                d.Id,
                d.Code,
                d.Name,
                d.Description,
                d.IsActive,
                d.CreatedAt,
                d.CreatedBy,
                d.UpdatedAt,
                d.UpdatedBy
            ));

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving departments");
            return StatusCode(500, "An error occurred while retrieving departments");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentResponseDto>> GetDepartment(Guid id)
    {
        try
        {
            var department = await _unitOfWork.Repository<Department>().GetByIdAsync(id);
            
            if (department == null)
                return NotFound();

            var response = new DepartmentResponseDto(
                department.Id,
                department.Code,
                department.Name,
                department.Description,
                department.IsActive,
                department.CreatedAt,
                department.CreatedBy,
                department.UpdatedAt,
                department.UpdatedBy
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving department {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the department");
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DepartmentResponseDto>> CreateDepartment([FromBody] CreateDepartmentDto dto)
    {
        try
        {
            // Check if code already exists
            var exists = await _unitOfWork.Repository<Department>()
                .ExistsAsync(d => d.Code == dto.Code);
            
            if (exists)
                return BadRequest("Department code already exists");

            var department = new Department
            {
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                IsActive = dto.IsActive
            };

            await _unitOfWork.Repository<Department>().AddAsync(department);
            await _unitOfWork.SaveChangesAsync();

            // Reload department
            department = await _unitOfWork.Repository<Department>().GetByIdAsync(department.Id);

            var response = new DepartmentResponseDto(
                department!.Id,
                department.Code,
                department.Name,
                department.Description,
                department.IsActive,
                department.CreatedAt,
                department.CreatedBy,
                department.UpdatedAt,
                department.UpdatedBy
            );

            return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating department");
            return StatusCode(500, "An error occurred while creating the department");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<DepartmentResponseDto>> UpdateDepartment(Guid id, [FromBody] UpdateDepartmentDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");

            var department = await _unitOfWork.Repository<Department>().GetByIdAsync(id);
            if (department == null)
                return NotFound();

            // Check if code already exists (excluding current department)
            var exists = await _unitOfWork.Repository<Department>()
                .ExistsAsync(d => d.Code == dto.Code && d.Id != id);
            
            if (exists)
                return BadRequest("Department code already exists");

            department.Code = dto.Code;
            department.Name = dto.Name;
            department.Description = dto.Description;
            department.IsActive = dto.IsActive;

            await _unitOfWork.Repository<Department>().UpdateAsync(department);
            await _unitOfWork.SaveChangesAsync();

            // Reload department
            department = await _unitOfWork.Repository<Department>().GetByIdAsync(department.Id);

            var response = new DepartmentResponseDto(
                department!.Id,
                department.Code,
                department.Name,
                department.Description,
                department.IsActive,
                department.CreatedAt,
                department.CreatedBy,
                department.UpdatedAt,
                department.UpdatedBy
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating department {Id}", id);
            return StatusCode(500, "An error occurred while updating the department");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteDepartment(Guid id)
    {
        try
        {
            var department = await _unitOfWork.Repository<Department>().GetByIdAsync(id);
            if (department == null)
                return NotFound();

            // Check if department has users
            var hasUsers = await _unitOfWork.Repository<User>()
                .ExistsAsync(u => u.DepartmentId == id);
            
            if (hasUsers)
                return BadRequest("Cannot delete department with assigned users");

            await _unitOfWork.Repository<Department>().DeleteAsync(department);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting department {Id}", id);
            return StatusCode(500, "An error occurred while deleting the department");
        }
    }
}
