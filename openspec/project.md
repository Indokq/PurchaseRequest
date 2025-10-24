# Project Context

## Purpose

**Purchase Request Management System (PRMS)** is an enterprise-grade purchase request management system that manages the complete lifecycle of purchase requests from creation through multi-level approval workflows to purchase order generation.

### Key Objectives
- Streamline procurement processes with intelligent automation
- Enable multi-level approval workflows with dynamic routing
- Provide real-time visibility into purchase request status
- Track budget utilization and vendor performance
- Maintain comprehensive audit trails for compliance
- Deliver predictive analytics and AI-powered insights

## Tech Stack

### Backend
- **.NET 8** - ASP.NET Core Web API
- **Entity Framework Core 8.0.0** - ORM with SQL Server provider
- **SQL Server 2022** - Primary database (Express/LocalDB for development)
- **MediatR 12.2.0** - CQRS pattern implementation
- **FluentValidation 11.9.0** - Input validation
- **AutoMapper 12.0.1** - Object-object mapping
- **Serilog 3.1.x** - Structured logging (console + file)
- **Swashbuckle.AspNetCore 6.5.0** - OpenAPI/Swagger documentation
- **JWT Bearer Authentication** - Token-based auth
- **SignalR (ASP.NET Core)** - Real-time bidirectional communication (`/hubs/notification`)
- **Dapper 2.1.28** - Micro-ORM for performance-critical queries
- **StackExchange.Redis 2.7.10** - Caching support (prepared, not yet active)
- **BCrypt.Net-Next 4.0.3** - Password hashing service

### Frontend
- **React 18.2** with TypeScript 5.3
- **Vite 5.x** - Build tool and dev server
- **TanStack Query 5.14** (React Query) - Server state management
- **React Router 6.20** - Client-side routing
- **TailwindCSS 3.3** - Utility-first CSS framework
- **Recharts 2.10** - Analytics and visualization
- **Axios 1.6** - HTTP client
- **@microsoft/signalr 8.0** - Real-time client
- **date-fns 3.0** - Date manipulation
- **lucide-react 0.294** - Icon library

### Database
- **SQL Server 2022** - 20+ normalized tables with optimized indexes
- **Entity Framework Core Migrations** - Schema versioning
- **Stored Procedures** - Complex business logic
- **Views** - Reporting and analytics

## Project Conventions

### Code Style

#### C# Backend
- **Naming**:
  - PascalCase for classes, properties, methods, public members
  - camelCase for local variables and private fields
  - Prefix interfaces with `I` (e.g., `IRepository<T>`)
  - Use descriptive names that reveal intent
- **File Organization**:
  - One class per file
  - File name matches class name
  - Organize by feature/layer (Commands, Queries, Entities)
- **Imports**:
  - System namespaces first
  - Third-party libraries second
  - Project namespaces last
  - Alphabetical within each group
- **Formatting**:
  - Use `dotnet format` for consistent style
  - 4-space indentation (no tabs)
  - Opening braces on new line
  - Nullable reference types enabled (`<Nullable>enable</Nullable>`)
- **Error Handling**:
  - Try-catch in command/query handlers
  - Throw custom exceptions for domain errors
  - Global exception middleware in API layer
  - Serilog request logging enabled in `Program.cs`
  - Authorization policies: `AdminOnly`, `AuthenticatedUser`, `EmployeeOrAdmin`

#### TypeScript Frontend
- **Naming**:
  - PascalCase for components, types, interfaces
  - camelCase for functions, variables, props
  - UPPER_CASE for constants
- **File Organization**:
  - Component files use `.tsx` extension
  - Utility/helper files use `.ts` extension
  - Co-locate related components
- **Formatting**:
  - 2-space indentation
  - Use ESLint for linting (script present: `npm run lint`)
  - Prefer arrow functions for components
  - Environment variables via Vite: `VITE_API_BASE_URL` consumed in `frontend/src/api/client.ts`

### Architecture Patterns

#### Clean Architecture (Onion Architecture)
Strict dependency rules enforced:

