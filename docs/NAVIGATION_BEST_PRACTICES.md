# 🧭 Cross-App Navigation Best Practices for Micro-Frontends

## Overview

Navigation in micro-frontends is challenging because you need to coordinate between independently deployed applications while maintaining a cohesive user experience. This guide provides battle-tested patterns and best practices.

---

## 🎯 Core Principles

### 1. **Single URL Space**

Users should experience one cohesive application with a single, predictable URL structure.

❌ **Bad:**

```
app1.example.com/products
app2.example.com/cart
app3.example.com/checkout
```

✅ **Good:**

```
example.com/products      (Remote 1)
example.com/cart          (Remote 2)
example.com/checkout      (Remote 2)
```

### 2. **Declarative Routing**

Define routes declaratively in a centralized location, not scattered across codebases.

❌ **Bad:**

```typescript
// In Remote 1
window.location.href = "/cart"; // Hardcoded!

// In Remote 2
history.push("/products"); // Doesn't know if route exists
```

✅ **Good:**

```typescript
// shared-types/routes.ts
export const ROUTES = {
  PRODUCTS: "/products",
  CART: "/cart",
} as const;

// Usage anywhere
navigate(ROUTES.CART); // Type-safe, discoverable
```

### 3. **Framework Agnostic Communication**

Navigation events should not depend on the routing library used by individual remotes.

✅ **Good:**

```typescript
// Remote can request navigation without knowing about React Router
eventBus.emit("navigation:request", { path: "/cart" });

// Host handles it with whatever router it uses
eventBus.on("navigation:request", ({ path }) => {
  router.navigate(path); // React Router, Vue Router, etc.
});
```

---

## 📐 Architecture Patterns

### Pattern 1: Centralized Routing (Shell Pattern)

**When to use:** Small to medium teams, tightly integrated UX

```typescript
// host-app/Router.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products/*" element={<Remote1App />} />
    <Route path="/cart" element={<Remote2Cart />} />
  </Routes>
</BrowserRouter>
```

**Pros:**

- Simple mental model
- Easy to reason about
- Good SEO
- Centralized control

**Cons:**

- Host becomes coordinator
- Requires deployment coordination
- Remotes less independent

---

### Pattern 2: Distributed Routing (Multi-SPA)

**When to use:** Large orgs, truly independent teams, different frameworks

```typescript
// Each app manages its own router
Remote 1: /app1/*  → Has own React Router
Remote 2: /app2/*  → Has own Vue Router
Remote 3: /app3/*  → Has own Angular Router
```

**Pros:**

- True independence
- Different frameworks possible
- Deploy anytime

**Cons:**

- Complex URL synchronization
- No shared layouts easily
- SEO challenges
- State management harder

---

### Pattern 3: Hybrid (Recommended)

**When to use:** Most real-world scenarios

```typescript
// Host owns top-level routes
<Route path="/products/*" element={<LazyRemote1 />} />;

// Remote 1 has sub-routes
function Remote1() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path=":id" element={<ProductDetail />} />
    </Routes>
  );
}
```

**Result:**

- `/products` → Remote 1 ProductList
- `/products/123` → Remote 1 ProductDetail

**Pros:**

- Balance of control and independence
- Remotes can evolve their sub-routes
- Host maintains navigation structure
- Works well with Module Federation

**Cons:**

- Requires coordination on top-level routes
- Need to share router context

---

## 🧰 Implementation Strategies

### Strategy 1: Shared Router Instance

Share the router instance from host to remotes via context.

```typescript
// host-app
import { BrowserRouter } from "react-router-dom";

export function Host() {
  return (
    <BrowserRouter>
      <RouterContext.Provider value={router}>
        <App />
      </RouterContext.Provider>
    </BrowserRouter>
  );
}

// remote-app
import { RouterContext } from "host-app/router";

function Remote() {
  const router = useContext(RouterContext);
  router.navigate("/cart"); // Uses host router
}
```

**Pros:** Remotes have direct access to navigation
**Cons:** Tight coupling to host's router implementation

---

### Strategy 2: Event-Based Navigation (Recommended)

Decouple navigation using an event bus.

```typescript
// shared-utils/navigation
export function navigateTo(path: string, options?: NavigateOptions) {
  eventBus.emit("navigation:request", { path, ...options });
}

// host-app
eventBus.on("navigation:request", ({ path, replace, state }) => {
  navigate(path, { replace, state });
});

// remote-app
import { navigateTo } from "shared-utils/navigation";
navigateTo("/cart"); // No dependency on router!
```

**Pros:**

- Loose coupling
- Framework agnostic
- Easy to add logging/analytics
- Can add middleware (auth checks, etc.)

**Cons:**

- Async (usually fine)
- Need to handle errors

---

### Strategy 3: Custom Navigation Hook

Provide a consistent API across all apps.

```typescript
// shared-utils/useNavigation.ts
export function useNavigation() {
  const reactRouter = useNavigate(); // If available

  return {
    navigate: (path: string) => {
      if (reactRouter) {
        reactRouter(path);
      } else {
        // Fallback to event bus
        eventBus.emit("navigation:request", { path });
      }
    },
    goBack: () => window.history.back(),
    currentPath: window.location.pathname,
  };
}

// Usage in any app
const { navigate } = useNavigation();
navigate("/products");
```

**Pros:**

- Consistent API
- Works in host and remotes
- Can add features centrally

---

## 🎨 Navigation UI Patterns

### Pattern 1: Shared Navigation Component

Export navigation from host, use everywhere.

