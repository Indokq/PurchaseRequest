# Technical Design: Complete Frontend UI

## Context

The Purchase Request Management System has a fully functional .NET 8 backend API following Clean Architecture principles. The frontend needs to match this architectural rigor with a clean, scalable, maintainable implementation that supports future growth.

**Key Constraints**:
- Must integrate with existing JWT authentication
- Backend uses Guid primary keys (not integers)
- All API responses follow DTO patterns
- SignalR available for real-time features
- TailwindCSS already configured
- React 18 + TypeScript 5.3 stack

**Stakeholders**:
- End users (employees creating purchase requests)
- Approvers (managers/directors/CFOs)
- Administrators (system management)
- Developers (maintainability and extensibility)

## Goals / Non-Goals

### Goals
1. **Complete API Coverage** - Every backend endpoint has a corresponding UI
2. **Clean Code Architecture** - Frontend follows microservices/domain-driven patterns
3. **Type Safety** - Full TypeScript coverage with strict mode
4. **Performance** - Fast initial load (<3s), smooth interactions
5. **Accessibility** - WCAG 2.1 Level AA compliance
6. **Maintainability** - Easy to understand, modify, and extend
7. **Testability** - High test coverage with clear testing patterns

### Non-Goals
- Mobile native apps (PWA sufficient)
- Offline-first architecture (online-first with graceful degradation)
- Multi-tenancy (single tenant system)
- Internationalization (English only initially)
- Theming system (single theme initially)

## Architecture

### High-Level Pattern: Frontend Microservices

We adopt a **feature-based architecture** (vertical slices) inspired by microservices principles:

```
frontend/src/
├── features/                   # Bounded contexts (microservices analogy)
│   ├── auth/                   # Authentication domain
│   │   ├── components/         # Feature-specific UI
│   │   ├── hooks/              # Business logic
│   │   ├── services/           # API client
│   │   └── types/              # Domain types
│   ├── purchase-requests/      # Purchase request domain
│   ├── products/               # Product catalog domain
│   ├── departments/            # Department management domain
│   ├── users/                  # User management domain
│   └── admin/                  # Admin tools domain
├── shared/                     # Cross-cutting concerns
│   ├── components/             # Reusable UI primitives
│   ├── hooks/                  # Shared business logic
│   ├── types/                  # Common types
│   ├── utils/                  # Helper functions
│   └── constants/              # App-wide constants
├── services/                   # Infrastructure services
│   ├── api/                    # HTTP client layer
│   └── signalr/                # Real-time communication
├── layouts/                    # Page layouts
└── routes/                     # Routing configuration
```

**Benefits**:
- **Separation of Concerns** - Each feature is self-contained
- **Parallel Development** - Teams can work on different features independently
- **Easy Testing** - Test features in isolation
- **Clear Boundaries** - Explicit dependencies between domains
- **Scalability** - Easy to add new features without affecting existing ones

### Layered Architecture Within Features

Each feature follows a 3-layer pattern:

```
Component Layer (UI)
      ↓
Business Logic Layer (Hooks)
      ↓
Data Access Layer (Services)
```

**Example: Purchase Requests**
```
PurchaseRequestListPage.tsx       // UI Component
  ↓ uses
usePurchaseRequests()             // Business Logic Hook
  ↓ uses
purchaseRequestService.getAll()   // API Service
```

## Key Design Decisions

### Decision 1: TanStack Query for Server State

**Choice**: Use TanStack Query (React Query) v5 for all server state management.

**Rationale**:
- Automatic caching with intelligent invalidation
- Built-in loading/error states
- Optimistic updates support
- Request deduplication
- Background refetching
- Pagination and infinite scroll support

**Alternative Considered**: Redux Toolkit Query
- **Rejected because**: More boilerplate, tighter coupling with Redux

**Implementation Pattern**:
```typescript
// Custom hook wrapping TanStack Query
export function usePurchaseRequests(filters?: PurchaseRequestFilters) {
  return useQuery({
    queryKey: ['purchaseRequests', filters],
    queryFn: () => purchaseRequestService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Decision 2: Axios for HTTP Client

**Choice**: Axios with interceptors for authentication and error handling.

**Rationale**:
- Request/response interceptors for cross-cutting concerns
- Automatic JSON transformation
- Request cancellation support
- Browser and Node.js compatibility
- Widely adopted and battle-tested

**Alternative Considered**: Fetch API
- **Rejected because**: No built-in interceptors, less features

**Implementation Pattern**:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Request interceptor: Inject auth token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### Decision 3: Service Layer Pattern

**Choice**: Dedicated service modules per domain with typed methods.

**Rationale**:
- Single source of truth for API calls
- Easy to mock in tests
- Centralized request/response transformation
- Type-safe API contracts

**Implementation Pattern**:
```typescript
// services/api/purchaseRequestService.ts
export const purchaseRequestService = {
  async getAll(filters?: PurchaseRequestFilters): Promise<PurchaseRequestDto[]> {
    const { data } = await api.get('/PurchaseRequest', { params: filters });
    return data;
  },
  
  async getById(id: string): Promise<PurchaseRequestDto> {
    const { data } = await api.get(`/PurchaseRequest/${id}`);
    return data;
  },
  
  async create(request: CreatePurchaseRequestDto): Promise<PurchaseRequestDto> {
    const { data } = await api.post('/PurchaseRequest', request);
    return data;
  },
  
  async approve(id: string, comments?: string): Promise<void> {
    await api.post(`/PurchaseRequest/${id}/approve`, comments);
  },
};
```

### Decision 4: Zod for Runtime Validation

**Choice**: Use Zod for form validation and runtime type checking.

**Rationale**:
- TypeScript-first schema validation
- Infer TypeScript types from schemas
- Excellent error messages
- Composable schemas
- Works seamlessly with React Hook Form

**Alternative Considered**: Yup
- **Rejected because**: Less TypeScript integration, larger bundle

**Implementation Pattern**:
```typescript
import { z } from 'zod';

const purchaseRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  departmentId: z.string().uuid(),
  budgetId: z.string().uuid().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })).min(1, 'At least one item is required'),
});

type PurchaseRequestFormData = z.infer<typeof purchaseRequestSchema>;
```

### Decision 5: Compound Components for Complex UI

**Choice**: Use compound component pattern for complex, configurable components.

**Rationale**:
- Flexible API without prop explosion
- Clear component hierarchy
- Shared context between related components
- Better TypeScript support

**Example**:
```typescript
<Modal>
  <Modal.Header>
    <Modal.Title>Confirm Approval</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to approve this purchase request?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="primary" onClick={onConfirm}>
      Approve
    </Button>
  </Modal.Footer>
</Modal>
```

### Decision 6: Atomic Design for Component Library

**Choice**: Organize shared components using Atomic Design principles.

**Structure**:
- **Atoms**: Button, Input, Label, Badge (single-purpose, indivisible)
- **Molecules**: FormField (Label + Input + Error), SearchBar (Input + Icon)
- **Organisms**: DataTable, Modal, Navigation (complex, feature-complete)
- **Templates**: MainLayout, AuthLayout (page structure)

**Rationale**:
- Clear component hierarchy
- Easy to locate components
- Promotes reusability
- Consistent design system

### Decision 7: Protected Routes with Role-Based Access

**Choice**: Implement route guards with role checking at the routing level.

**Implementation Pattern**:
```typescript
function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