**PRMS.Domain** (Core Layer)
- Entities, enums, domain interfaces
- No dependencies on other layers
- All entities inherit `BaseEntity` (Guid IDs, timestamps, soft delete, audit)
- Contains domain logic and business rules

**PRMS.Application** (Application Layer)
- CQRS pattern with MediatR
- Commands: Modify state (Create, Update, Approve, Reject)
- Queries: Read state (Get, List, Search)
- Command/Query handlers contain business logic
- Depends only on Domain and Shared layers

**PRMS.Infrastructure** (Infrastructure Layer)
- EF Core implementation (`ApplicationDbContext`)
- Repository and Unit of Work patterns
- External service integrations
- Entity configurations (Fluent API)
- Depends on Domain and Application layers

**PRMS.API** (Presentation Layer)
- ASP.NET Core Web API controllers
- JWT authentication and authorization
- SignalR hubs for real-time features
- Minimal dependencies - dispatches to MediatR
- Swagger/OpenAPI documentation
- CORS policy `AllowAll` in development

**PRMS.Shared** (Shared Layer)
- DTOs for data transfer
- No business logic
- Used by API and Application layers

#### Key Design Patterns

**CQRS (Command Query Responsibility Segregation)**
```csharp
// Commands modify state
public class CreatePurchaseRequestCommand : IRequest<PurchaseRequestDto>

// Queries read state
public class GetPurchaseRequestsQuery : IRequest<List<PurchaseRequestDto>>

// Controllers dispatch via MediatR
var result = await _mediator.Send(new CreatePurchaseRequestCommand { ... });
```

**Repository & Unit of Work**
```csharp
// Generic repository interface
IRepository<T> : IDisposable

// Unit of Work coordinates repositories and transactions
var repo = _unitOfWork.Repository<PurchaseRequest>();
await repo.AddAsync(entity);
await _unitOfWork.SaveChangesAsync();
```

**BaseEntity Pattern**
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }  // Soft delete flag
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
    public byte[] RowVersion { get; set; }  // Concurrency token
}
```

**Soft Delete Implementation**
- All entities have `IsDeleted` flag
- Global query filter in `ApplicationDbContext.OnModelCreating()` (expression-based)
- `SaveChangesAsync` intercepts delete operations
- Physical deletes never occur in production

**Audit Trail**
- Automatic timestamp tracking (CreatedAt, UpdatedAt, DeletedAt)
- User tracking (CreatedBy, UpdatedBy, DeletedBy)
- Populated automatically in `SaveChangesAsync`
- User context via `ICurrentUserService` backed by `IHttpContextAccessor`

### Testing Strategy

#### Test Structure
- **Unit Tests**: Test individual components in isolation
  - Repository tests
  - Command/Query handler tests
  - Domain logic tests
- **Integration Tests**: Test layer interactions
  - API endpoint tests
  - Database integration tests
- **Coverage Goals**: >90% for new features

#### Commands
```bash
# Run all tests
dotnet test

# Run specific test
dotnet test --filter "FullyQualifiedName~TestClassName.TestMethodName"

