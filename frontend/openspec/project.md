# Project Context

## Purpose
Modernize the purchasing workflow with a full-stack Purchase Request Management System that centralizes request intake, routing, approvals, budgeting insight, and stakeholder notifications for enterprise procurement teams.

## Tech Stack
- **Frontend:** React 18 with TypeScript, Vite dev/build tooling, Tailwind CSS for styling, React Router, TanStack Query for data caching, Axios for HTTP, SignalR client for real-time updates, and Recharts for analytics visualizations.
- **Backend:** ASP.NET Core 8 Web API, Entity Framework Core with SQL Server, MediatR-powered CQRS command handlers, SignalR hubs, Serilog logging, JWT authentication, BCrypt password hashing, and optional Dapper/Redis references for advanced data access and caching.
- **Tooling:** Node.js/npm for frontend scripts, .NET 8 SDK, ESLint script (configuration pending), and Swagger for API exploration in development.

## Project Conventions

### Code Style
- React components and hooks use TypeScript with strict typing, PascalCase filenames, and functional components; UI styling favors Tailwind utility classes with minimal inline style overrides.
- Shared frontend utilities live alongside features; keep side effects inside `useEffect`, prefer React Query for remote data, and centralize constants near usage.
- C# projects follow file-scoped namespaces, async/await throughout, dependency injection via constructors, PascalCase for types, and camelCase for locals/fields (with underscore prefix avoided).

### Architecture Patterns
- Solution is layered (Domain, Application, Infrastructure, API) following domain-driven design principles.
- Application layer uses MediatR commands/handlers for CQRS-style workflows; controllers remain thin orchestrators.
- Infrastructure provides EF Core DbContext, repository + unit-of-work abstractions, plus JWT/crypto services; SignalR hubs expose real-time notifications consumed by the frontend dashboard.

### Testing Strategy
- Automated test suites are not yet implemented; current validation relies on manual API exercising via Swagger and frontend smoke checks.
- Near-term priority is to introduce xUnit-based backend tests and React Testing Library + Vitest coverage for critical UI flows once core features stabilize.

### Git Workflow
- Default branch is `main`; create short-lived feature branches named `feature/<summary>` or `fix/<summary>` and merge via pull request after review.
- Write imperative, descriptive commit messages (e.g., “Add JWT login command”) and rebase onto `main` before merging to keep history linear.

## Domain Context
- The system manages end-to-end purchase requests: employees submit requests with line items, routing rules collect approvals, finance tracks budgets, and stakeholders receive real-time notifications of status changes.
- Entities include users, departments, purchase requests, approvals, vendors, budgets, contracts, projects, and audit logs; soft deletes ensure historical traceability.

## Important Constraints
- Backend requires SQL Server access; update `ConnectionStrings:DefaultConnection` per environment before running migrations.
- `Jwt:Key` must be supplied via user secrets or environment variables (32+ chars) to enable authentication; never commit secrets.
- Services expect HTTPS (`https://localhost:5001` in dev) with CORS currently wide-open for rapid iteration—tighten origins before production.
- Frontend assumes API base URL `https://localhost:5001/api`; adjust via environment variables when hosting separately.

## External Dependencies
- Microsoft SQL Server instance (`localhost\SQLDEV` in development) for relational storage and EF Core migrations.
- SignalR hub exposed at `/hubs/notification` for pushing live activity updates to the React dashboard.
- No third-party SaaS integrations yet; future caching/queuing may leverage Redis as referenced in Infrastructure dependencies.
