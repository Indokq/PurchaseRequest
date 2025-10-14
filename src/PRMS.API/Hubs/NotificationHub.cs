using Microsoft.AspNetCore.SignalR;

namespace PRMS.API.Hubs;

public class NotificationHub : Hub
{
    public async Task SendNotification(string userId, string title, string message, string type)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", new
        {
            title,
            message,
            type,
            timestamp = DateTime.UtcNow
        });
    }

    public async Task SendApprovalNotification(string userId, string requestNumber, string requesterName)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", new
        {
            title = "New Approval Request",
            message = $"Purchase Request {requestNumber} from {requesterName} requires your approval",
            type = "approval",
            timestamp = DateTime.UtcNow
        });
    }

    public async Task SendStatusUpdate(string userId, string requestNumber, string status)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", new
        {
            title = "Status Update",
            message = $"Purchase Request {requestNumber} status changed to {status}",
            type = "status",
            timestamp = DateTime.UtcNow
        });
    }

    public async Task NotifyGroup(string groupName, string title, string message)
    {
        await Clients.Group(groupName).SendAsync("ReceiveNotification", new
        {
            title,
            message,
            type = "group",
            timestamp = DateTime.UtcNow
        });
    }

    public async Task JoinDepartmentGroup(string departmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"department_{departmentId}");
    }

    public async Task LeaveDepartmentGroup(string departmentId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"department_{departmentId}");
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("UserId")?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("UserId")?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnDisconnectedAsync(exception);
    }
}
