## ADDED Requirements

### Requirement: Admin Dashboard Overview
The system SHALL display key metrics and recent activity for administrators.

#### Scenario: Admin views dashboard
- **WHEN** an admin navigates to the dashboard
- **THEN** the system SHALL display PR statistics (pending, approved, rejected, total)
- **AND** SHALL show recent purchase requests
- **AND** SHALL display department summaries
- **AND** SHALL show user activity metrics

### Requirement: Analytics and Reporting
The system SHALL provide visual analytics for purchase request trends.

#### Scenario: Admin views PR analytics
- **WHEN** an admin views the analytics section
- **THEN** the system SHALL display charts for PR volume over time using Recharts
- **AND** SHALL show approval rates by department
- **AND** SHALL provide date range filtering
