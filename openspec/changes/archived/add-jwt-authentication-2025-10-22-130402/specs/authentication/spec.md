# Authentication Specification

## ADDED Requirements

### Requirement: User Registration
The system SHALL allow new users to register by providing required credentials and profile information. Registration SHALL create a new User entity with a securely hashed password and return a JWT token for immediate authentication.

#### Scenario: Successful registration with valid data
- **WHEN** a user submits registration with email "john.doe@company.com", password "SecurePass123", firstName "John", lastName "Doe", employeeId "EMP001", and valid departmentId
- **THEN** the system SHALL create a new User entity with hashed password
- **AND** the system SHALL return a 201 Created response with JWT token and user details
- **AND** the token SHALL be valid for accessing protected endpoints

#### Scenario: Registration fails with duplicate email
- **WHEN** a user attempts to register with email "existing@company.com" that already exists in the database
- **THEN** the system SHALL return a 409 Conflict response
- **AND** the system SHALL include error message "Email already registered"
- **AND** no new User entity SHALL be created

#### Scenario: Registration fails with invalid email format
- **WHEN** a user submits registration with email "invalid-email-format"
- **THEN** the system SHALL return a 400 Bad Request response
- **AND** the system SHALL include validation error for email field

#### Scenario: Registration fails with weak password
- **WHEN** a user submits registration with password shorter than 8 characters
- **THEN** the system SHALL return a 400 Bad Request response
- **AND** the system SHALL include validation error "Password must be at least 8 characters"

#### Scenario: Registration fails with non-existent department
- **WHEN** a user submits registration with departmentId that does not exist
- **THEN** the system SHALL return a 400 Bad Request response
- **AND** the system SHALL include error message "Department not found"

### Requirement: User Login
The system SHALL allow registered users to authenticate by providing email and password credentials. Upon successful authentication, the system SHALL return a JWT token valid for 24 hours (configurable).

#### Scenario: Successful login with valid credentials
- **WHEN** a user submits login with email "john.doe@company.com" and correct password "SecurePass123"
- **THEN** the system SHALL verify the password against the stored hash
- **AND** the system SHALL generate a JWT token with UserId, Email, and Roles claims
- **AND** the system SHALL update the user's LastLoginAt timestamp
- **AND** the system SHALL return a 200 OK response with token and expiry datetime

#### Scenario: Login fails with incorrect password
- **WHEN** a user submits login with email "john.doe@company.com" and incorrect password "WrongPassword"
- **THEN** the system SHALL return a 401 Unauthorized response
- **AND** the system SHALL include error message "Invalid email or password"
- **AND** the user's LastLoginAt timestamp SHALL NOT be updated

#### Scenario: Login fails with non-existent email
- **WHEN** a user submits login with email "nonexistent@company.com"
- **THEN** the system SHALL return a 401 Unauthorized response
- **AND** the system SHALL include error message "Invalid email or password"

#### Scenario: Login fails for inactive user
- **WHEN** a user with IsActive = false submits login with correct credentials
- **THEN** the system SHALL return a 401 Unauthorized response
- **AND** the system SHALL include error message "Account is inactive"

#### Scenario: Token expires after configured duration
- **WHEN** a user successfully logs in
- **THEN** the returned JWT token SHALL have expiry set to current time + configured hours (default 24)
- **AND** after expiry time, the token SHALL be rejected by JWT middleware
- **AND** the user SHALL receive 401 Unauthorized when using expired token

### Requirement: Password Hashing
The system SHALL securely hash all user passwords using BCrypt algorithm with work factor 12. Password hashes SHALL be stored in the User entity PasswordHash field.

#### Scenario: Password is hashed during registration
- **WHEN** a user registers with password "MySecurePassword123"
- **THEN** the system SHALL hash the password using BCrypt with work factor 12
- **AND** the resulting hash SHALL be stored in User.PasswordHash field
- **AND** the plain-text password SHALL NOT be stored or logged

#### Scenario: Same password produces different hashes
- **WHEN** two users register with the same password "CommonPassword"
- **THEN** each user's PasswordHash SHALL be different (due to unique salt)
- **AND** both hashes SHALL successfully verify the original password

