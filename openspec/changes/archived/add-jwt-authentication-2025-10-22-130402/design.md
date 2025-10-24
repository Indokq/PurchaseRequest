# Design Document: JWT Authentication System

## Context

The Purchase Request Management System requires a complete authentication mechanism to secure API endpoints and manage user access. While the infrastructure for JWT authentication is partially configured in Program.cs, critical components are missing:

- No authentication endpoints for login/registration
- No password hashing implementation
- No JWT token generation service
- Empty JWT secret key in configuration

This design addresses these gaps by implementing a complete, production-ready authentication system following Clean Architecture and CQRS patterns already established in the codebase.

### Stakeholders
- **End Users**: Employees who need to log in to create and manage purchase requests
- **System Administrators**: Need to manage user accounts and authentication configuration
- **Developers**: Require clear authentication patterns for future endpoint development
- **Security Team**: Need assurance of secure password storage and token management

### Constraints
- Must follow existing Clean Architecture (Domain/Application/Infrastructure/API layers)
- Must use CQRS pattern with MediatR (consistent with existing commands/queries)
- Must integrate with existing User entity (already has PasswordHash field)
- Must work with configured JWT Bearer authentication in Program.cs
- Must support both development (User Secrets) and production (Environment Variables) configuration

## Goals / Non-Goals

### Goals
✅ Implement secure user registration with BCrypt password hashing  
✅ Implement user login with JWT token generation  
✅ Provide reusable services (IJwtTokenService, IPasswordHasher) for future auth features  
✅ Follow project conventions (CQRS, Clean Architecture, naming patterns)  
✅ Include comprehensive validation (email format, password strength, user existence)  
✅ Support role-based claims in JWT tokens for future RBAC implementation  
✅ Provide clear configuration guidance (User Secrets for dev, Environment Variables for prod)  
✅ Enable immediate testing via Swagger UI with generated tokens

### Non-Goals
❌ Refresh token implementation (future enhancement)  
❌ OAuth/SSO integration (out of scope)  
❌ Password reset functionality (separate feature)  
❌ Account lockout after failed attempts (future security enhancement)  
❌ Rate limiting on auth endpoints (infrastructure concern)  
❌ Multi-factor authentication (future enhancement)  
❌ Session management (stateless JWT approach)

## Decisions

### Decision 1: Use BCrypt for Password Hashing
**What**: Implement password hashing using BCrypt.Net-Next library with work factor 12.

**Why**:
- Industry-standard password hashing algorithm designed to be slow (resistant to brute force)
- Adaptive work factor allows increasing security as hardware improves
- Automatically handles salt generation per password
- Well-maintained .NET library (BCrypt.Net-Next) with 8M+ downloads
- Work factor 12 balances security (2^12 = 4,096 iterations) with performance (~250ms per hash)

**Alternatives Considered**:
- **PBKDF2**: Microsoft's default, but BCrypt is purpose-built for passwords
- **Argon2**: More modern but overkill for this use case; BCrypt is sufficient
- **SHA256/SHA512**: Fast hashing algorithms unsuitable for passwords (too fast = vulnerable to brute force)

**Trade-offs**:
- ✅ Strong security against rainbow table and brute force attacks
- ✅ Automatic salt handling reduces implementation errors
- ⚠️ Slightly slower than PBKDF2 (~250ms vs ~100ms), but acceptable for login/registration
- ❌ Cannot increase work factor for existing hashes without user password reset

### Decision 2: JWT with HS256 Algorithm
**What**: Generate JWT tokens signed with HS256 (HMAC-SHA256) using a 256-bit secret key.

**Why**:
- Symmetric signing is simpler and sufficient for single-server scenarios
- HS256 is widely supported and well-understood
- No public key infrastructure (PKI) required
- Existing JWT configuration in Program.cs already uses HS256
- Tokens are stateless and self-contained (no server-side session storage)

**Alternatives Considered**:
- **RS256 (RSA)**: Asymmetric signing with public/private keys; overkill for single-server architecture
- **ES256 (ECDSA)**: Modern alternative to RSA, but adds complexity without clear benefits
- **Session-based auth**: Requires server-side storage; JWT approach aligns with microservices scalability

**Trade-offs**:
- ✅ Simple implementation and configuration
- ✅ No database lookups for token validation (performance benefit)
- ✅ Works seamlessly with existing Program.cs configuration
- ⚠️ Secret key must be securely managed (User Secrets for dev, Environment Variables for prod)
- ❌ Token revocation requires additional infrastructure (acceptable trade-off for v1)

