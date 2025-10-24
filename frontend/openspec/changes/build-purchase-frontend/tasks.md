## 1. Foundations
- [ ] 1.1 Configure an axios API client with JWT storage and error handling hooks.
- [ ] 1.2 Introduce React Query provider, query keys, and mutation utilities.
- [ ] 1.3 Establish application routing, protected layout, and shared UI shell.

## 2. Authentication
- [ ] 2.1 Build a login screen that posts to `/api/Auth/Login`, handles failures, and persists the token.
- [ ] 2.2 Guard authenticated routes, refreshing UI state when the token expires or is removed.

## 3. Purchase Requests
- [ ] 3.1 Implement list and detail views backed by `GET /api/PurchaseRequest` and `GET /api/PurchaseRequest/{id}`.
- [ ] 3.2 Create request form enabling POST of purchase requests with dynamic line items.
- [ ] 3.3 Support editing via `PUT /api/PurchaseRequest/{id}` with preloaded data.
- [ ] 3.4 Wire delete handling that calls `DELETE /api/PurchaseRequest/{id}` and invalidates caches.

## 4. Reference Data
- [ ] 4.1 Fetch vendors and products for selectors in the purchase request form.

## 5. Validation
- [ ] 5.1 Provide client-side validation states and surface API errors to the user.

## 6. Verification
- [ ] 6.1 Run frontend build/tests to ensure the UI compiles successfully.