#### Scenario: Password verification succeeds with correct password
- **WHEN** a user logs in with the correct password
- **THEN** BCrypt verification SHALL return true
- **AND** authentication SHALL succeed

#### Scenario: Password verification fails with incorrect password
- **WHEN** a user logs in with an incorrect password
- **THEN** BCrypt verification SHALL return false
- **AND** authentication SHALL fail with 401 Unauthorized

### Requirement: JWT Token Generation
The system SHALL generate JWT tokens signed with HS256 algorithm using a secure secret key. Tokens SHALL include UserId, Email, and Roles claims for authorization purposes.

#### Scenario: Token includes required claims
- **WHEN** a JWT token is generated for user with Id "550e8400-e29b-41d4-a716-446655440000", email "user@company.com", and roles ["Employee", "Approver"]
- **THEN** the token payload SHALL include claim "UserId" with value "550e8400-e29b-41d4-a716-446655440000"
- **AND** the token payload SHALL include claim "Email" with value "user@company.com"
- **AND** the token payload SHALL include claim "Roles" with values ["Employee", "Approver"]
- **AND** the token SHALL include standard claims (iss, aud, exp, iat)

#### Scenario: Token is signed with HS256 algorithm
- **WHEN** a JWT token is generated
- **THEN** the token header SHALL specify algorithm "HS256"
- **AND** the token SHALL be signed using the configured secret key from Jwt:Key
- **AND** token verification SHALL succeed with the same secret key

#### Scenario: Token includes issuer and audience
- **WHEN** a JWT token is generated
- **THEN** the token SHALL include issuer claim matching configuration (default "PRMS.API")
- **AND** the token SHALL include audience claim matching configuration (default "PRMS.Client")
- **AND** JWT middleware SHALL validate issuer and audience

#### Scenario: Token generation fails with missing secret key
- **WHEN** Jwt:Key configuration is empty or null
- **THEN** the application SHALL fail to start during service registration
- **AND** a clear error message SHALL indicate missing JWT secret key

### Requirement: Authentication Endpoints
The system SHALL provide RESTful API endpoints for user registration and login at `/api/Auth/Register` and `/api/Auth/Login`. These endpoints SHALL be accessible without authentication ([AllowAnonymous]).

#### Scenario: POST /api/Auth/Register endpoint accepts registration
- **WHEN** a POST request is sent to "/api/Auth/Register" with valid RegisterRequestDto
- **THEN** the system SHALL create a new user account
- **AND** the system SHALL return 201 Created with LoginResponseDto containing token
- **AND** the Location header SHALL include the created user's URI

#### Scenario: POST /api/Auth/Login endpoint accepts login
- **WHEN** a POST request is sent to "/api/Auth/Login" with valid LoginRequestDto
- **THEN** the system SHALL authenticate the user
- **AND** the system SHALL return 200 OK with LoginResponseDto containing token
- **AND** the token SHALL be immediately usable for protected endpoints

#### Scenario: Auth endpoints do not require JWT token
- **WHEN** a request is sent to "/api/Auth/Register" or "/api/Auth/Login" without Authorization header
- **THEN** the request SHALL be processed normally
- **AND** the system SHALL NOT return 401 Unauthorized due to missing token

#### Scenario: Auth endpoints appear in Swagger documentation
- **WHEN** Swagger UI is accessed at the API root
- **THEN** the "/api/Auth/Register" endpoint SHALL be documented
- **AND** the "/api/Auth/Login" endpoint SHALL be documented
- **AND** request/response schemas SHALL be displayed with DTO properties

### Requirement: JWT Secret Key Configuration
The system SHALL require a secure JWT secret key of at least 256 bits (32 characters) for token signing. The secret key SHALL be configured via User Secrets in development and Environment Variables in production.

#### Scenario: Development environment uses User Secrets
- **WHEN** a developer runs the application in Development environment
- **THEN** the system SHALL load Jwt:Key from User Secrets configuration
- **AND** the appsettings.json file SHALL contain empty Jwt:Key with documentation comment
- **AND** User Secrets SHALL be stored in user profile directory (not source control)

