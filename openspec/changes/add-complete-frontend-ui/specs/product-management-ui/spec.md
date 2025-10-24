## ADDED Requirements

### Requirement: Product Catalog View
The system SHALL display a searchable grid of products with filters.

#### Scenario: User browses product catalog
- **WHEN** a user navigates to the products page
- **THEN** the system SHALL display all active products in a grid layout
- **AND** SHALL show product name, category, unit price, and stock status
- **AND** SHALL support pagination with configurable page size

#### Scenario: User filters products by category
- **WHEN** a user selects a category filter
- **THEN** the system SHALL display only products in that category
- **AND** SHALL update the URL query parameters

### Requirement: Product CRUD Operations
The system SHALL provide forms for creating, editing, and deleting products (Admin only).

#### Scenario: Admin creates a new product
- **WHEN** an admin submits the product creation form
- **THEN** the system SHALL validate required fields (name, category, price)
- **AND** SHALL call POST /api/Product
- **AND** SHALL add the new product to the catalog

#### Scenario: Admin edits an existing product
- **WHEN** an admin updates product details and saves
- **THEN** the system SHALL call PUT /api/Product/{id}
- **AND** SHALL refresh the product list with updated data

### Requirement: Product Search
The system SHALL provide full-text search across product fields.

#### Scenario: User searches for products
- **WHEN** a user types in the search box
- **THEN** the system SHALL call GET /api/Product/search with the query
- **AND** SHALL display matching products
- **AND** SHALL highlight search terms in results
