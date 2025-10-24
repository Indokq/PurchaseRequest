# Change Proposal 001: Complete Frontend Implementation

## Metadata
- **Status**: Proposed
- **Created**: 2025-01-22
- **Author**: AI Development Team
- **Priority**: High
- **Estimated Effort**: 14-21 days

---

## Problem Statement

### Current State

The **Purchase Request Management System (PRMS)** has a backend API built with .NET 8, featuring:
- ✅ CRUD for PurchaseRequests, Products, Departments, Users (via Auth + Admin role management)
- ✅ Approval workflow endpoints (submit/approve/reject)
- ✅ JWT authentication and Admin/Employee roles
- ✅ SignalR real-time hub at `/hubs/notification`
- ✅ CQRS with MediatR
- ✅ Data validation and error handling
- ✅ Swagger/OpenAPI

However, the frontend implementation is **only 20% complete**.

**✅ Implemented:**
- Authentication pages (Login/Register)
- Dashboard with statistics/charts
- API client setup (axios + React Query)
- SignalR client configuration (partial)
- Tailwind CSS styling

**❌ Missing:**
- Purchase Request Management UI (create/edit/view/submit/approve/reject)
- Product Management UI
- Real-time notifications UI/behaviors
- Admin UI (Users list + role update, Departments CRUD)
- Search/filtering, form validation, error boundaries

**Deferred (no backend controllers yet):**
- Vendor Management
- Budget Tracking

### Business Impact
1. No core functionality exposed to users
2. Backend value not realized without UI
3. No validation loop for backend workflows
4. Poor UX for request/approval processes

### Gap Analysis Summary

| Feature Area | Backend Status | Frontend Status | Gap % |
|--------------|----------------|-----------------|-------|
| Authentication | ✅ Complete | ✅ Complete | 0% |
| Dashboard | ✅ Complete | 🟡 Partial | 40% |
| Purchase Requests | ✅ Complete | ❌ Missing | 100% |
| Products | ✅ Complete | ❌ Missing | 100% |
| Approvals | ✅ Complete | ❌ Missing | 100% |
| Notifications | ✅ Complete | ❌ Missing | 100% |
| User Management | ✅ Partial (list, role update, register) | ❌ Missing | 100% |
| Departments | ✅ Complete | ❌ Missing | 100% |
| Vendors | ❌ Deferred (no controller) | ❌ Missing | 100% |
| Budgets | ❌ Deferred (no controller) | ❌ Missing | 100% |
| **Overall** | **~75%** | **20%** | **55%** |

---

## Proposed Solution

Build a production-ready React frontend aligned to the current backend surface.

### Core Features to Implement

#### 1. Purchase Request Management Module
Purpose: enable employees to create, manage, and track requests; Admins to approve/reject.

Features:
- List: filter by status/date/requester/department; sort; search; simple next/prev pagination (no totalCount)
- Create: multi-step wizard with dynamic line items and product selection
- Edit: modify draft requests
- Detail: full request view with approval timeline and comments
- Submit: draft → pending approval
- Workflow: Admin-only approve/reject with comments/reason (raw string bodies)
- Real-time: refresh/notify via SignalR `ReceiveNotification`
- Export: PDF

User Stories:
- As an employee, I create/submit purchase requests with multiple items
- As an admin, I view pending requests and approve/reject with comments
- As a requester, I track status/history

Status values (string enums from backend): Draft, Submitted, PendingApproval, PartiallyApproved, Approved, Rejected, OnHold, Cancelled, ConvertedToPO, Completed

Note: Vendor selection in line items is deferred (no Vendor API); UI omits vendor dropdown (send no PreferredVendorId).

#### 2. Product Management Module
Purpose: maintain a catalog for line item selection.

Features:
- Catalog list with search, category filter, sorting
- Create/Edit forms
- Detail view; delete (soft)
- Integrate with PR item product selector

Data shape note:
- List/Get: `ProductResponseDto`
- Search: returns domain `Product` (Category is enum value); map to UI type

#### 3. Real-time Notifications System
Purpose: inform users of relevant events.

Features:
- SignalR connection with auto-reconnect
- Notification bell + dropdown; toast notifications
- Types via payload `type` (e.g., "status", "approval", "system") received on `ReceiveNotification`
- Connection status indicator

#### 4. Admin (Users & Departments)
Purpose: administrative configuration.

Features:
- Users: list users; update a user’s single role via `PUT users/{id}/role`; create via Auth/Register; no reset-password/deactivate endpoints in backend – omit from UI
- Departments: list, create, edit, delete (Admin-only writes)

