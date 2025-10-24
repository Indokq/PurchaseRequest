## ADDED Requirements

### Requirement: Authenticated SPA Shell
The frontend SHALL provide a login experience that authenticates against `/api/Auth/Login`, persists the returned JWT, and restricts app routes to authenticated users.

#### Scenario: Successful login
- **WHEN** a user submits valid credentials on the login screen
- **THEN** the app SHALL issue `POST https://localhost:5001/api/Auth/Login` with the email and password
- **AND** on a 200 response the app SHALL store the token, expiry, and user profile in memory and durable storage
- **AND** the app SHALL navigate to the authenticated shell without requiring a refresh

#### Scenario: Unauthorized login attempt
- **WHEN** the login request returns 401 or 403
- **THEN** the app SHALL display an inline error message and clear any persisted token data

#### Scenario: Guarded route access
- **WHEN** a user without a stored token attempts to access an authenticated route
- **THEN** the app SHALL redirect them to `/login` and prevent rendering of protected content

### Requirement: Purchase Request Catalog
The frontend SHALL present a paginated table of purchase requests sourced from `/api/PurchaseRequest`, reflecting status, priority, amount, and request dates.

#### Scenario: Load purchase requests
- **WHEN** an authenticated user visits the purchase request list view
- **THEN** the app SHALL call `GET https://localhost:5001/api/PurchaseRequest?pageNumber=1&pageSize=10`
- **AND** the app SHALL render each request number, title, status, priority, total amount, and request date in the table

#### Scenario: Fetch failure handling
- **WHEN** the API call responds with a non-2xx status
- **THEN** the app SHALL show an error banner with retry controls without crashing the shell

### Requirement: Purchase Request Form
The frontend SHALL allow users to create and edit purchase requests, including multiple line items, by interacting with `/api/PurchaseRequest` endpoints.

#### Scenario: Create purchase request with line items
- **WHEN** a user selects “New Request” and submits valid header fields and at least one line item
- **THEN** the app SHALL issue `POST https://localhost:5001/api/PurchaseRequest` with the composed payload matching `CreatePurchaseRequestDto`
- **AND** on success the app SHALL clear the form, close the modal or navigate back, and invalidate cached list queries

#### Scenario: Edit existing purchase request
- **WHEN** a user opens an existing request for editing
- **THEN** the app SHALL fetch details via `GET https://localhost:5001/api/PurchaseRequest/{id}` and prefill the form
- **AND** on submit the app SHALL send `PUT https://localhost:5001/api/PurchaseRequest/{id}` with updated fields matching `UpdatePurchaseRequestDto`
- **AND** on success the app SHALL reflect the updated values in the list view without a full page reload

### Requirement: Purchase Request Deletion
The frontend SHALL support deleting purchase requests and updating UI state accordingly.

#### Scenario: Delete purchase request
- **WHEN** a user confirms deletion for a specific request
- **THEN** the app SHALL call `DELETE https://localhost:5001/api/PurchaseRequest/{id}`
- **AND** on success the app SHALL remove the request from the list and show a confirmation toast or banner

### Requirement: Reference Data Retrieval
The frontend SHALL obtain vendor and product reference data for use in purchase request forms.

#### Scenario: Populate selectors from reference data
- **WHEN** the purchase request form initializes
- **THEN** the app SHALL fetch `GET https://localhost:5001/api/Product` and `GET https://localhost:5001/api/Vendor`
- **AND** the app SHALL expose the results as options for item lines, falling back to manual entry if either call fails