#### Scenario: Production environment uses Environment Variables
- **WHEN** the application runs in Production environment
- **THEN** the system SHALL load Jwt:Key from environment variable "Jwt__Key"
- **AND** Azure App Service / Docker / Kubernetes SHALL provide the environment variable
- **AND** the secret key SHALL NOT be stored in source control

#### Scenario: Secret key meets minimum length requirement
- **WHEN** Jwt:Key is configured with value less than 32 characters
- **THEN** token signing SHOULD fail with clear error message
- **AND** best practice SHALL be documented in setup guide

#### Scenario: Missing secret key prevents application startup
- **WHEN** the application starts without Jwt:Key configured
- **THEN** the JWT middleware configuration SHALL throw exception
- **AND** the application SHALL fail to start with clear error message

### Requirement: CQRS Command Pattern for Authentication
The system SHALL implement authentication logic using CQRS pattern with MediatR commands (LoginCommand, RegisterCommand) following the established project architecture.

#### Scenario: LoginCommand is dispatched via MediatR
- **WHEN** AuthController receives a login request
- **THEN** the controller SHALL create a LoginCommand with credentials
- **AND** the controller SHALL dispatch the command via IMediator.Send()
- **AND** LoginCommandHandler SHALL process authentication logic
- **AND** the handler SHALL return LoginResponseDto

#### Scenario: RegisterCommand is dispatched via MediatR
- **WHEN** AuthController receives a registration request
- **THEN** the controller SHALL create a RegisterCommand with user data
- **AND** the controller SHALL dispatch the command via IMediator.Send()
- **AND** RegisterCommandHandler SHALL process registration logic
- **AND** the handler SHALL return LoginResponseDto with token

#### Scenario: FluentValidation validates commands
- **WHEN** a LoginCommand or RegisterCommand is dispatched
- **THEN** FluentValidation validators SHALL execute before the handler
- **AND** validation errors SHALL return 400 Bad Request with error details
- **AND** handlers SHALL only execute for valid commands

### Requirement: Service Dependency Injection
The system SHALL register authentication services (IJwtTokenService, IPasswordHasher) in the dependency injection container for use by command handlers.

#### Scenario: IJwtTokenService is registered as Scoped
- **WHEN** the application starts
- **THEN** Program.cs SHALL register IJwtTokenService with JwtTokenService implementation
- **AND** the service SHALL be registered with Scoped lifetime
- **AND** command handlers SHALL inject IJwtTokenService via constructor

#### Scenario: IPasswordHasher is registered as Singleton
- **WHEN** the application starts
- **THEN** Program.cs SHALL register IPasswordHasher with PasswordHasher implementation
- **AND** the service SHALL be registered with Singleton lifetime (stateless service)
- **AND** command handlers SHALL inject IPasswordHasher via constructor

#### Scenario: Services are available in command handlers
- **WHEN** LoginCommandHandler or RegisterCommandHandler is instantiated
- **THEN** the DI container SHALL resolve IJwtTokenService and IPasswordHasher
- **AND** handlers SHALL use services for password hashing and token generation
- **AND** missing service registration SHALL cause application startup failure

### Requirement: Authentication DTOs
The system SHALL define Data Transfer Objects (DTOs) in PRMS.Shared layer for authentication requests and responses, ensuring consistent API contracts.

#### Scenario: LoginRequestDto contains email and password
- **WHEN** a client sends a login request
- **THEN** the request body SHALL deserialize to LoginRequestDto
- **AND** LoginRequestDto SHALL have Email property (string, required)
- **AND** LoginRequestDto SHALL have Password property (string, required)

#### Scenario: RegisterRequestDto contains user registration data
- **WHEN** a client sends a registration request
- **THEN** the request body SHALL deserialize to RegisterRequestDto
- **AND** RegisterRequestDto SHALL have Email, Password, FirstName, LastName, EmployeeId, DepartmentId properties
- **AND** all properties SHALL be required and validated

#### Scenario: LoginResponseDto contains token and user details
- **WHEN** authentication succeeds
- **THEN** the response body SHALL serialize from LoginResponseDto
- **AND** LoginResponseDto SHALL include Token (string), ExpiresAt (DateTime), UserId, Email, FullName
- **AND** clients SHALL use Token in Authorization header for subsequent requests