# Run with coverage
dotnet test /p:CollectCoverage=true
```
Note: Test projects are currently not added under `tests/`. Add xUnit projects with `coverlet.collector` to enable coverage.

#### Testing Principles
- Write tests before fixing bugs (TDD for bug fixes)
- Test edge cases and negative paths
- Use meaningful test names that describe behavior
- Arrange-Act-Assert (AAA) pattern
- Mock external dependencies

### Git Workflow

#### Branching Strategy
- **main**: Production-ready code
- **feature/**: New features (`feature/add-vendor-ratings`)
- **fix/**: Bug fixes (`fix/approval-workflow-bug`)
- **refactor/**: Code improvements (`refactor/repository-pattern`)
- **docs/**: Documentation updates

#### Commit Conventions (Conventional Commits)
Format: `<type>(<scope>): <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat(api): add vendor rating endpoint"
git commit -m "fix(approval): resolve multi-level approval bug"
git commit -m "refactor(domain): extract approval logic to service"
git commit -m "docs(readme): update installation instructions"
```

#### Workflow
1. Create feature branch from main
2. Make small, focused commits
3. Run tests and linting before commit
4. Push to remote
5. Create Pull Request
6. Code review required
7. Merge to main after approval

## Domain Context

### Business Domain: Procurement & Purchase Management

The system manages enterprise procurement workflows from requisition to payment.

#### Core Entities

**PurchaseRequest** (Aggregate Root)
- Request number format: `PR-YYYY-NNNNNN` (e.g., PR-2025-000001)
- Status lifecycle: Draft → Submitted → InApproval → Approved/Rejected → Completed
- Contains multiple line items (PurchaseRequestItems)
- Linked to budget, department, requester
- Tracked through multi-level approvals

**Multi-Level Approval Workflow**
- Automatic routing based on total amount and category:
  - < $5,000: Single approval (Manager)
  - $5,000 - $25,000: Two-level (Manager + Director)
  - > $25,000: Multi-level (Manager + Director + CFO)
- Parallel and sequential approval support
- Smart escalation for delayed approvals
- Approval limits tied to user roles

**Vendor Management**
- 360° vendor profiles with performance tracking
- Rating system (quality, delivery, pricing)
- Contract management with expiration tracking
- Historical price tracking
- Preferred vendor recommendations

**Budget Tracking**
- Real-time budget utilization
- Fields: AllocatedAmount, SpentAmount, CommittedAmount, AvailableAmount
- Department and project-level budgets
- Utilization percentage calculations
- Budget alerts and forecasting

**Product Catalog**
- Master product catalog with categories
- Full-text search capability
- Historical pricing data
- AI-powered product suggestions
- Vendor mappings

#### Business Rules

1. **Request Creation**
   - Requester must belong to a department
   - At least one line item required
   - Budget allocation optional but tracked if provided
   - Total amount auto-calculated from line items

2. **Approval Routing**
   - Determined by total amount and category
   - Cannot approve own requests
   - Approvers must have sufficient approval limit
   - Approval order must be sequential (level 1 before level 2)

3. **Budget Validation**
   - Check available budget before approval
   - Committed amount reserved on approval
   - Spent amount updated on PO creation
   - Budget overage requires special approval

4. **Vendor Selection**
   - Requester can suggest preferred vendor
   - System recommends based on:
     - Past performance ratings
     - Historical pricing
     - Contract availability
     - Delivery time

5. **Status Transitions**
   - Draft → Submitted: Must have items and budget check
   - Submitted → InApproval: Enters approval workflow
   - InApproval → Approved: All approval levels complete
   - InApproval → Rejected: Any approver can reject
   - Approved → Completed: PO created and delivered

#### Terminology
- **PR**: Purchase Request
- **PO**: Purchase Order (created after approval)
- **Requester**: Employee creating the purchase request
- **Approver**: User with authority to approve/reject requests
- **Line Item**: Individual product/service in a request
- **Budget Utilization**: (Spent + Committed) / Allocated * 100
- **Approval Limit**: Maximum amount a user can approve

## Important Constraints

### Technical Constraints
1. **Guid Primary Keys**: All entities use Guid IDs (never int)
2. **UTC Timestamps**: All dates/times stored in UTC (`DateTime.UtcNow`)
3. **Soft Delete Only**: Physical deletes never occur - use `IsDeleted` flag
4. **Concurrency Control**: `RowVersion` byte array for optimistic locking
5. **Nullable Reference Types**: Enabled project-wide (`<Nullable>enable</Nullable>`)
6. **Database**: SQL Server 2022 minimum (LocalDB for development)
7. **Migration Assembly**: Specified in API Program.cs as `PRMS.Infrastructure`

### Business Constraints
1. **Audit Trail**: Every entity change must be audited (who, when)
2. **Approval Authority**: Users cannot approve requests beyond their approval limit
3. **Budget Enforcement**: Cannot exceed allocated budget without special approval
4. **Request Number Uniqueness**: PR numbers must be sequential and unique per year
5. **Status Immutability**: Certain status transitions are irreversible (e.g., Approved cannot go back to Draft)
6. **Vendor Validation**: Only approved/active vendors can be selected

### Security Constraints
1. **JWT Authentication**: All API endpoints require valid JWT tokens
2. **Role-Based Access Control (RBAC)**: Permissions based on user roles
3. **Data Encryption**: Sensitive data must be encrypted at rest
4. **SQL Injection Prevention**: Use parameterized queries only (EF Core, Dapper)
5. **CORS**: Configured as "AllowAll" for development - restrict for production
6. **User Context**: Extract from JWT claims via `ICurrentUserService` (`User.FindFirst("UserId")?.Value`)
7. **Password Hashing**: BCrypt via `BCrypt.Net-Next`

### Performance Constraints
1. **Connection Pooling**: Use EF Core connection pooling
2. **Async/Await**: All I/O operations must be async
3. **Lazy Loading**: Disabled - use explicit Include()
4. **Query Optimization**: Use indexes on frequently queried columns
5. **Caching**: Redis integration prepared but not yet active

### Regulatory/Compliance
1. **Audit Logs**: Complete activity tracking for compliance
2. **Data Retention**: Soft delete ensures records are never lost
3. **Approval Trail**: Full history of who approved/rejected and when
4. **Budget Tracking**: Accurate financial reporting for audits

## External Dependencies

### Database
- **SQL Server 2022** (or Express/LocalDB)
  - Connection string in `appsettings.json`
  - Schema: `docs/DatabaseSchema.sql`
  - Database name: `PurchaseRequestDB`

### Authentication
- **JWT Token System**
  - Configuration: `Jwt.Key`, `Jwt.Issuer`, `Jwt.Audience` in appsettings
  - Token claims: UserId, Username, Roles
  - User Secrets for development (`UserSecretsId` in `src/PRMS.API/PRMS.API.csproj`)

### Real-Time Communication
- **SignalR Hub**: `/hubs/notification`
  - Used for approval notifications
  - Status update broadcasts
  - Connected via `@microsoft/signalr` client in frontend

### Logging
- **Serilog**
  - Console sink (development)
  - File sink: `logs/prms-*.txt` (rolling files)
  - Structured logging with context

### External Services (Ready for Integration)
- **Redis**: Caching infrastructure prepared (StackExchange.Redis installed)
- **Email**: Planned for approval notifications and digests
- **AI/ML Services**: For predictive analytics and recommendations

### Development Tools
- **Visual Studio 2022** or **VS Code**
- **.NET 8 SDK**
- **Node.js 18+** (for frontend)
- **SQL Server Management Studio** (optional)
- **Postman** or **Thunder Client** (API testing)
- **ripgrep (rg)** for fast code/spec search

### API Documentation
- **Swagger/OpenAPI**: Available at API root in development
  - Interactive API testing
  - Auto-generated from controller attributes
  - Includes JWT authentication support

### Deployment Targets
- **IIS**: Windows hosting
- **Azure App Service**: Cloud hosting
- **Docker**: Containerization planned (no Dockerfile currently present)

## Build, Run, and Lint

- Backend (.NET): `dotnet restore`, `dotnet build`, `dotnet run` (from `src/PRMS.API`), `dotnet watch run`
- Tests: `dotnet test`
- Frontend (React): `cd frontend; npm install; npm run dev; npm run build; npm run lint`
- Database Migrations: `dotnet ef migrations add <Name> --project src/PRMS.Infrastructure --startup-project src/PRMS.API`

## Frontend Environment

- `VITE_API_BASE_URL` sets API base URL for the frontend. Defaults to `https://localhost:5001/api` when unset.

## Notable Implementation Details

- Database initializer seeds roles and an admin user on startup (`DbInitializer.InitializeAsync`).
- Migrations assembly is set to `PRMS.Infrastructure` in `Program.cs`.
- Global Serilog request logging (`app.UseSerilogRequestLogging()`), console and rolling file sink (`logs/prms-.txt`).
- RBAC policies define coarse-grained access checks at API level.