// Usage in routes
<Route path="/admin" element={
  <ProtectedRoute requiredRole="Admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Decision 8: Optimistic Updates for Better UX

**Choice**: Implement optimistic updates for mutation operations.

**Rationale**:
- Instant UI feedback
- Better perceived performance
- Automatic rollback on error

**Implementation Pattern**:
```typescript
const approveMutation = useMutation({
  mutationFn: (id: string) => purchaseRequestService.approve(id),
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries(['purchaseRequests']);
    
    // Snapshot the previous value
    const previous = queryClient.getQueryData(['purchaseRequests']);
    
    // Optimistically update
    queryClient.setQueryData(['purchaseRequests'], (old: PurchaseRequestDto[]) =>
      old.map(pr => pr.id === id ? { ...pr, status: 'Approved' } : pr)
    );
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['purchaseRequests'], context?.previous);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries(['purchaseRequests']);
  },
});
```

## Component Design Patterns

### 1. Container/Presenter Pattern

**Usage**: Complex feature components with business logic.

**Container** (smart component):
- Fetches data
- Manages state
- Handles user interactions
- Contains business logic

**Presenter** (dumb component):
- Receives data via props
- Purely presentational
- No API calls or complex logic
- Highly reusable

**Example**:
```typescript
// Container
function PurchaseRequestListPage() {
  const { data, isLoading, error } = usePurchaseRequests();
  const [filters, setFilters] = useState<Filters>({});
  
  return (
    <PurchaseRequestList
      purchaseRequests={data}
      isLoading={isLoading}
      error={error}
      onFilterChange={setFilters}
    />
  );
}

// Presenter
function PurchaseRequestList({ purchaseRequests, isLoading, onFilterChange }: Props) {
  return (
    <div>
      <FilterSidebar onChange={onFilterChange} />
      <DataTable data={purchaseRequests} loading={isLoading} />
    </div>
  );
}
```

### 2. Custom Hooks for Reusable Logic

**Usage**: Share business logic across components.

**Examples**:
- `useAuth()` - Authentication state and methods
- `usePagination()` - Pagination logic
- `useDebounce()` - Debounced search
- `usePermission()` - Permission checking

### 3. Render Props for Flexible Composition

**Usage**: Share code between components while being flexible about rendering.

**Example**:
```typescript
function DataTable<T>({ data, renderRow }: { data: T[]; renderRow: (item: T) => ReactNode }) {
  return (
    <table>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>{renderRow(item)}</tr>
        ))}
      </tbody>
    </table>
  );
}

// Usage
<DataTable
  data={purchaseRequests}
  renderRow={(pr) => (
    <>
      <td>{pr.requestNumber}</td>
      <td>{pr.title}</td>
      <td><StatusBadge status={pr.status} /></td>
    </>
  )}
/>
```

## State Management Strategy

### Server State: TanStack Query
- Purchase requests
- Products
- Departments
- Users
- All data from API

### UI State: React Context
- Theme preferences (future)
- Sidebar collapsed/expanded
- Notification preferences
- User preferences

### Local Component State: useState
- Form inputs
- Modal open/closed
- Accordion expanded/collapsed
- Filter selections (before applying)

## Error Handling Strategy

### 1. Error Boundaries

Catch React component errors:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 2. API Error Handling

Centralized in axios interceptor + TanStack Query error handling:

```typescript
// Service layer
try {
  const { data } = await api.get('/endpoint');
  return data;
} catch (error) {
  throw transformApiError(error); // Normalize error format
}

// Component
const { data, error } = useQuery({
  queryFn: () => service.getData(),
  onError: (err) => {
    toast.error(err.message);
  },
});
```

### 3. Form Validation Errors

Handled by Zod + React Hook Form:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## Performance Optimizations

### 1. Code Splitting

Route-based splitting with React.lazy:

```typescript
const PurchaseRequestListPage = lazy(() => import('./features/purchase-requests/PurchaseRequestListPage'));

<Route path="/purchase-requests" element={
  <Suspense fallback={<LoadingSpinner />}>
    <PurchaseRequestListPage />
  </Suspense>
} />
```

### 2. Memoization

- `React.memo` for expensive component renders
- `useMemo` for expensive calculations
- `useCallback` for stable function references

### 3. Virtual Scrolling

For large lists (>1000 items), use `react-virtual`:

```typescript
import { useVirtual } from 'react-virtual';

const rowVirtualizer = useVirtual({
  size: items.length,
  parentRef: scrollRef,
  estimateSize: () => 50,
});
```

### 4. Image Optimization

- Lazy loading with `loading="lazy"`
- Responsive images with `srcset`
- WebP format with fallback

## Testing Strategy

### Unit Tests (Jest + Testing Library)

**Target**: Services, hooks, utilities
**Coverage Goal**: >90%

```typescript
describe('purchaseRequestService', () => {
  it('should fetch all purchase requests', async () => {
    const requests = await purchaseRequestService.getAll();
    expect(requests).toHaveLength(10);
  });
});
```

### Component Tests (React Testing Library)

**Target**: UI components
**Coverage Goal**: >80%

```typescript
describe('<Button />', () => {
  it('should show loading spinner when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

### Integration Tests

**Target**: User workflows
**Coverage Goal**: Critical paths

```typescript
describe('Purchase Request Workflow', () => {
  it('should create, submit, and approve a PR', async () => {
    // Create PR
    // Submit PR
    // Login as admin
    // Approve PR
    // Verify status changed
  });
});
```

## Accessibility Guidelines

1. **Semantic HTML** - Use correct HTML elements
2. **Keyboard Navigation** - All interactive elements accessible via keyboard
3. **ARIA Labels** - Proper labels for screen readers
4. **Color Contrast** - WCAG AA standards (4.5:1 for normal text)
5. **Focus Management** - Visible focus indicators, trap focus in modals
6. **Error Announcements** - Use ARIA live regions for dynamic content

## Migration Plan

**Phase 1**: Infrastructure (Week 1)
- Set up service layer
- Configure TanStack Query
- Create type definitions

**Phase 2**: Shared Components (Week 2)
- Build component library
- Add Storybook (optional)

**Phase 3**: Feature Development (Weeks 3-6)
- Purchase Requests
- Products
- Departments
- Users
- Admin Dashboard

**Phase 4**: Testing & QA (Week 7)
- Unit tests
- Component tests
- Accessibility audit
- Performance optimization

**Phase 5**: Deployment (Week 8)
- Final integration
- Documentation
- Production deployment

## Risks & Trade-offs

### Risk 1: Large Initial Bundle Size
**Mitigation**: Aggressive code splitting, lazy loading, tree shaking

### Risk 2: Complex State Management
**Mitigation**: Clear patterns, good documentation, training

### Risk 3: TypeScript Strict Mode Learning Curve
**Mitigation**: Pair programming, code reviews, gradual adoption

### Risk 4: Over-Engineering
**Mitigation**: Start simple, refactor when needed, YAGNI principle

## Open Questions

1. **Storybook for Component Library?** - Nice to have but adds complexity
2. **E2E Testing with Playwright?** - Recommended for critical workflows
3. **Design System Documentation?** - Can use Storybook or custom docs
4. **Monitoring/Analytics?** - Future consideration (Sentry, Google Analytics)
5. **Feature Flags?** - Useful for gradual rollouts
