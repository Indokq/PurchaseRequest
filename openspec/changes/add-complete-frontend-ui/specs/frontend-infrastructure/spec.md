## ADDED Requirements

### Requirement: API Client Architecture
The system SHALL provide a centralized API client architecture with domain-specific services.

#### Scenario: API service calls backend endpoints  
- **WHEN** a feature module invokes an API service method
- **THEN** the service SHALL use the configured axios instance with auth interceptors
- **AND** SHALL transform request data to match backend DTOs
- **AND** SHALL return typed response data

#### Scenario: Authentication token is injected
- **WHEN** an authenticated API request is made
- **THEN** the axios interceptor SHALL inject the bearer token from storage
- **AND** SHALL handle 401 responses by redirecting to login

### Requirement: Custom Hooks for Data Fetching
The system SHALL provide custom hooks wrapping TanStack Query for each domain entity.

#### Scenario: Component fetches purchase requests
- **WHEN** a component calls usePurchaseRequests hook
- **THEN** the hook SHALL fetch data using TanStack Query
- **AND** SHALL provide loading, error, and data states
- **AND** SHALL cache results according to query configuration

### Requirement: TypeScript Type Definitions
The system SHALL define TypeScript interfaces matching all backend DTOs.

#### Scenario: Type safety for API requests
- **WHEN** a developer creates an API request
- **THEN** TypeScript SHALL enforce correct request payload structure
- **AND** SHALL provide autocomplete for available fields

### Requirement: Global Error Handling
The system SHALL implement centralized error handling for all API failures.

#### Scenario: API call fails with network error
- **WHEN** an API request fails due to network issues
- **THEN** the error boundary SHALL catch the error
- **AND** SHALL display a user-friendly toast notification
- **AND** SHALL log the error for monitoring

### Requirement: SignalR Real-time Integration
The system SHALL provide real-time notification support via SignalR.

#### Scenario: Real-time purchase request status update
- **WHEN** a purchase request status changes
- **THEN** the SignalR hub SHALL push a notification to connected clients
- **AND** the frontend SHALL display a toast notification
- **AND** SHALL update the PR list automatically