#### Deferred Modules (documented, not implemented)
- Vendors: no API controller; defer directory, CRUD, and PR vendor dropdown
- Budgets: no API controller; defer dashboards, alerts, and reports

### Integration Points

Backend API Integration:
- Use axios client with JWT interceptor
- React Query for caching/optimistic updates
- Friendly error handling

Authentication:
- JWT storage and refresh logic
- Protected routes; role-based UI visibility (Admin vs Employee)
- Auto-logout on 401

Real-time:
- SignalR hub at `/hubs/notification`
- Subscribe to `ReceiveNotification`
- Trigger targeted refetches on events

---

## Technical Approach

### Frontend Architecture

```
frontend/src/
├── api/
│   ├── client.ts
│   ├── signalr.ts
│   └── endpoints.ts
├── types/
│   ├── api.ts
│   └── enums.ts
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── purchase-requests/
│   ├── products/
│   ├── notifications/
│   ├── users/               # Admin: list + role update
│   ├── departments/         # Admin: CRUD
│   └── deferred/            # vendors/, budgets/
├── shared/
└── routes/
```

### Key Technical Patterns

1) API Layer (axios + interceptors)

```typescript
// api/client.ts
export const api = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (e) => { if (e.response?.status === 401) logoutUser(); return Promise.reject(e); }
);
```

2) React Query hooks

```typescript
// features/purchase-requests/hooks/usePurchaseRequests.ts
export const usePurchaseRequests = (filters: PurchaseRequestFilters) =>
  useQuery({ queryKey: ['purchase-requests', filters], queryFn: () => fetchPurchaseRequests(filters), staleTime: 5*60_000, gcTime: 10*60_000 });

// Approve/Reject send raw JSON string bodies
await api.post(`/PurchaseRequest/${id}/approve`, JSON.stringify(comment));
await api.post(`/PurchaseRequest/${id}/reject`, JSON.stringify(reason));
```

3) Forms

```typescript
const PurchaseRequestForm = ({ initialData, onSubmit }) => {
  // controlled components + inline validation
};
```

4) Real-time

```typescript
// api/signalr.ts
const connection = new HubConnectionBuilder().withUrl('/hubs/notification', { accessTokenFactory: getAuthToken }).withAutomaticReconnect().build();
connection.on('ReceiveNotification', (n) => { queryClient.invalidateQueries({ queryKey: ['purchase-requests'] }); showToast(n); });
await connection.start();
```

5) Type Safety (align to backend)

```typescript
// PurchaseRequestDto (read): strings for status/priority/urgency; plus requester/department names
interface PurchaseRequestDto { id: string; requestNumber: string; title: string; description: string; justification?: string; status: string; priority: string; urgency: string; requestDate: string; requiredByDate?: string; totalAmount: number; currency: string; requesterName: string; requesterEmail: string; departmentName: string; currentApprovalLevel: number; items: PurchaseRequestItemDto[]; approvals: ApprovalDto[]; }

// CreatePurchaseRequestDto (write): numeric priority/urgency; no vendor selection for now
interface CreatePurchaseRequestDto { title: string; description: string; justification?: string; priority: number; urgency: number; requiredByDate?: string; departmentId: string; items: { productId?: string; itemName: string; description: string; specification?: string; quantity: number; unit: string; unitPrice: number; /* preferredVendorId?: string */ }[] }
```

Pagination note: list API returns a sliced List without totalCount; use simple next/prev or "Load more" UX.

---

## Implementation Plan

- Phase 1: Foundation (2-3 days)
- Phase 2: Purchase Requests (5-7 days)
- Phase 3: Product Management (2-3 days)
- Phase 4: Real-time Notifications (2-3 days)
- Phase 5: Admin (Users + Departments) (3-4 days)
- Phase 6: Polish & Optimization (2-3 days)

Total: 14–21 days (single dev).

---

## API Integration Details

Base:
- Base URL: `https://localhost:5001/api`
- Auth: Bearer token in Authorization header
- JSON; 30s timeout

Authentication
- POST `/api/Auth/Login` → LoginResponseDto
- POST `/api/Auth/Register` [Admin] → LoginResponseDto

Purchase Requests
- GET `/api/PurchaseRequest`?requesterId&status&fromDate&toDate&pageNumber&pageSize → List<PurchaseRequestDto> (no totalCount)
- GET `/api/PurchaseRequest/{id}` → PurchaseRequestDto
- POST `/api/PurchaseRequest` → PurchaseRequestDto
- PUT `/api/PurchaseRequest/{id}` → 204 No Content
- DELETE `/api/PurchaseRequest/{id}` [Admin] → 204 No Content
- POST `/api/PurchaseRequest/{id}/submit` → { message }
- POST `/api/PurchaseRequest/{id}/approve` [Admin], body: string comments → { message }
- POST `/api/PurchaseRequest/{id}/reject` [Admin], body: string reason → { message }

