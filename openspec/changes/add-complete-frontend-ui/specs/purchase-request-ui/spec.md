## ADDED Requirements

### Requirement: Purchase Request List View
The system SHALL display a paginated, sortable table of purchase requests.

#### Scenario: User views their purchase requests
- **WHEN** a user navigates to the purchase requests page
- **THEN** the system SHALL display all PRs created by or assigned to the user
- **AND** SHALL show PR number, title, status, amount, and created date
- **AND** SHALL support sorting by any column
- **AND** SHALL support filtering by status

#### Scenario: User searches purchase requests
- **WHEN** a user enters text in the search box
- **THEN** the system SHALL filter PRs by number, title, or description
- **AND** SHALL update results in real-time

#### Scenario: User filters by date range
- **WHEN** a user selects a date range filter
- **THEN** the system SHALL display only PRs created within that range
- **AND** SHALL update the URL query parameters

### Requirement: Purchase Request Creation Form
The system SHALL provide a multi-step form for creating purchase requests.

#### Scenario: User creates a new purchase request
- **WHEN** a user submits the PR creation form
- **THEN** the system SHALL validate all required fields
- **AND** SHALL submit the request to POST /api/PurchaseRequest
- **AND** SHALL display a success notification
- **AND** SHALL redirect to the PR detail page

#### Scenario: User saves draft purchase request
- **WHEN** a user clicks "Save as Draft" in the creation form
- **THEN** the system SHALL save the PR with "Draft" status
- **AND** SHALL allow editing later
- **AND** SHALL NOT trigger approval workflow

### Requirement: Purchase Request Approval Workflow
The system SHALL provide approval/rejection UI for authorized users.

#### Scenario: Approver reviews a pending purchase request
- **WHEN** an approver views a PR with "InApproval" status
- **THEN** the system SHALL display "Approve" and "Reject" buttons
- **AND** SHALL show approval history
- **AND** SHALL require a comment for rejection

#### Scenario: Approver approves a purchase request
- **WHEN** an approver clicks "Approve" and confirms
- **THEN** the system SHALL call POST /api/PurchaseRequest/{id}/approve
- **AND** SHALL update the PR status optimistically
- **AND** SHALL show a success notification
- **AND** SHALL send real-time notification to requester

#### Scenario: Approver rejects a purchase request
- **WHEN** an approver submits rejection with a reason
- **THEN** the system SHALL call POST /api/PurchaseRequest/{id}/reject
- **AND** SHALL update PR status to "Rejected"
- **AND** SHALL display the rejection reason
- **AND** SHALL notify the requester

### Requirement: Purchase Request Detail View
The system SHALL display complete PR details with edit capability.

#### Scenario: User views purchase request details
- **WHEN** a user navigates to a PR detail page
- **THEN** the system SHALL display all PR fields (items, amounts, approvals, history)
- **AND** SHALL show approval workflow timeline
- **AND** SHALL display audit trail of changes
- **AND** SHALL show comments section

#### Scenario: User edits a draft purchase request
- **WHEN** a user with edit permission clicks "Edit" on a draft PR
- **THEN** the system SHALL navigate to the edit form
- **AND** SHALL pre-populate all existing values
- **AND** SHALL allow modification of all draft fields

#### Scenario: User submits a draft purchase request
- **WHEN** a user clicks "Submit for Approval" on a draft PR
- **THEN** the system SHALL call POST /api/PurchaseRequest/{id}/submit
- **AND** SHALL change status to "Submitted"
- **AND** SHALL trigger the approval workflow
- **AND** SHALL prevent further editing

### Requirement: Purchase Request Line Items Management
The system SHALL provide UI for managing purchase request line items.

#### Scenario: User adds product to purchase request
- **WHEN** a user searches and selects a product
- **THEN** the system SHALL add it as a line item
- **AND** SHALL pre-fill product details (name, price)
- **AND** SHALL allow quantity and unit price modification
- **AND** SHALL calculate line item total automatically

#### Scenario: User removes line item
- **WHEN** a user clicks delete on a line item
- **THEN** the system SHALL remove the item from the list
- **AND** SHALL recalculate the PR total amount
- **AND** SHALL require at least one item before submission

### Requirement: Purchase Request Status Badge Display
The system SHALL display color-coded status badges for purchase requests.

#### Scenario: Status badge reflects current state
- **WHEN** displaying a purchase request in any view
- **THEN** the status badge SHALL use correct color coding
- **AND** SHALL display "Draft" as gray
- **AND** SHALL display "Submitted" as blue
- **AND** SHALL display "InApproval" as yellow
- **AND** SHALL display "Approved" as green
- **AND** SHALL display "Rejected" as red
