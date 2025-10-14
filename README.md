# 🚀 Purchase Request Management System (PRMS)

[![.NET 8](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-red.svg)](https://www.microsoft.com/sql-server)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, enterprise-grade Purchase Request Management System built with .NET 8, SQL Server, and React. Features real-time notifications, AI-powered insights, comprehensive workflow automation, and advanced analytics.

## ✨ Key Features

### Core Capabilities
- 📝 **Smart Purchase Request Creation** - AI-powered product suggestions and automatic vendor recommendations
- ✅ **Intelligent Approval Workflow** - Dynamic routing, parallel approvals, and smart escalation
- 👥 **Vendor Management Excellence** - 360° vendor profiles with performance tracking
- 📊 **Advanced Analytics** - Real-time dashboards with predictive analytics
- 🔔 **Real-time Notifications** - SignalR-powered instant updates
- 🔒 **Enterprise Security** - JWT authentication, RBAC, and comprehensive audit trails

### Advanced Features
- 🤖 **AI & Machine Learning** - Predictive pricing and anomaly detection
- 📱 **Mobile-First Design** - Progressive Web App with offline capability
- 🔄 **CQRS Pattern** - Optimized read/write operations
- 📈 **Budget Tracking** - Real-time budget utilization and forecasting
- 🎯 **Multi-level Approvals** - Configurable approval hierarchies
- 📄 **Document Management** - Version control and file attachments
- 🔍 **Full-Text Search** - Fast product and vendor search
- 📧 **Email Integration** - Automated notifications and digests

## 🏗️ Architecture

Built with **Clean Architecture** principles:

```
PurchaseRequestSystem/
├── src/
│   ├── PRMS.Domain/          # Core business entities & interfaces
│   ├── PRMS.Application/     # Business logic & use cases (CQRS)
│   ├── PRMS.Infrastructure/  # Data access & external services
│   ├── PRMS.API/            # REST API & SignalR hubs
│   └── PRMS.Shared/         # DTOs & shared contracts
├── frontend/                 # React SPA
├── tests/                    # Unit & integration tests
└── docs/                     # Documentation & SQL scripts
```

### Technology Stack

**Backend:**
- .NET 8 Web API
- Entity Framework Core 8
- SQL Server 2022
- MediatR (CQRS)
- SignalR (Real-time)
- Serilog (Logging)
- JWT Authentication

**Frontend:**
- React 18 with TypeScript
- TanStack Query (React Query)
- Recharts (Analytics)
- TailwindCSS (Styling)
- SignalR Client

**Database:**
- SQL Server 2022
- 20+ normalized tables
- Optimized indexes
- Stored procedures
- Views for reporting

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server 2022](https://www.microsoft.com/sql-server) (or Express/LocalDB)
- [Node.js 18+](https://nodejs.org/) (for frontend)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/PurchaseRequestSystem.git
cd PurchaseRequestSystem
```

#### 2. Database Setup
```bash
# Connect to SQL Server and run the schema script
sqlcmd -S localhost -U sa -P YourPassword123! -i docs/DatabaseSchema.sql

# Or use SQL Server Management Studio to execute the script
```

#### 3. Configure Connection String
Update `appsettings.json` in `PRMS.API`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PurchaseRequestDB;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True;"
  }
}
```

#### 4. Backend Setup
```bash
cd src/PRMS.API
dotnet restore
dotnet ef database update
dotnet run
```

The API will be available at `https://localhost:5001` and Swagger at `https://localhost:5001/swagger`

#### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📊 Database Schema

### Core Tables
- **Users** - Employee profiles with approval limits
- **Departments** - Organizational structure
- **PurchaseRequests** - Main PR records with versioning
- **PurchaseRequestItems** - Line items with specifications
- **Approvals** - Multi-level approval tracking
- **Vendors** - Supplier management with ratings
- **Products** - Master catalog with categories
- **Budgets** - Department/project budget tracking
- **PurchaseOrders** - Approved PR conversions
- **Invoices** - Payment tracking

### Supporting Tables
- **Contracts** - Vendor agreements
- **Documents** - File attachments
- **Comments** - Collaborative discussions
- **AuditLogs** - Complete audit trail
- **Notifications** - Real-time alerts
- **PriceHistory** - Historical pricing
- **VendorPerformance** - Quality metrics

## 🔌 API Endpoints

### Purchase Requests
```http
GET    /api/PurchaseRequest              # List all PRs
GET    /api/PurchaseRequest/{id}         # Get PR by ID
POST   /api/PurchaseRequest              # Create new PR
PUT    /api/PurchaseRequest/{id}         # Update PR
DELETE /api/PurchaseRequest/{id}         # Delete PR
POST   /api/PurchaseRequest/{id}/submit  # Submit for approval
POST   /api/PurchaseRequest/{id}/approve # Approve PR
POST   /api/PurchaseRequest/{id}/reject  # Reject PR
```

### Vendors
```http
GET    /api/Vendor                       # List vendors
GET    /api/Vendor/{id}                  # Get vendor
POST   /api/Vendor                       # Create vendor
PUT    /api/Vendor/{id}                  # Update vendor
DELETE /api/Vendor/{id}                  # Delete vendor
```

### Products
```http
GET    /api/Product                      # List products
GET    /api/Product/{id}                 # Get product
GET    /api/Product/search?query=laptop  # Search products
POST   /api/Product                      # Create product
PUT    /api/Product/{id}                 # Update product
DELETE /api/Product/{id}                 # Delete product
```

## 🎯 Key Features Explained

### 1. Smart Approval Workflow
```csharp
// Automatic approval routing based on amount and category
if (pr.TotalAmount < 5000) {
    // Single approval (Manager)
} else if (pr.TotalAmount < 25000) {
    // Two-level approval (Manager + Director)
} else {
    // Multi-level approval (Manager + Director + CFO)
}
```

### 2. Real-time Notifications
```typescript
// SignalR connection for instant updates
connection.on('ReceiveNotification', (notification) => {
  showToast(notification.title, notification.message);
});
```

### 3. Budget Tracking
```sql
-- Real-time budget utilization
SELECT 
    AllocatedAmount,
    SpentAmount,
    CommittedAmount,
    (AllocatedAmount - SpentAmount - CommittedAmount) AS AvailableAmount,
    CAST((SpentAmount + CommittedAmount) * 100.0 / AllocatedAmount AS DECIMAL(5,2)) AS UtilizationPercentage
FROM Budgets
```

## 📈 Performance Optimizations

- **CQRS Pattern** - Separate read/write models
- **Database Indexes** - Optimized for common queries
- **Lazy Loading** - Efficient data retrieval
- **Caching** - Redis integration ready
- **Async/Await** - Non-blocking operations
- **Connection Pooling** - Efficient DB connections

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control (RBAC)** - Granular permissions
- **Data Encryption** - Sensitive data protection
- **SQL Injection Prevention** - Parameterized queries
- **Audit Logging** - Complete activity tracking
- **CORS Configuration** - Cross-origin security

## 🧪 Testing

```bash
# Run unit tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true
```

## 📦 Deployment

### Using Docker
```bash
docker build -t prms-api .
docker run -p 5001:80 prms-api
```

### Using IIS
1. Publish the API: `dotnet publish -c Release`
2. Copy to IIS wwwroot
3. Configure application pool
4. Set connection strings

### Using Azure
```bash
az webapp create --resource-group PRMS --plan MyAppServicePlan --name prms-api
az webapp deployment source config-zip --resource-group PRMS --name prms-api --src publish.zip
```

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Purchase Request Form
![PR Form](docs/screenshots/pr-form.png)

### Approval Workflow
![Approval](docs/screenshots/approval.png)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Initial work
- **Contributors** - [List of contributors](https://github.com/yourusername/PurchaseRequestSystem/contributors)

## 📞 Support

- 📧 Email: support@prms.com
- 💬 Slack: [Join our workspace](https://prms.slack.com)
- 📚 Documentation: [docs.prms.com](https://docs.prms.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/PurchaseRequestSystem/issues)

## 🗺️ Roadmap

### Phase 1 - Foundation ✅
- [x] Core CRUD operations
- [x] Basic approval workflow
- [x] User authentication
- [x] Database schema

### Phase 2 - Advanced Features (In Progress)
- [x] Real-time notifications
- [x] Multi-level approvals
- [ ] AI-powered recommendations
- [ ] Mobile app

### Phase 3 - Intelligence (Planned)
- [ ] Predictive analytics
- [ ] Blockchain integration
- [ ] IoT integration
- [ ] Advanced reporting

## 🌟 Acknowledgments

- Entity Framework Core team
- SignalR team
- React community
- All contributors

---

**Built with ❤️ using .NET 8 and React**
