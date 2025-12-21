# Cross-App Navigation Strategy - Implementation Plan

> [!NOTE]
> This plan addresses the current gap in your micro-frontend architecture: **No routing or cross-app navigation strategy**. Currently, your apps only share components but lack the ability to navigate between different views or routes across micro-frontends.

## Current State

Your micro-frontend architecture currently has:

- ✅ Module Federation with Vite
- ✅ Component sharing (Button, Cart)
- ✅ Shared state (Redux)
- ✅ Event bus for cross-app communication
- ❌ **No routing infrastructure**
- ❌ **No navigation strategy**
- ❌ **No URL synchronization**

## Best Practices for Cross-App Navigation

### 1. **Centralized Routing (Recommended)**

The host app owns the router and orchestrates all navigation. Remote apps are route-based and don't manage their own routes.

**Pros:**

- Single source of truth for navigation
- Better SEO (one URL space)
- Easier deep linking
- Simpler browser history management

**Cons:**

- Host app needs to know about remote routes
- Tighter coupling between host and remotes

### 2. **Distributed Routing**

Each micro-frontend manages its own routing independently, typically using path prefixes (e.g., `/app1/*`, `/app2/*`).

**Pros:**

- True independence
- Teams can deploy separately
- No central coordination needed

**Cons:**

- Complex URL synchronization
- Harder to maintain consistent navigation
- Potential routing conflicts

### 3. **Hybrid Approach (Best for Your Case)**

Host controls top-level routes and orchestrates which remote to load. Remotes can optionally have their own sub-routes.

**Key Principles:**

- Host app owns the router (React Router in root)
- Routes trigger lazy-loading of remote modules
- Remotes expose route components, not full apps
- Shared navigation state via event bus + Redux
- Type-safe route definitions

## User Review Required

> [!IMPORTANT] > **Routing Strategy Choice**: This plan implements the **Hybrid Approach** which provides the best balance for your current setup. The host will manage top-level routes while allowing remotes to have internal navigation.

> [!WARNING] > **Breaking Change**: This requires modifying how remote apps are structured. They will need to export route-based components instead of just individual components.

## Proposed Changes

### Phase 1: Core Routing Infrastructure

---

#### [NEW] [shared-types](file:///d:/Projects/mirco-frontend/shared-types)

A new package to share type-safe route definitions across all apps.

**Files to create:**

- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration
- `src/routes.ts` - Centralized route definitions
- `src/navigation.ts` - Navigation types and helpers

**Purpose**: Ensures all apps use the same route definitions and navigation patterns.

---

### Phase 2: Host App Routing Setup

---

#### [MODIFY] [package.json](file:///d:/Projects/mirco-frontend/host-app/package.json)

Add React Router dependencies:

```json
"react-router-dom": "^7.1.1",
"@types/react-router-dom": "^5.3.3"
```

#### [NEW] [Router.tsx](file:///d:/Projects/mirco-frontend/host-app/src/Router.tsx)

Main routing configuration that:

- Defines all top-level routes
- Lazy loads remote apps based on routes
- Provides navigation context to all apps
- Handles 404 and error routes

#### [NEW] [navigation/NavigationProvider.tsx](file:///d:/Projects/mirco-frontend/host-app/src/navigation/NavigationProvider.tsx)

Context provider that:

- Exposes navigation helpers to all components
- Integrates with event bus for cross-app navigation
- Provides type-safe navigation methods
- Manages browser history

#### [NEW] [navigation/useNavigation.tsx](file:///d:/Projects/mirco-frontend/host-app/src/navigation/useNavigation.tsx)

Custom hook for navigation:

```typescript
const { navigate, currentRoute, goBack } = useNavigation();
navigate("/remote1/products");
```

#### [MODIFY] [App.tsx](file:///d:/Projects/mirco-frontend/host-app/src/App.tsx)

Update to integrate router:

- Wrap app with `BrowserRouter`
- Add `NavigationProvider`
- Replace manual component mounting with route-based loading

#### [MODIFY] [main.tsx](file:///d:/Projects/mirco-frontend/host-app/src/main.tsx)

