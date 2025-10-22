using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRMS.Application.Commands;
using PRMS.Application.Queries;
using PRMS.Shared.DTOs;

namespace PRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PurchaseRequestController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PurchaseRequestController> _logger;

    public PurchaseRequestController(IMediator mediator, ILogger<PurchaseRequestController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<PurchaseRequestDto>>> GetPurchaseRequests(
        [FromQuery] Guid? requesterId,
        [FromQuery] string? status,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetPurchaseRequestsQuery
            {
                RequesterId = requesterId,
                Status = status,
                FromDate = fromDate,
                ToDate = toDate,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving purchase requests");
            return StatusCode(500, "An error occurred while retrieving purchase requests");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseRequestDto>> GetPurchaseRequest(Guid id)
    {
        try
        {
            var query = new GetPurchaseRequestByIdQuery { Id = id };
            var result = await _mediator.Send(query);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving purchase request {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the purchase request");
        }
    }

    [HttpPost]
    public async Task<ActionResult<PurchaseRequestDto>> CreatePurchaseRequest(
        [FromBody] CreatePurchaseRequestDto request)
    {
        try
        {
            var command = new CreatePurchaseRequestCommand
            {
                PurchaseRequest = request,
                RequesterId = Guid.Parse(User.FindFirst("UserId")?.Value ?? Guid.Empty.ToString())
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetPurchaseRequest), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating purchase request");
            return StatusCode(500, "An error occurred while creating the purchase request");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatePurchaseRequest(Guid id, [FromBody] UpdatePurchaseRequestDto request)
    {
        try
        {
            if (id != request.Id)
                return BadRequest("ID mismatch");

            var command = new UpdatePurchaseRequestCommand { PurchaseRequest = request };
            var result = await _mediator.Send(command);

            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating purchase request {Id}", id);
            return StatusCode(500, "An error occurred while updating the purchase request");
        }
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult> SubmitPurchaseRequest(Guid id)
    {
        try
        {
            var command = new SubmitPurchaseRequestCommand { PurchaseRequestId = id };
            var result = await _mediator.Send(command);

            if (!result)
                return NotFound();

            return Ok(new { message = "Purchase request submitted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting purchase request {Id}", id);
            return StatusCode(500, "An error occurred while submitting the purchase request");
        }
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ApprovePurchaseRequest(Guid id, [FromBody] string? comments)
    {
        try
        {
            var command = new ApprovePurchaseRequestCommand
            {
                PurchaseRequestId = id,
                ApproverId = Guid.Parse(User.FindFirst("UserId")?.Value ?? Guid.Empty.ToString()),
                Comments = comments
            };

            var result = await _mediator.Send(command);

            if (!result)
                return NotFound();

            return Ok(new { message = "Purchase request approved successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving purchase request {Id}", id);
            return StatusCode(500, "An error occurred while approving the purchase request");
        }
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RejectPurchaseRequest(Guid id, [FromBody] string reason)
    {
        try
        {
            var command = new RejectPurchaseRequestCommand
            {
                PurchaseRequestId = id,
                ApproverId = Guid.Parse(User.FindFirst("UserId")?.Value ?? Guid.Empty.ToString()),
                RejectionReason = reason
            };

            var result = await _mediator.Send(command);

            if (!result)
                return NotFound();

            return Ok(new { message = "Purchase request rejected" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting purchase request {Id}", id);
            return StatusCode(500, "An error occurred while rejecting the purchase request");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeletePurchaseRequest(Guid id)
    {
        try
        {
            var command = new DeletePurchaseRequestCommand { PurchaseRequestId = id };
            var result = await _mediator.Send(command);

            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting purchase request {Id}", id);
            return StatusCode(500, "An error occurred while deleting the purchase request");
        }
    }
}

public class GetPurchaseRequestByIdQuery : IRequest<PurchaseRequestDto>
{
    public Guid Id { get; set; }
}

public class UpdatePurchaseRequestCommand : IRequest<bool>
{
    public UpdatePurchaseRequestDto PurchaseRequest { get; set; } = null!;
}

public class SubmitPurchaseRequestCommand : IRequest<bool>
{
    public Guid PurchaseRequestId { get; set; }
}

public class RejectPurchaseRequestCommand : IRequest<bool>
{
    public Guid PurchaseRequestId { get; set; }
    public Guid ApproverId { get; set; }
    public string RejectionReason { get; set; } = string.Empty;
}

public class DeletePurchaseRequestCommand : IRequest<bool>
{
    public Guid PurchaseRequestId { get; set; }
}
