## ADDED Requirements

### Requirement: User List View
The system SHALL display all users with their roles and status (Admin only).

#### Scenario: Admin views user list
- **WHEN** an admin navigates to the users page
- **THEN** the system SHALL display all users in a table
- **AND** SHALL show username, email, department, roles, and status
- **AND** SHALL support filtering by role and status

### Requirement: User Role Management
The system SHALL provide UI for assigning/removing user roles (Admin only).

#### Scenario: Admin assigns a role to a user
- **WHEN** an admin selects roles and saves
- **THEN** the system SHALL call PUT /api/UserManagement/users/{id}/role
- **AND** SHALL update the user's role list
- **AND** SHALL enforce role assignment permissions

### Requirement: User Registration
The system SHALL allow admins to register new users.

#### Scenario: Admin creates a new user account
- **WHEN** an admin submits the user registration form
- **THEN** the system SHALL validate email uniqueness
- **AND** SHALL call POST /api/Auth/Register
- **AND** SHALL assign default role
- **AND** SHALL show success confirmation
