<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS.md

## Build/Lint/Test Commands
- **Backend (.NET)**: `dotnet restore`, `dotnet build`, `dotnet run` (from src/PRMS.API), `dotnet watch run`
- **Run tests**: `dotnet test`
- **Run single test**: `dotnet test --filter "FullyQualifiedName~TestClassName.TestMethodName"`
- **Frontend (React)**: `cd frontend; npm install; npm run dev; npm run build; npm run lint`
- **Database**: `dotnet ef migrations add Name --project src/PRMS.Infrastructure --startup-project src/PRMS.API`

## Architecture and Codebase Structure
- **Clean Architecture**: PRMS.Domain (entities), PRMS.Application (CQRS/MediatR), PRMS.Infrastructure (EF Core/repos), PRMS.API (Web API/SignalR), PRMS.Shared (DTOs)
- **Frontend**: React 18 + TypeScript + Vite in frontend/
- **Database**: SQL Server 2022, schema in docs/DatabaseSchema.sql
- **Key Patterns**: CQRS, Repository, UnitOfWork, Soft Delete, Audit Trail

## Code Style Guidelines
- **CQRS**: Commands for writes, Queries for reads, handlers via MediatR
- **Entities**: Inherit BaseEntity (Guid IDs, timestamps, soft delete, audit)
- **Naming**: PascalCase classes/properties, camelCase methods/variables
- **Error Handling**: Try-catch in command handlers, throw custom exceptions
- **Imports**: System first, then third-party, then project (alphabetical)
- **Formatting**: Use `dotnet format`, consistent indentation
- **Refer to CLAUDE.md** for comprehensive development guidance, scenarios, and API details.