Products
- GET `/api/Product`?category=... → List<ProductResponseDto>
- GET `/api/Product/{id}` → ProductResponseDto
- GET `/api/Product/search`?query=... → List<Product> (domain entity)
- POST `/api/Product` [Admin] → ProductResponseDto
- PUT `/api/Product/{id}` [Admin] → ProductResponseDto
- DELETE `/api/Product/{id}` [Admin] → 204 No Content

Departments
- GET `/api/Department` → List<DepartmentResponseDto>
- GET `/api/Department/{id}` → DepartmentResponseDto
- POST `/api/Department` [Admin] → DepartmentResponseDto
- PUT `/api/Department/{id}` [Admin] → DepartmentResponseDto
- DELETE `/api/Department/{id}` [Admin] → 204 No Content

User Management (Admin)
- GET `/api/UserManagement/users` → List<UserDto>
- PUT `/api/UserManagement/users/{id}/role` [Admin] → { message }
- GET `/api/UserManagement/roles` [Admin] → List<RoleDto>

SignalR Hub
- URL: `/hubs/notification`
- Client event: `ReceiveNotification(notification)`

---

## UI/UX Requirements

- Keep existing dark theme, responsiveness, accessibility, loading/error states
- Data tables: sortable columns, filter chips, pagination; next/prev or Load more
- Forms: required markers, validation, error messaging; remove vendor dropdown until API exists
- Notifications: bell + dropdown, toasts, unread count, mark-as-read (client-side until API exists)

---

## Acceptance Criteria

Purchase Requests
- [ ] List with filters/search/sort and next/prev or Load more
- [ ] Create request with multiple line items (product selection enabled; vendor selection deferred)
- [ ] Edit drafts; save draft
- [ ] Submit drafts for approval
- [ ] Admins can view pending approvals
- [ ] Admins can approve with optional comments (string body)
- [ ] Admins can reject with required reason (string body)
- [ ] Detail view shows approval timeline
- [ ] Real-time notifications trigger data refresh

Products
- [ ] View catalog; search by name/code/description
- [ ] Filter by category; sort by name/price/created
- [ ] Create/Edit/Delete products (Admin)
- [ ] Product selection available in PR item form
- [ ] Client handles `ProductResponseDto` vs domain `Product` (search)

Admin
- [ ] Users: list users; update single role via PUT; create via Register (Auth)
- [ ] Departments: list/create/edit/delete (Admin-only writes)

Notifications
- [ ] SignalR connects/reconnects; bell shows unread count
- [ ] Dropdown lists recent notifications; toasts on events
- [ ] Receive only `ReceiveNotification`; types handled via payload `type`

Deferred
- [ ] Vendors and Budgets clearly marked as Deferred; no UI dependent on missing APIs

Technical
- [ ] DTOs match backend exactly; no `any` in types
- [ ] React Query used for server state; optimistic updates where applicable
- [ ] Friendly error/loading states; no console errors

---

## Risks and Considerations

- PR list has no totalCount → Use Load more/prev-next; consider backend enhancement
- Product shapes differ (search vs list/get) → Central mapping layer; contract tests
- Approve/Reject bodies are raw strings → Typed helper; examples included
- Roles limited to Admin/Employee → UI conditionals reflect current limitation

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Foundation | 2-3 days |
| Purchase Requests | 5-7 days |
| Product Management | 2-3 days |
| Notifications | 2-3 days |
| Admin (Users/Departments) | 3-4 days |
| Polish & Optimization | 2-3 days |
| **Total** | **14-21 days** |

Assumptions: single developer, backend stable, tests/bugfixes included, reuse existing dashboard style.

Critical Path: Foundation → Purchase Requests → Notifications → Polish.

MVP (if compressed): Week 1 (Foundation + PRs), Week 2 (Products), Week 3 (Notifications + Polish), Admin next.

---

## Next Steps

1) Approve this refined proposal
2) Align acceptance criteria (esp. Admin-only approvals, deferred modules)
3) Create feature branch and begin Phase 1
4) Track progress in project board

---

## Conclusion

This refinement aligns the frontend plan to the current backend surface: Admin-only approvals, single SignalR event, actual DTOs/endpoints, and deferred Vendor/Budget modules. The phased approach (14–21 days) delivers full PR workflows, products, notifications, and core admin screens with production-grade UX, performance, and type safety.
**Recommended Decision**: ✅ **Approve and Begin Phase 1**

---

*For questions or clarifications, please refer to the project documentation in `openspec/project.md` or reach out to the development team.*