```typescript
// host-app/components/Navigation.tsx
export function Navigation() {
  return (
    <nav>
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.PRODUCTS}>Products</Link>
      <Link to={ROUTES.CART}>Cart</Link>
    </nav>
  );
}

// Module Federation
exposes: {
  './Navigation': './src/components/Navigation'
}

// In any remote
const Navigation = lazy(() => import('host-app/Navigation'));
```

---

### Pattern 2: Dynamic Navigation

Build navigation from route config.

```typescript
// shared-types/routes.ts
export const NAVIGATION_CONFIG = [
  { path: "/", label: "Home", icon: "home" },
  { path: "/products", label: "Products", icon: "shopping" },
  { path: "/cart", label: "Cart", icon: "cart", badge: "cartCount" },
];

// Navigation component
function Navigation() {
  return (
    <nav>
      {NAVIGATION_CONFIG.map((item) => (
        <NavLink key={item.path} to={item.path}>
          <Icon name={item.icon} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
```

---

## 🔒 Advanced Patterns

### 1. Route Guards (Authentication)

```typescript
// host-app/Router.tsx
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requiredRole="admin">
      <LazyAdminApp />
    </ProtectedRoute>
  }
/>;
```

---

### 2. Lazy Route Preloading

Preload routes before user clicks.

```typescript
// Preload on hover
function NavLink({ to, children }) {
  const preloadRoute = () => {
    // Trigger lazy import without navigating
    if (to === "/products") {
      import("remote1/routes"); // Start loading
    }
  };

  return (
    <Link to={to} onMouseEnter={preloadRoute}>
      {children}
    </Link>
  );
}
```

---

### 3. Nested Layouts

Share layouts across routes.

```typescript
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products/*" element={<Remote1 />} />
        <Route path="cart" element={<Remote2 />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="admin/*" element={<AdminRemote />} />
      </Route>
    </Routes>
  );
}
```

---

### 4. State Preservation During Navigation

Keep state when navigating between routes.

```typescript
// Persist important state to Redux/LocalStorage before navigation
function ProductDetail() {
  const saveState = () => {
    dispatch(saveScrollPosition(window.scrollY));
    dispatch(saveFormData(formValues));
  };

  return (
    <Link to="/cart" onClick={saveState}>
      Add to Cart
    </Link>
  );
}

// Restore on mount
useEffect(() => {
  const savedScroll = selectScrollPosition(state);
  window.scrollTo(0, savedScroll);
}, []);
```

---

## 🚫 Common Pitfalls

### ❌ Pitfall 1: Hardcoded URLs

```typescript
// BAD
onClick={() => window.location.href = '/products'}

// GOOD
onClick(() => navigate(ROUTES.PRODUCTS)}
```

---

### ❌ Pitfall 2: Full Page Reloads

```typescript
// BAD
<a href="/products">Products</a>

// GOOD
<Link to="/products">Products</Link>
```

---

### ❌ Pitfall 3: Ignoring Browser History

```typescript
// BAD - User can't use back button
window.history.replaceState(null, "", "/products");

// GOOD - Adds to history
navigate("/products");
```

---

### ❌ Pitfall 4: No 404 Handling

```typescript
// BAD - No catch-all route

// GOOD
<Route path="*" element={<NotFound />} />
```

---

### ❌ Pitfall 5: Not Handling Async Loading

```typescript
// BAD - No loading state
const RemoteApp = lazy(() => import('remote1/App'));
<RemoteApp /> // Blank screen while loading!

// GOOD
<Suspense fallback={<LoadingSpinner />}>
  <RemoteApp />
</Suspense>
```

---

## 📊 Decision Matrix

| Criteria     | Centralized | Distributed | Hybrid           |
| ------------ | ----------- | ----------- | ---------------- |
| Team Size    | Small       | Large       | Medium           |
| Independence | Low         | High        | Medium           |
| SEO          | ⭐⭐⭐      | ⭐          | ⭐⭐⭐           |
| Complexity   | Low         | High        | Medium           |
| Frameworks   | Same        | Different   | Same Preferred   |
| Deployment   | Coordinated | Independent | Semi-Independent |

---

## 🎓 Recommendations for Your Project

Based on your current setup (Vite Module Federation, Redux, Event Bus):

1. ✅ **Use Hybrid Pattern**: Host owns top-level routes, remotes can have sub-routes
2. ✅ **Event-Based Navigation**: Leverage your existing event bus
3. ✅ **Type-Safe Routes**: Create `shared-types` package with route constants
4. ✅ **React Router v6+**: Modern, well-supported, works great with lazy loading
5. ✅ **Centralized Navigation Component**: Export from host for consistency

---

## 📚 Further Reading

- [React Router - Micro Frontends](https://reactrouter.com/en/main/start/overview)
- [Module Federation - Navigation Patterns](https://module-federation.io/)
- [Martin Fowler - Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Micro-frontend Decisions Framework](https://micro-frontends.org/)

---

## 🎯 Quick Start Checklist

- [ ] Choose routing pattern (Hybrid recommended)
- [ ] Create `shared-types` package for routes
- [ ] Install React Router in host
- [ ] Set up event-based navigation in event bus
- [ ] Create `NavigationProvider` in host
- [ ] Update remotes to export route components
- [ ] Add navigation UI component
- [ ] Test deep linking
- [ ] Test browser back/forward
- [ ] Add 404 page
- [ ] Document route conventions for team

---

> [!TIP]
> Start simple! Begin with just 2-3 routes and gradually expand. Navigation is easier to refactor than state management.
