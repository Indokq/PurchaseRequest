## Context
The backend exposes authenticated purchase request APIs with endpoints for CRUD operations and reference data (products, vendors).
The current React entry point renders a static dashboard that does not handle authentication, routing, or mutations.
We must introduce structure that keeps UI modular while leveraging the existing Tailwind aesthetic.

## Goals
- Provide a maintainable React architecture that supports authenticated areas and future modules.
- Use React Query for all server interactions to gain caching, loading states, and mutation management.
- Keep axios configuration centralized to ensure consistent headers and error handling.

## Non-Goals
- Implement SignalR real-time updates beyond basic notification display already present.
- Build advanced workflow actions (submit, approve, reject) beyond CRUD.

## Decisions
- **Routing:** Adopt `react-router-dom` v6, wrapping authenticated screens inside a protected layout that checks for a stored JWT. Public routes remain minimal (login).
- **State Management:** Use React Context solely for auth token storage and user profile data; other server data uses React Query.
- **Forms:** Utilize controlled components with lightweight validation using native constraints and minimal helpers (no extra form library to minimize dependencies).
- **API Client:** Create an axios instance with interceptors that inject the JWT and redirect to login on 401 responses.

## Alternatives Considered
- **Redux Toolkit:** Rejected to avoid unnecessary global state complexity; React Query and context cover the requirements.
- **Form Libraries (React Hook Form / Formik):** Deferred to keep bundle small; built-in hooks are sufficient for initial scope.

## Risks / Trade-offs
- Manual form validation can become repetitive; mitigated by centralizing helpers in a small utility module.
- Token stored in localStorage is susceptible to XSS; mitigated by stringent linting and sanitizing user input, with future option to move to HttpOnly cookies if needed.

## Migration Plan
1. Introduce the new application shell, leaving existing dashboard markup as part of the authenticated landing page.
2. Incrementally replace hardcoded data sources with React Query-powered hooks.
3. Layer in forms and mutations once read flows are stable.
4. Validate by running the Vite build.

## Open Questions
- Do we require additional metadata endpoints (departments, budgets) beyond products/vendors? Pending clarification; forms will accept GUID inputs if data is unavailable.
