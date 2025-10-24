## ADDED Requirements

### Requirement: Department List View
The system SHALL display all departments with their managers and member counts.

#### Scenario: Admin views department list
- **WHEN** an admin navigates to the departments page
- **THEN** the system SHALL display all departments in a table
- **AND** SHALL show department code, name, manager, and member count
- **AND** SHALL provide actions for edit and delete

### Requirement: Department CRUD Operations
The system SHALL provide forms for managing departments (Admin only).

#### Scenario: Admin creates a department
- **WHEN** an admin submits the department creation form
- **THEN** the system SHALL validate the department code is unique
- **AND** SHALL call POST /api/Department
- **AND** SHALL add the department to the list

#### Scenario: Admin edits a department
- **WHEN** an admin updates department details
- **THEN** the system SHALL call PUT /api/Department/{id}
- **AND** SHALL validate business rules
- **AND** SHALL refresh the department list

#### Scenario: Admin deletes a department
- **WHEN** an admin attempts to delete a department
- **THEN** the system SHALL check if department has assigned users
- **AND** SHALL prevent deletion if users exist
- **AND** SHALL show appropriate error message
