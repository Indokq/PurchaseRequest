using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRMS.Domain.Entities;
using PRMS.Domain.Interfaces;

namespace PRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VendorController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<VendorController> _logger;

    public VendorController(IUnitOfWork unitOfWork, ILogger<VendorController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vendor>>> GetVendors()
    {
        try
        {
            var vendors = await _unitOfWork.Repository<Vendor>().GetAllAsync();
            return Ok(vendors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving vendors");
            return StatusCode(500, "An error occurred while retrieving vendors");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vendor>> GetVendor(Guid id)
    {
        try
        {
            var vendor = await _unitOfWork.Repository<Vendor>().GetByIdAsync(id);
            if (vendor == null)
                return NotFound();

            return Ok(vendor);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving vendor {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the vendor");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Vendor>> CreateVendor([FromBody] Vendor vendor)
    {
        try
        {
            await _unitOfWork.Repository<Vendor>().AddAsync(vendor);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVendor), new { id = vendor.Id }, vendor);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating vendor");
            return StatusCode(500, "An error occurred while creating the vendor");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateVendor(Guid id, [FromBody] Vendor vendor)
    {
        try
        {
            if (id != vendor.Id)
                return BadRequest("ID mismatch");

            await _unitOfWork.Repository<Vendor>().UpdateAsync(vendor);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating vendor {Id}", id);
            return StatusCode(500, "An error occurred while updating the vendor");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteVendor(Guid id)
    {
        try
        {
            var vendor = await _unitOfWork.Repository<Vendor>().GetByIdAsync(id);
            if (vendor == null)
                return NotFound();

            await _unitOfWork.Repository<Vendor>().DeleteAsync(vendor);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting vendor {Id}", id);
            return StatusCode(500, "An error occurred while deleting the vendor");
        }
    }
}
