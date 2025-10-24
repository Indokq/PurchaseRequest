# Change Proposal: Add JWT Authentication

## Why

The application currently lacks a complete authentication system despite having JWT infrastructure configured in Program.cs. Without functional authentication endpoints and services, users cannot log in, register, or obtain JWT tokens, making the entire API unusable for authenticated requests. The User entity already has a PasswordHash field, but there are no mechanisms to hash passwords securely or generate tokens.

## What Changes

- **Add AuthController** with `/api/Auth/Login` and `/api/Auth/Register` endpoints for user authentication
- **Add IJwtTokenService** interface and implementation for generating and validating JWT tokens with proper claims
- **Add IPasswordHasher** interface and implementation using BCrypt for secure password hashing and verification
- **Add LoginCommand and RegisterCommand** with MediatR handlers following CQRS pattern
- **Configure JWT secret key** in appsettings.json and user secrets for secure token generation
- **Add authentication DTOs** (LoginRequestDto, LoginResponseDto, RegisterRequestDto) in PRMS.Shared
- **Add security services registration** in Program.cs dependency injection configuration
- **BREAKING**: JWT configuration must include a secure secret key (minimum 32 characters)

## Impact

### High Priority - Blocking Issue
This change is **critical** and **blocking**. Without it:
- Users cannot authenticate or access protected endpoints
- The application cannot function as intended
- All controllers with `[Authorize]` attribute are inaccessible
- Frontend application cannot obtain tokens for API calls

### Affected Specifications
- **NEW**: `authentication` - Complete authentication capability specification

### Affected Code
- **New**: `src/PRMS.API/Controllers/AuthController.cs`
- **New**: `src/PRMS.Application/Commands/LoginCommand.cs`
- **New**: `src/PRMS.Application/Commands/RegisterCommand.cs`
- **New**: `src/PRMS.Domain/Interfaces/IJwtTokenService.cs`
- **New**: `src/PRMS.Domain/Interfaces/IPasswordHasher.cs`
- **New**: `src/PRMS.Infrastructure/Services/JwtTokenService.cs`
- **New**: `src/PRMS.Infrastructure/Services/PasswordHasher.cs`
- **New**: `src/PRMS.Shared/DTOs/AuthDtos.cs`
- **Modified**: `src/PRMS.API/Program.cs` (add service registrations)
- **Modified**: `src/PRMS.Infrastructure/PRMS.Infrastructure.csproj` (add BCrypt.Net-Next package)
- **Modified**: `src/PRMS.API/appsettings.json` (add JWT secret key configuration)

### Security Considerations
- Passwords stored using BCrypt with work factor 12
- JWT tokens signed with HS256 algorithm
- Token expiry configurable (default: 24 hours)
- User secrets recommended for development JWT key
- Environment variables required for production deployment

### Migration Path
- Existing User records with empty PasswordHash can register to set passwords
- No breaking changes to existing User entity structure
- Backward compatible with current database schema