### Decision 3: CQRS Pattern with MediatR Commands
**What**: Implement LoginCommand and RegisterCommand with dedicated handlers, dispatched via MediatR.

**Why**:
- Consistent with existing architecture (e.g., CreatePurchaseRequestCommand)
- Separates authentication logic from controller (thin controllers)
- Enables cross-cutting concerns (validation, logging) via MediatR pipeline behaviors
- Testable command handlers without HTTP context dependencies
- Aligns with project conventions documented in openspec/project.md

**Alternatives Considered**:
- **Direct service calls from controller**: Violates existing CQRS pattern
- **Repository pattern for auth**: Auth is a cross-cutting concern, not domain-specific
- **Identity Server integration**: Heavyweight solution for current requirements

**Trade-offs**:
- ✅ Consistent architecture across all features
- ✅ Easy to add validation, caching, or audit logging via MediatR behaviors
- ✅ Improved testability (mock IMediator vs mocking multiple services)
- ⚠️ Additional boilerplate (command class, handler class, validator class)
- ❌ None significant

### Decision 4: Interface Segregation for Auth Services
**What**: Create separate interfaces (IJwtTokenService, IPasswordHasher) in Domain layer.

**Why**:
- Clean Architecture: Domain layer defines contracts, Infrastructure implements
- Testability: Easy to mock interfaces in unit tests
- Future flexibility: Can swap implementations (e.g., Argon2 instead of BCrypt) without changing domain logic
- Single Responsibility Principle: Each interface has one focused purpose

**Alternatives Considered**:
- **Single IAuthService interface**: Violates Interface Segregation Principle; combines unrelated concerns
- **Concrete classes directly in Application layer**: Violates Dependency Inversion Principle

**Trade-offs**:
- ✅ Clean separation of concerns
- ✅ Easy to test command handlers by mocking interfaces
- ✅ Future-proof for implementation swaps
- ⚠️ Additional files (2 interfaces, 2 implementations)
- ❌ None significant

### Decision 5: User Secrets for Development, Environment Variables for Production
**What**: Store JWT secret key in User Secrets (dev) and Environment Variables (prod).

**Why**:
- Security best practice: Never commit secrets to source control
- User Secrets integrated with .NET configuration system
- Environment Variables standard for containerized deployments (Docker, Kubernetes)
- Separate secrets per developer (User Secrets stored in user profile)
- Azure App Service, AWS, and other cloud platforms natively support environment variables

**Alternatives Considered**:
- **Hardcoded in appsettings.json**: Insecure; secrets exposed in source control
- **Key Vault (Azure/AWS)**: Adds complexity and cost; overkill for v1
- **Encrypted configuration files**: Custom solution; User Secrets + Environment Variables are standard

**Trade-offs**:
- ✅ Secure by default (no secrets in source control)
- ✅ Standard .NET approach (no custom infrastructure)
- ✅ Works across all deployment environments
- ⚠️ Developers must run `dotnet user-secrets set` command (documented in tasks.md)
- ❌ None significant

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ PRMS.API (Presentation Layer)                               │
│                                                               │
│  AuthController                                               │
│  ├─ POST /api/Auth/Login    → LoginCommand                   │
│  └─ POST /api/Auth/Register → RegisterCommand                │
│                                                               │
│  [AllowAnonymous] - No JWT required for auth endpoints       │
└─────────────────────────────────────────────────────────────┘
                            ↓ IMediator.Send()
┌─────────────────────────────────────────────────────────────┐
│ PRMS.Application (Application Layer - CQRS)                 │
│                                                               │
│  LoginCommand + LoginCommandHandler                           │
│  ├─ Validate user exists (via UnitOfWork)                    │
│  ├─ Verify password (IPasswordHasher)                        │
│  ├─ Generate JWT token (IJwtTokenService)                    │
│  ├─ Update LastLoginAt                                        │
│  └─ Return LoginResponseDto                                   │
│                                                               │
│  RegisterCommand + RegisterCommandHandler                     │
│  ├─ Validate email unique (via UnitOfWork)                   │
│  ├─ Hash password (IPasswordHasher)                          │
│  ├─ Create User entity                                        │
│  ├─ Save via UnitOfWork                                       │
│  ├─ Generate JWT token (IJwtTokenService)                    │
│  └─ Return LoginResponseDto                                   │
│                                                               │
│  FluentValidation Validators                                  │
│  ├─ LoginCommandValidator                                     │
│  └─ RegisterCommandValidator                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ Interface Dependencies
┌─────────────────────────────────────────────────────────────┐
│ PRMS.Domain (Core Layer - Interfaces)                       │
│                                                               │
│  IJwtTokenService                                             │
│  ├─ GenerateToken(User user) : string                        │
│  ├─ ValidateToken(string token) : ClaimsPrincipal            │
│  └─ GetUserIdFromToken(string token) : Guid                  │
│                                                               │
│  IPasswordHasher                                              │
│  ├─ HashPassword(string password) : string                   │
│  └─ VerifyPassword(string password, string hash) : bool      │
└─────────────────────────────────────────────────────────────┘
                            ↑ Implemented by
