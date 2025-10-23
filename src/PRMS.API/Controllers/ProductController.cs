using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRMS.Domain.Entities;
using PRMS.Domain.Enums;
using PRMS.Domain.Interfaces;
using PRMS.Shared.DTOs;

namespace PRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<ProductController> _logger;

    public ProductController(
        IUnitOfWork unitOfWork, 
        ICurrentUserService currentUserService,
        ILogger<ProductController> logger)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts([FromQuery] string? category)
    {
        try
        {
            var products = await _unitOfWork.Repository<Product>().GetAllAsync();

            if (!string.IsNullOrEmpty(category))
            {
                products = products.Where(p => p.Category.ToString() == category);
            }

            var response = products.Select(p => new ProductResponseDto(
                p.Id,
                p.ProductCode,
                p.Name,
                p.Description,
                p.Category.ToString(),
                p.SubCategory,
                p.PartNumber,
                p.Manufacturer,
                p.Brand,
                p.Unit,
                p.StandardPrice,
                p.MinOrderQuantity,
                p.MaxOrderQuantity,
                p.LeadTimeDays,
                p.IsActive,
                p.RequiresApproval,
                p.ImageUrl,
                p.Specification,
                p.CreatedAt,
                p.CreatedBy,
                p.UpdatedAt,
                p.UpdatedBy
            ));

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDto>> GetProduct(Guid id)
    {
        try
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null)
                return NotFound();

            var response = new ProductResponseDto(
                product.Id,
                product.ProductCode,
                product.Name,
                product.Description,
                product.Category.ToString(),
                product.SubCategory,
                product.PartNumber,
                product.Manufacturer,
                product.Brand,
                product.Unit,
                product.StandardPrice,
                product.MinOrderQuantity,
                product.MaxOrderQuantity,
                product.LeadTimeDays,
                product.IsActive,
                product.RequiresApproval,
                product.ImageUrl,
                product.Specification,
                product.CreatedAt,
                product.CreatedBy,
                product.UpdatedAt,
                product.UpdatedBy
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Product>>> SearchProducts([FromQuery] string query)
    {
        try
        {
            var products = await _unitOfWork.Repository<Product>()
                .FindAsync(p => p.Name.Contains(query) || p.Description.Contains(query) || p.ProductCode.Contains(query));

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching products");
            return StatusCode(500, "An error occurred while searching products");
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductResponseDto>> CreateProduct([FromBody] CreateProductDto dto)
    {
        try
        {
            if (!Enum.TryParse<ProductCategory>(dto.Category, out var category))
                return BadRequest("Invalid product category");

            var product = new Product
            {
                ProductCode = dto.ProductCode,
                Name = dto.Name,
                Description = dto.Description,
                Category = category,
                SubCategory = dto.SubCategory,
                PartNumber = dto.PartNumber,
                Manufacturer = dto.Manufacturer,
                Brand = dto.Brand,
                Unit = dto.Unit,
                StandardPrice = dto.StandardPrice,
                MinOrderQuantity = dto.MinOrderQuantity,
                MaxOrderQuantity = dto.MaxOrderQuantity,
                LeadTimeDays = dto.LeadTimeDays,
                IsActive = dto.IsActive,
                RequiresApproval = dto.RequiresApproval,
                ImageUrl = dto.ImageUrl,
                Specification = dto.Specification
            };

            await _unitOfWork.Repository<Product>().AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            var response = new ProductResponseDto(
                product.Id,
                product.ProductCode,
                product.Name,
                product.Description,
                product.Category.ToString(),
                product.SubCategory,
                product.PartNumber,
                product.Manufacturer,
                product.Brand,
                product.Unit,
                product.StandardPrice,
                product.MinOrderQuantity,
                product.MaxOrderQuantity,
                product.LeadTimeDays,
                product.IsActive,
                product.RequiresApproval,
                product.ImageUrl,
                product.Specification,
                product.CreatedAt,
                product.CreatedBy,
                product.UpdatedAt,
                product.UpdatedBy
            );

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, "An error occurred while creating the product");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductResponseDto>> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
    {
        try
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");

            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null)
                return NotFound();

            if (!Enum.TryParse<ProductCategory>(dto.Category, out var category))
                return BadRequest("Invalid product category");

            product.ProductCode = dto.ProductCode;
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Category = category;
            product.SubCategory = dto.SubCategory;
            product.PartNumber = dto.PartNumber;
            product.Manufacturer = dto.Manufacturer;
            product.Brand = dto.Brand;
            product.Unit = dto.Unit;
            product.StandardPrice = dto.StandardPrice;
            product.MinOrderQuantity = dto.MinOrderQuantity;
            product.MaxOrderQuantity = dto.MaxOrderQuantity;
            product.LeadTimeDays = dto.LeadTimeDays;
            product.IsActive = dto.IsActive;
            product.RequiresApproval = dto.RequiresApproval;
            product.ImageUrl = dto.ImageUrl;
            product.Specification = dto.Specification;

            await _unitOfWork.Repository<Product>().UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            var response = new ProductResponseDto(
                product.Id,
                product.ProductCode,
                product.Name,
                product.Description,
                product.Category.ToString(),
                product.SubCategory,
                product.PartNumber,
                product.Manufacturer,
                product.Brand,
                product.Unit,
                product.StandardPrice,
                product.MinOrderQuantity,
                product.MaxOrderQuantity,
                product.LeadTimeDays,
                product.IsActive,
                product.RequiresApproval,
                product.ImageUrl,
                product.Specification,
                product.CreatedAt,
                product.CreatedBy,
                product.UpdatedAt,
                product.UpdatedBy
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {Id}", id);
            return StatusCode(500, "An error occurred while updating the product");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteProduct(Guid id)
    {
        try
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null)
                return NotFound();

            await _unitOfWork.Repository<Product>().DeleteAsync(product);
            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {Id}", id);
            return StatusCode(500, "An error occurred while deleting the product");
        }
    }
}