Ensure router is properly initialized at app entry point.

---

### Phase 3: Remote App Route Components

---

#### [MODIFY] [remote-app-1/package.json](file:///d:/Projects/mirco-frontend/remote-app-1/package.json)

Add routing dependencies (as devDependencies since host provides them):

```json
"devDependencies": {
  "react-router-dom": "^7.1.1"
}
```

#### [NEW] [remote-app-1/src/routes/ProductsRoute.tsx](file:///d:/Projects/mirco-frontend/remote-app-1/src/routes/ProductsRoute.tsx)

Example route component that can handle sub-navigation within Remote App 1.

#### [NEW] [remote-app-1/src/routes/index.tsx](file:///d:/Projects/mirco-frontend/remote-app-1/src/routes/index.tsx)

Main router for Remote App 1 that exports all route components:

```typescript
export { ProductsRoute } from "./ProductsRoute";
export { default as Remote1Router } from "./Remote1Router";
```

#### [MODIFY] [remote-app-1/vite.config.ts](file:///d:/Projects/mirco-frontend/remote-app-1/vite.config.ts)

Update Module Federation config to expose routes:

```typescript
exposes: {
  './Button': './src/components/Button',
  './routes': './src/routes/index.tsx'  // NEW
}
```

---

#### [MODIFY] [remote-app-2/package.json](file:///d:/Projects/mirco-frontend/remote-app-2/package.json)

Add routing dependencies (same as remote-app-1).

#### [NEW] [remote-app-2/src/routes/CartRoute.tsx](file:///d:/Projects/mirco-frontend/remote-app-2/src/routes/CartRoute.tsx)

Route component for cart page.

#### [NEW] [remote-app-2/src/routes/CheckoutRoute.tsx](file:///d:/Projects/mirco-frontend/remote-app-2/src/routes/CheckoutRoute.tsx)

Route component for checkout page (demonstrates sub-routing).

#### [NEW] [remote-app-2/src/routes/index.tsx](file:///d:/Projects/mirco-frontend/remote-app-2/src/routes/index.tsx)

Main router export for Remote App 2.

#### [MODIFY] [remote-app-2/vite.config.ts](file:///d:/Projects/mirco-frontend/remote-app-2/vite.config.ts)

Update Module Federation config to expose routes.

---

### Phase 4: Shared Navigation Utilities

---

#### [NEW] [shared-utils/src/navigation/eventNavigation.ts](file:///d:/Projects/mirco-frontend/shared-utils/src/navigation/eventNavigation.ts)

Navigation helpers that work via event bus:

- `navigateTo(path)` - Navigate from any remote
- `subscribeToNavigation(callback)` - Listen for navigation events
- Integrates with existing event bus

#### [MODIFY] [shared-utils/vite.config.ts](file:///d:/Projects/mirco-frontend/shared-utils/vite.config.ts)

Expose navigation utilities:

```typescript
exposes: {
  './hooks': './src/hooks/index.ts',
  './utils': './src/utils/index.ts',
  './eventBus': './src/eventBus/index.ts',
  './navigation': './src/navigation/eventNavigation.ts'  // NEW
}
```

---

### Documentation

#### [NEW] [docs/NAVIGATION_GUIDE.md](file:///d:/Projects/mirco-frontend/docs/NAVIGATION_GUIDE.md)

Comprehensive guide covering:

- Navigation architecture overview
- How to add new routes
- How to navigate from remotes
- Best practices and patterns
- Troubleshooting common issues

#### [MODIFY] [MICRO_FRONTEND_ANALYSIS.md](file:///d:/Projects/mirco-frontend/docs/MICRO_FRONTEND_ANALYSIS.md)

Update to reflect that navigation is now implemented.

---

## Implementation Details

### Route Structure

```
/                          → Host App Home
/remote1                   → Remote App 1 Landing
/remote1/products          → Remote App 1 Products
/remote1/products/:id      → Remote App 1 Product Detail
/remote2                   → Remote App 2 Landing
/remote2/cart              → Remote App 2 Cart
/remote2/checkout          → Remote App 2 Checkout
```

