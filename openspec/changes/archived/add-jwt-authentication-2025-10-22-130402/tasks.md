# Implementation Tasks

## 1. Domain Layer - Security Interfaces
- [ ] 1.1 Create `IJwtTokenService` interface in `PRMS.Domain/Interfaces/`
  - [ ] Define `GenerateToken(User user)` method returning token string
  - [ ] Define `ValidateToken(string token)` method returning ClaimsPrincipal
  - [ ] Define `GetUserIdFromToken(string token)` helper method
- [ ] 1.2 Create `IPasswordHasher` interface in `PRMS.Domain/Interfaces/`
  - [ ] Define `HashPassword(string password)` method
  - [ ] Define `VerifyPassword(string password, string hash)` method

## 2. Shared Layer - DTOs
- [ ] 2.1 Create `AuthDtos.cs` in `PRMS.Shared/DTOs/`
  - [ ] Define `LoginRequestDto` (Email, Password)
  - [ ] Define `LoginResponseDto` (Token, ExpiresAt, User details)
  - [ ] Define `RegisterRequestDto` (Email, Password, FirstName, LastName, EmployeeId, DepartmentId)

## 3. Infrastructure Layer - Service Implementations
- [ ] 3.1 Add BCrypt.Net-Next NuGet package to `PRMS.Infrastructure.csproj`
  - [ ] Run: `dotnet add package BCrypt.Net-Next --version 4.0.3`
- [ ] 3.2 Create `PasswordHasher` class in `PRMS.Infrastructure/Services/`
  - [ ] Implement `IPasswordHasher` interface
  - [ ] Use BCrypt with work factor 12
  - [ ] Add unit tests for hash generation and verification
- [ ] 3.3 Create `JwtTokenService` class in `PRMS.Infrastructure/Services/`
  - [ ] Implement `IJwtTokenService` interface
  - [ ] Inject `IConfiguration` for JWT settings
  - [ ] Generate tokens with UserId, Email, Roles claims
  - [ ] Set token expiry from configuration
  - [ ] Validate token signatures and expiry

## 4. Application Layer - CQRS Commands
- [ ] 4.1 Create `LoginCommand.cs` in `PRMS.Application/Commands/`
  - [ ] Define command with LoginRequestDto property
  - [ ] Create `LoginCommandHandler`
  - [ ] Validate user exists and is active
  - [ ] Verify password using IPasswordHasher
  - [ ] Generate JWT token using IJwtTokenService
  - [ ] Update LastLoginAt timestamp
  - [ ] Return LoginResponseDto with token
  - [ ] Handle invalid credentials with appropriate exception
- [ ] 4.2 Create `RegisterCommand.cs` in `PRMS.Application/Commands/`
  - [ ] Define command with RegisterRequestDto property
  - [ ] Create `RegisterCommandHandler`
  - [ ] Validate email uniqueness
  - [ ] Validate department exists
  - [ ] Hash password using IPasswordHasher
  - [ ] Create new User entity
  - [ ] Assign default user role
  - [ ] Save to database via UnitOfWork
  - [ ] Generate JWT token for immediate login
  - [ ] Return LoginResponseDto
- [ ] 4.3 Add FluentValidation validators
  - [ ] `LoginCommandValidator` (email format, required fields)
  - [ ] `RegisterCommandValidator` (password strength, email format, required fields)

## 5. API Layer - Controller and Configuration
- [ ] 5.1 Create `AuthController.cs` in `PRMS.API/Controllers/`
  - [ ] Add `[ApiController]` and `[Route("api/[controller]")]` attributes
  - [ ] Add `[AllowAnonymous]` attribute to controller
  - [ ] Inject IMediator
  - [ ] Create `POST /api/Auth/Login` endpoint
    - [ ] Accept LoginRequestDto in body
    - [ ] Dispatch LoginCommand via MediatR
    - [ ] Return 200 OK with LoginResponseDto on success
    - [ ] Return 401 Unauthorized on invalid credentials
  - [ ] Create `POST /api/Auth/Register` endpoint
    - [ ] Accept RegisterRequestDto in body
    - [ ] Dispatch RegisterCommand via MediatR
    - [ ] Return 201 Created with LoginResponseDto on success
    - [ ] Return 409 Conflict if email already exists
    - [ ] Return 400 BadRequest for validation errors
- [ ] 5.2 Update `Program.cs` dependency injection
  - [ ] Register `IJwtTokenService` as Scoped with `JwtTokenService`
  - [ ] Register `IPasswordHasher` as Singleton with `PasswordHasher`
  - [ ] Add after line 26 (after UnitOfWork registration)
- [ ] 5.3 Configure JWT secret key
  - [ ] Update `appsettings.json` with placeholder comment: "// Set via User Secrets or Environment Variable"
  - [ ] Run: `dotnet user-secrets init --project src/PRMS.API`
  - [ ] Run: `dotnet user-secrets set "Jwt:Key" "your-256-bit-secret-key-min-32-chars-long" --project src/PRMS.API`
  - [ ] Document environment variable `Jwt__Key` for production

## 6. Testing
- [ ] 6.1 Create unit tests for PasswordHasher
  - [ ] Test password hashing generates different hashes for same input
  - [ ] Test password verification succeeds with correct password
  - [ ] Test password verification fails with incorrect password
- [ ] 6.2 Create unit tests for JwtTokenService
  - [ ] Test token generation includes correct claims
  - [ ] Test token expiry is set correctly
  - [ ] Test token validation succeeds with valid token
  - [ ] Test token validation fails with expired token
- [ ] 6.3 Create integration tests for AuthController
  - [ ] Test successful registration creates user and returns token
  - [ ] Test registration fails with duplicate email
  - [ ] Test successful login returns valid token
  - [ ] Test login fails with invalid credentials
  - [ ] Test token can be used to access protected endpoints

## 7. Documentation and Validation
- [ ] 7.1 Update Swagger documentation
  - [ ] Verify `/api/Auth/Login` appears in Swagger UI
  - [ ] Verify `/api/Auth/Register` appears in Swagger UI
  - [ ] Test authentication via Swagger "Authorize" button
- [ ] 7.2 Update README.md
  - [ ] Add authentication setup instructions
  - [ ] Document user secrets configuration
  - [ ] Add example API calls with curl
- [ ] 7.3 Run validation checks
  - [ ] `dotnet build` (verify no compilation errors)
  - [ ] `dotnet test` (verify all tests pass)
  - [ ] Manual testing via Postman or Swagger
  - [ ] Verify JWT token works with existing protected endpoints

## 8. Security Hardening
- [ ] 8.1 Add rate limiting for authentication endpoints (future consideration)
- [ ] 8.2 Add account lockout after failed attempts (future consideration)
- [ ] 8.3 Add refresh token support (future consideration)
- [ ] 8.4 Add password complexity validation (current: enforce in RegisterCommandValidator)
