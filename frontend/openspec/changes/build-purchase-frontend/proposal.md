## Why
The project currently exposes a fully functional backend but lacks a frontend capable of authenticating users and exercising the available purchase request APIs.
We need a complete SPA so business users can manage purchase requests without relying on Swagger or manual API calls.

## What Changes
- Build a routed React frontend that authenticates against `/api/Auth/Login` and persists JWT credentials for subsequent requests.
- Implement purchase request browsing with server data fetched via React Query and visualized using the existing dashboard styling.
- Deliver forms for creating and updating purchase requests, including support for line items and reference data lookups (products, vendors).
- Enable destructive actions (delete) and ensure the UI reflects mutations by invalidating cached queries.
- Centralize API configuration (axios client, error handling) and protect routes using an auth-aware layout.

## Impact
- Affected specs: `purchase-request-frontend`
- Affected code: `frontend/src/**/*`, shared axios/auth utilities, Tailwind styles