### Navigation Patterns

**1. From Host to Remote:**

```typescript
// Using hook
const { navigate } = useNavigation();
navigate("/remote1/products");

// Using Link component
<Link to="/remote1/products">View Products</Link>;
```

**2. From Remote to Remote:**

```typescript
// Via shared navigation utility
import { navigateTo } from "shared-utils/navigation";
navigateTo("/remote2/cart");

// Or via event bus
eventBus.emit("navigation:request", { path: "/remote2/cart" });
```

**3. Within Remote (Sub-routing):**

```typescript
// Use React Router hooks directly
const navigate = useNavigate();
navigate("products/123"); // Relative path
```

### Type Safety

All routes will be defined in `shared-types`:

```typescript
export const ROUTES = {
  HOME: "/",
  REMOTE1: {
    ROOT: "/remote1",
    PRODUCTS: "/remote1/products",
    PRODUCT_DETAIL: (id: string) => `/remote1/products/${id}`,
  },
  REMOTE2: {
    ROOT: "/remote2",
    CART: "/remote2/cart",
    CHECKOUT: "/remote2/checkout",
  },
} as const;
```

Usage:

```typescript
import { ROUTES } from "shared-types/routes";
navigate(ROUTES.REMOTE1.PRODUCTS); // Type-safe!
```

## Verification Plan

### Automated Tests

Since there are currently no tests in your project, I will create a basic test setup:

**1. Create Host App Navigation Tests**

```bash
# Install testing dependencies first
cd host-app
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Run tests
npm run test
```

Create `host-app/src/navigation/__tests__/navigation.test.tsx`:

- Test route rendering
- Test navigation between routes
- Test lazy loading of remotes
- Test 404 handling

**2. Integration Test**

Create `host-app/src/__tests__/routing-integration.test.tsx`:

- Test full navigation flow from host → remote1 → remote2
- Test browser back/forward buttons
- Test direct URL access

### Manual Verification

**1. Navigation Flow Test**

- Start all apps: Run `npm run dev` in root (or individual dev servers)
- Open browser: `http://localhost:5000`
- Test navigation:
  - Click navigation links to go to Remote 1
  - Verify URL changes to `/remote1`
  - Click link to Products page
  - Verify URL changes to `/remote1/products`
  - Click to go to Remote 2 Cart
  - Verify URL changes to `/remote2/cart`
  - Use browser back button
  - Verify navigation history works correctly

**2. Deep Linking Test**

- Directly navigate to: `http://localhost:5000/remote1/products`
- Verify Remote App 1 products page loads correctly
- Navigate to: `http://localhost:5000/remote2/cart`
- Verify Remote App 2 cart loads correctly

**3. Error Handling Test**

- Navigate to invalid route: `http://localhost:5000/invalid-route`
- Verify 404 page displays
- Verify navigation still works after error

**4. Cross-App Navigation Test**

- From Remote App 1, trigger navigation to Remote App 2
- Verify event bus navigation works
- Check console for any errors
- Verify URL updates correctly

### Success Criteria

- ✅ All routes load their corresponding remote modules
- ✅ Browser URL updates on navigation
- ✅ Browser back/forward buttons work
- ✅ Deep linking works (refresh on any route)
- ✅ Navigation from remote to remote works
- ✅ 404 page displays for invalid routes
- ✅ No console errors
- ✅ Type-safe navigation throughout

## Additional Benefits

Once implemented, this navigation strategy will enable:

1. **Better UX**: Users can bookmark specific pages, share URLs
2. **SEO**: Each route can have its own meta tags and title
3. **Analytics**: Track page views and user journeys
4. **A/B Testing**: Route-based feature flags
5. **Lazy Loading**: Load remotes only when needed
6. **State Preservation**: Navigate without losing app state

## Next Steps After Implementation

1. Add route-level code splitting
2. Implement route guards (authentication)
3. Add loading states during navigation
4. Set up route-based analytics
5. Add breadcrumbs navigation component
6. Implement route prefetching for better performance