┌─────────────────────────────────────────────────────────────┐
│ PRMS.Infrastructure (Infrastructure Layer - Services)       │
│                                                               │
│  JwtTokenService : IJwtTokenService                           │
│  ├─ Injects IConfiguration for Jwt:Key, Issuer, Audience    │
│  ├─ Uses System.IdentityModel.Tokens.Jwt                    │
│  ├─ Signs tokens with HS256 + secret key                     │
│  └─ Includes claims: UserId, Email, Roles                    │
│                                                               │
│  PasswordHasher : IPasswordHasher                             │
│  ├─ Uses BCrypt.Net-Next library                             │
│  ├─ Work factor: 12 (2^12 = 4,096 iterations)                │
│  └─ Auto-generates salt per password                         │
└─────────────────────────────────────────────────────────────┘
```

### Sequence Diagram: User Login Flow

```
User → AuthController: POST /api/Auth/Login { email, password }
AuthController → IMediator: Send(LoginCommand)
IMediator → LoginCommandHandler: Handle(LoginCommand)
LoginCommandHandler → IUnitOfWork: Repository<User>().FindByEmail(email)
IUnitOfWork → LoginCommandHandler: User entity (or null)
LoginCommandHandler → IPasswordHasher: VerifyPassword(password, user.PasswordHash)
IPasswordHasher → LoginCommandHandler: true/false
LoginCommandHandler → IJwtTokenService: GenerateToken(user)
IJwtTokenService → LoginCommandHandler: JWT token string
LoginCommandHandler → IUnitOfWork: Update user.LastLoginAt + SaveChangesAsync()
LoginCommandHandler → IMediator: LoginResponseDto { Token, ExpiresAt, ... }
IMediator → AuthController: LoginResponseDto
AuthController → User: 200 OK { "token": "eyJhbG...", "expiresAt": "..." }
```

### Data Flow

**Registration Flow**:
1. User submits registration form (email, password, name, employeeId, departmentId)
2. RegisterCommand validated by FluentValidation (email format, password strength)
3. RegisterCommandHandler checks email uniqueness
4. Password hashed with BCrypt (work factor 12)
5. User entity created with PasswordHash, saved to database
6. JWT token generated for immediate login
7. LoginResponseDto returned (token + user details)

**Login Flow**:
1. User submits login credentials (email, password)
2. LoginCommand validated by FluentValidation
3. LoginCommandHandler fetches User by email
4. Password verified against stored PasswordHash
5. JWT token generated with UserId, Email, Roles claims
6. LastLoginAt timestamp updated
7. LoginResponseDto returned (token + expiry)

**Token Usage**:
1. Client stores JWT token (localStorage/sessionStorage)
2. Client includes token in Authorization header: `Bearer {token}`
3. ASP.NET Core JWT middleware validates token automatically
4. Authorized endpoints access user context via `HttpContext.User.Claims`

## Security Considerations

### Password Security
- **BCrypt with work factor 12**: 4,096 iterations (~250ms per hash)
- **Automatic salting**: Unique salt per password
- **Upgrade path**: If work factor needs increase, can be done during user login (re-hash with new work factor)

### JWT Token Security
- **HS256 signing**: Prevents token tampering
- **Expiry enforcement**: Default 24 hours, configurable
- **Secure secret key**: Minimum 256 bits (32 characters)
- **Claims included**: UserId (Guid), Email, Roles (for RBAC)

### Secrets Management
- **Development**: User Secrets (stored in `%APPDATA%\Microsoft\UserSecrets\`)
- **Production**: Environment Variables (Azure App Service, Docker, Kubernetes)
- **Never in source control**: appsettings.json has empty Jwt:Key with comment

### Attack Mitigation
- **SQL Injection**: EF Core parameterized queries
- **Brute Force**: BCrypt slow hashing (future: rate limiting, account lockout)
- **Token Theft**: HTTPS only (enforced in production), short token expiry
- **Password Leaks**: BCrypt ensures stolen password hashes are computationally expensive to crack

## Risks / Trade-offs

### Risk 1: Empty JWT Secret Key Causes Runtime Exception
**Risk**: If JWT:Key is not set, `IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))` will throw NullReferenceException.

**Mitigation**:
- Document User Secrets setup in tasks.md (step 5.3)
- Add validation in Program.cs startup to check JWT:Key is not null/empty (future enhancement)
- Provide clear error message if missing

**Likelihood**: Medium (developers may forget to set User Secrets)  
**Impact**: High (application fails to start)

### Risk 2: BCrypt Work Factor Too High/Low
**Risk**: Work factor 12 may be too slow (bad UX) or too fast (security risk) depending on hardware.

**Mitigation**:
- Work factor 12 is industry standard (~250ms on modern servers)
- Make work factor configurable if needed in future
- Monitor login performance in production

**Likelihood**: Low (work factor 12 is well-tested)  
**Impact**: Medium (affects UX or security)

### Risk 3: No Token Revocation Mechanism
**Risk**: If a JWT token is compromised, cannot be revoked before expiry (stateless JWT design).

**Mitigation**:
- Short token expiry (24 hours default) limits exposure window
- Future enhancement: Refresh tokens + token revocation list (Redis-backed)
- Accept this trade-off for v1 simplicity

**Likelihood**: Low (HTTPS + short expiry reduces risk)  
**Impact**: Medium (compromised token valid until expiry)

### Trade-off Summary
| Decision | Benefit | Cost | Accepted? |
|----------|---------|------|-----------|
| BCrypt work factor 12 | Strong password security | ~250ms per login | ✅ Yes |
| Stateless JWT (no revocation) | Simple, scalable | Cannot revoke tokens | ✅ Yes (v1) |
| HS256 (symmetric) | Simple, no PKI | Single secret key | ✅ Yes |
| User Secrets (dev) | Secure by default | Manual setup step | ✅ Yes |
| CQRS pattern | Consistency, testability | More boilerplate | ✅ Yes |

## Migration Plan

### Development Environment Setup
1. Developer pulls code with new auth implementation
2. Runs `dotnet user-secrets init --project src/PRMS.API`
3. Runs `dotnet user-secrets set "Jwt:Key" "generated-256-bit-secret-key"`
4. Runs `dotnet restore` to install BCrypt.Net-Next package
5. Runs `dotnet build` to verify compilation
6. Tests `/api/Auth/Register` and `/api/Auth/Login` via Swagger

### Production Deployment
1. Set `Jwt__Key` environment variable (Azure App Service, AWS, Docker, etc.)
2. Deploy new code (includes AuthController, services, commands)
3. Verify JWT authentication works by testing login endpoint
4. Existing protected endpoints automatically enforce JWT authentication (no changes needed)

### Existing User Migration
- Users with empty `PasswordHash` can register (sets password)
- Users with existing `PasswordHash` (if any seeded data) can login immediately
- No database schema changes required (PasswordHash field already exists)

### Rollback Plan
If issues arise:
1. Revert code to previous version (no auth endpoints)
2. Application continues to work without authentication (if endpoints were previously unprotected)
3. No data loss (User table unchanged)
4. Can redeploy with fixes once issues resolved

## Open Questions

### Q1: Should registration be public or admin-only?
**Current Design**: Public registration (any user can register)  
**Alternative**: Admin-only user creation via separate endpoint  
**Decision Needed**: Clarify with product owner  
**Impact**: May need to add `[Authorize(Roles = "Admin")]` to Register endpoint

### Q2: What password complexity rules should be enforced?
**Current Design**: Basic validation in RegisterCommandValidator (minimum length, required fields)  
**Options**:
- Minimum 8 characters (current)
- Require uppercase, lowercase, number, special character
- Use zxcvbn password strength estimator

**Decision**: Start with minimum 8 characters, enhance based on security requirements

### Q3: Should we log failed login attempts?
**Current Design**: Basic error handling (return 401 Unauthorized)  
**Enhancement**: Log failed attempts to Serilog for security monitoring  
**Decision**: Add logging to LoginCommandHandler (low effort, high value)

### Q4: Should roles be assigned during registration?
**Current Design**: User entity has `Roles` collection, but no role assignment in RegisterCommand  
**Options**:
- Auto-assign "Employee" role to all new users
- Allow role selection during registration (admin feature)
- Default to no roles (admin assigns roles later)

**Decision**: Auto-assign "Employee" role in RegisterCommandHandler (ensures all users have basic access)
