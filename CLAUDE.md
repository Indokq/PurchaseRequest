# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Purchase Request Management System (PRMS) - An enterprise-grade purchase request management system built with .NET 8, SQL Server, and React. The system manages the complete lifecycle of purchase requests from creation through approval workflows to purchase order generation.

## Development Commands

### Backend (.NET API)

```bash
# Restore dependencies
dotnet restore

# Build solution
dotnet build

# Run API (from src/PRMS.API)
cd src/PRMS.API
dotnet run

# Run with watch (hot reload)
dotnet watch run

# Run tests (when test projects exist)
dotnet test

# Run specific test
dotnet test --filter "FullyQualifiedName~TestClassName.TestMethodName"

# Database migrations
dotnet ef migrations add MigrationName --project src/PRMS.Infrastructure --startup-project src/PRMS.API
dotnet ef database update --project src/PRMS.Infrastructure --startup-project src/PRMS.API

# Clean build artifacts
dotnet clean
```

### Frontend (React + Vite)

```bash
# Install dependencies
cd frontend
npm install

# Run dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Setup

```bash
# Using sqlcmd
sqlcmd -S localhost -U sa -P YourPassword123! -i docs/DatabaseSchema.sql

# Or use SQL Server Management Studio to execute docs/DatabaseSchema.sql
```

## Architecture

### Clean Architecture Layers

The solution follows Clean Architecture with strict dependency rules:

1. **PRMS.Domain** (Core Layer)
   - Contains entities, enums, and domain interfaces
   - No dependencies on other layers
   - Entities inherit from `BaseEntity` which provides Id, timestamps, soft delete, and audit fields
   - All entities use Guid primary keys

2. **PRMS.Application** (Application Layer)
   - Implements CQRS pattern using MediatR
   - Commands: CreatePurchaseRequestCommand, ApprovePurchaseRequestCommand, etc.
   - Queries: GetPurchaseRequestsQuery, etc.
   - Command/Query handlers contain business logic
   - Depends only on PRMS.Domain and PRMS.Shared

3. **PRMS.Infrastructure** (Infrastructure Layer)
   - Data access implementation using EF Core
   - ApplicationDbContext: Main DbContext with 20+ DbSets
   - Repository pattern: Generic Repository<T> and UnitOfWork
   - Soft delete implemented via global query filter on BaseEntity.IsDeleted
   - Entity configurations in separate files (e.g., PurchaseRequestConfiguration)
   - Depends on PRMS.Domain

4. **PRMS.Shared** (Shared Layer)
   - DTOs for data transfer between layers
   - No business logic
   - Used by both API and Application layers

5. **PRMS.API** (Presentation Layer)
   - ASP.NET Core Web API
   - Controllers use MediatR to dispatch commands/queries
   - JWT authentication configured
   - SignalR hub for real-time notifications at /hubs/notification
   - Swagger UI at root endpoint in development
   - Serilog logging to console and file (logs/prms-*.txt)

### Key Patterns

**CQRS with MediatR:**
- Commands modify state (CreatePurchaseRequestCommand, ApprovePurchaseRequestCommand)
- Queries read state (GetPurchaseRequestsQuery)
- Each has a corresponding handler (CreatePurchaseRequestCommandHandler)
- Controllers dispatch requests via IMediator.Send()

**Repository & Unit of Work:**
- Generic IRepository<T> interface in PRMS.Domain.Interfaces
- Implementation in PRMS.Infrastructure.Repositories
- IUnitOfWork provides access to repositories and transaction management
- Example: `_unitOfWork.Repository<PurchaseRequest>().AddAsync(entity)`

**Soft Delete:**
- BaseEntity.IsDeleted flag
- Global query filter in ApplicationDbContext.OnModelCreating()
- SaveChangesAsync intercepts delete operations and marks entities as deleted

**Audit Trail:**
- BaseEntity tracks CreatedAt, CreatedBy, UpdatedAt, UpdatedBy, DeletedAt, DeletedBy
- ApplicationDbContext.SaveChangesAsync automatically populates these fields

### Domain Model

**Core Entities:**
- PurchaseRequest: Main aggregate root with Status, Priority, Urgency, TotalAmount
- PurchaseRequestItem: Line items with ProductId, Quantity, UnitPrice
- User: Employee with approval limits and department
- Approval: Multi-level approval tracking (linked to PurchaseRequest)
- Vendor: Supplier with performance ratings
- Product: Master catalog with categories
- Budget: Department/project budget with AllocatedAmount, SpentAmount, CommittedAmount
- PurchaseOrder: Generated from approved purchase requests

**Key Relationships:**
- PurchaseRequest -> User (Requester)
- PurchaseRequest -> Department
- PurchaseRequest -> ICollection<PurchaseRequestItem>
- PurchaseRequest -> ICollection<Approval>
- PurchaseRequest -> Budget (optional)
- PurchaseRequest -> PurchaseOrder (optional, after approval)
- PurchaseRequestItem -> Product
- PurchaseRequestItem -> Vendor (PreferredVendorId)

**Approval Workflow:**
- Multi-level approval based on TotalAmount
- CurrentApprovalLevel tracks progress
- Approvals collection stores each approval step
- Status transitions: Draft -> Submitted -> InApproval -> Approved/Rejected

### Configuration

**appsettings.json (src/PRMS.API):**
- ConnectionStrings.DefaultConnection: SQL Server connection string
- Jwt.Key, Jwt.Issuer, Jwt.Audience: JWT authentication settings
- Serilog: Logging configuration

**Database:**
- SQL Server 2022 (or Express/LocalDB for development)
- Database name: PurchaseRequestDB
- Schema script: docs/DatabaseSchema.sql
- EF Core migrations in PRMS.Infrastructure

### API Structure

Controllers follow standard RESTful patterns:
- GET /api/PurchaseRequest - List with filtering (requesterId, status, dates, pagination)
- GET /api/PurchaseRequest/{id} - Get single
- POST /api/PurchaseRequest - Create new
- PUT /api/PurchaseRequest/{id} - Update existing
- DELETE /api/PurchaseRequest/{id} - Soft delete
- POST /api/PurchaseRequest/{id}/submit - Submit for approval
- POST /api/PurchaseRequest/{id}/approve - Approve request
- POST /api/PurchaseRequest/{id}/reject - Reject request

All endpoints require JWT authentication via [Authorize] attribute.

### Real-time Features

SignalR hub at /hubs/notification enables:
- Real-time approval notifications
- Status update broadcasts
- Connected via @microsoft/signalr client in frontend

### Frontend Stack

- React 18 with TypeScript
- Vite for build tooling
- TanStack Query (React Query) for server state management
- Recharts for analytics dashboards
- TailwindCSS for styling
- SignalR client for real-time updates
- Axios for HTTP requests

## Common Development Scenarios

**Adding a new entity:**
1. Create entity class in PRMS.Domain/Entities inheriting from BaseEntity
2. Add DbSet to ApplicationDbContext
3. Create entity configuration in PRMS.Infrastructure/Configurations if complex mappings needed
4. Create migration: `dotnet ef migrations add AddNewEntity`
5. Update database: `dotnet ef database update`

**Adding a new command/query:**
1. Create command/query class in PRMS.Application/Commands or /Queries
2. Implement IRequest<TResponse>
3. Create handler class implementing IRequestHandler<TRequest, TResponse>
4. Inject IUnitOfWork or other dependencies in handler constructor
5. Add controller endpoint that calls _mediator.Send(command/query)

**Working with repositories:**
- Access via IUnitOfWork: `_unitOfWork.Repository<EntityType>()`
- Always call `_unitOfWork.SaveChangesAsync()` after modifications
- Use transactions for multi-step operations: `BeginTransactionAsync()`, `CommitTransactionAsync()`

**Request number generation:**
- Format: PR-YYYY-NNNNNN (e.g., PR-2025-000001)
- Generated in CreatePurchaseRequestCommandHandler
- Sequential per year

## Important Notes

- All timestamps use UTC (DateTime.UtcNow)
- Soft delete is automatic - use repository.DeleteAsync(), not direct EF delete
- User context currently set to "system" in SaveChangesAsync - should be replaced with actual user
- JWT user ID extracted from claims: `User.FindFirst("UserId")?.Value`
- Migration assembly specified in Program.cs: `b.MigrationsAssembly("PRMS.Infrastructure")`
- CORS configured as "AllowAll" for development - restrict for production
- API runs on https://localhost:5001, Swagger at https://localhost:5001 (development only)
- Frontend dev server runs on http://localhost:5173
