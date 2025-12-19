# Error Boundary Implementation - Testing Guide

This document provides examples and instructions for testing the error boundary implementation in your micro-frontend application.

## 🎯 What Was Implemented

### Phase 2 (Recommended) - Complete ✅

1. **Core Error Boundaries**

   - `RemoteModuleErrorBoundary` - Wraps remote modules
   - `AppErrorBoundary` - Top-level application boundary
   - `ErrorFallback` - User-friendly error UI

2. **Error Logging**

   - Centralized error logger with module context
   - Error statistics and tracking
   - Development vs production modes

3. **Retry Mechanism**

   - Automatic retry with exponential backoff
   - Configurable retry limits
   - User-initiated retry

4. **Circuit Breaker Pattern**

   - Module health tracking
   - Automatic blocking of repeatedly failing modules
   - Manual circuit breaker reset

5. **Convenience Wrapper**
   - `RemoteComponentWrapper` - Combines Suspense + ErrorBoundary

---

## 📁 File Structure

```
host-app/src/
├── components/
│   ├── AppErrorBoundary.tsx          # Top-level error boundary
│   ├── RemoteModuleErrorBoundary.tsx # Module-specific error boundary
│   ├── RemoteComponentWrapper.tsx    # Convenience wrapper
│   ├── ErrorFallback.tsx             # Error UI component
│   └── ErrorFallback.css             # Error UI styling
├── utils/
│   ├── errorLogger.ts                # Centralized error logging
│   └── moduleRegistry.ts             # Module health & circuit breaker
├── config/
│   └── errorBoundary.config.ts       # Configuration settings
└── errorBoundary.exports.ts          # Convenient exports
```

---

## 🧪 Testing Scenarios

### Test 1: Module Load Failure

**Simulate a remote module that fails to load:**

1. **Temporarily break the remote URL:**

```typescript
// In host-app/vite.config.ts
// Change the remote URL to an invalid address
remotes: {
  'remote-app-1': 'http://localhost:9999/assets/remoteEntry.js', // Invalid port
}
```

2. **Start the host app:**

```bash
cd host-app
npm run dev
```

3. **Expected Result:**
   - ✅ Error boundary catches the load failure
   - ✅ Shows "Module Load Error" fallback UI
   - ✅ Retry button is available
   - ✅ Other remotes (remote-app-2) continue working
   - ✅ Error is logged to console (dev mode)

---

### Test 2: Runtime Error in Remote Component

**Simulate a component crash:**

1. **Add an intentional error in Remote1Button:**

```typescript
// In remote-app-1/src/components/Button.tsx
export default function Button({ label, onClick }: ButtonProps) {
  // Add this line to simulate a runtime error
  throw new Error("Intentional test error in Button component");

  return (
    <button onClick={onClick} className="custom-button">
      {label}
    </button>
  );
}
```

2. **Start both apps:**

```bash
# Terminal 1
cd remote-app-1
npm run dev

# Terminal 2
cd host-app
npm run dev
```

3. **Expected Result:**

   - ✅ Error boundary catches the runtime error
   - ✅ Shows "Component Error" fallback UI
   - ✅ Remote2Cart continues to work normally
   - ✅ Error with stack trace logged to console
   - ✅ Retry mechanism available

4. **Clean up:** Remove the `throw` statement after testing.

---

### Test 3: Retry Mechanism

**Test automatic retry with exponential backoff:**

1. **Add a conditional error in Remote1Button:**

```typescript
// In remote-app-1/src/components/Button.tsx
let attemptCount = 0;

export default function Button({ label, onClick }: ButtonProps) {
  attemptCount++;

  // Fail on first 2 attempts, succeed on 3rd
  if (attemptCount <= 2) {
    throw new Error(
      `Attempt ${attemptCount} failed - simulating transient error`
    );
  }

  return (
    <button onClick={onClick} className="custom-button">
      {label} (Attempt: {attemptCount})
    </button>
  );
}
```

2. **Test the retry:**

   - Click the "🔄 Retry" button
   - Observe the delay increasing (1s, 2s, 4s with exponential backoff)
   - On 3rd retry, component should load successfully

3. **Check console:**
   - You should see retry attempt logs
   - Load time tracking
   - Success message on final attempt

---

### Test 4: Circuit Breaker Pattern

**Test the circuit breaker after multiple failures:**

1. **Configure lower threshold (optional):**

```typescript
// In host-app/src/config/errorBoundary.config.ts
export const errorBoundaryConfig = {
  // ...
  circuitBreakerThreshold: 3, // Lower for easier testing
  // ...
};
```

2. **Add a persistent error in Remote1Button:**

```typescript
// In remote-app-1/src/components/Button.tsx
export default function Button({ label, onClick }: ButtonProps) {
  throw new Error("Persistent error to trigger circuit breaker");
  return <button>{label}</button>;
}
```

3. **Click retry 3+ times**

4. **Expected Result:**
   - ✅ After threshold reached, circuit breaker activates
   - ✅ UI changes to "Module Temporarily Unavailable"
   - ✅ Retry button no longer triggers new attempts
   - ✅ Console shows circuit breaker activation message
   - ✅ "Refresh Page" button still works

---

### Test 5: Error Logging and Statistics

**Test the error logging system:**

1. **Open browser console**

2. **Trigger various errors** (using tests above)

3. **Check error statistics:**

```javascript
// In browser console
import { errorLogger } from "./errorBoundary.exports";

// View all errors
errorLogger.getErrorStats();

// Expected output:
// {
//   totalErrors: 5,
//   byModule: {
//     'remote-app-1/Button': 3,
//     'remote-app-2/Cart': 2
//   },
//   byType: {
//     'LOAD_ERROR': 2,
//     'RUNTIME_ERROR': 3
//   }
// }

// Get errors for specific module
errorLogger.getModuleErrors("remote-app-1/Button");
```

---

### Test 6: Top-Level Error Boundary

**Test the app-level error boundary:**

1. **Add an error in App.tsx:**

```typescript
// In host-app/src/App.tsx
function App() {
  // Add this to trigger app-level error
  throw new Error("Testing top-level error boundary");

  // ... rest of code
}
```

2. **Expected Result:**

   - ✅ Entire app shows error screen
   - ✅ User-friendly message displayed
   - ✅ "Reload Application" button available
   - ✅ In dev mode, error details are shown

3. **Clean up:** Remove the `throw` statement.

---

## 🎨 Testing Different Error UI States

The `ErrorFallback` component has different styles based on error type:

### Module Load Error (Yellow/Warning)

```typescript
<ErrorFallback
  error={new Error("Failed to fetch")}
  moduleName="remote-app-1/Button"
  type="module-load"
  onRetry={() => console.log("Retry")}
/>
```

### Runtime Error (Red)

```typescript
<ErrorFallback
  error={new Error("Cannot read property")}
  moduleName="remote-app-1/Button"
  type="runtime"
  onRetry={() => console.log("Retry")}
/>
```

### Circuit Breaker (Orange/Warning)

```typescript
<ErrorFallback
  error={new Error("Too many failures")}
  moduleName="remote-app-1/Button"
  type="circuit-breaker"
/>
```

---

## 🔧 Configuration Options

You can customize error boundary behavior in `errorBoundary.config.ts`:

```typescript
export const errorBoundaryConfig = {
  maxRetries: 3, // Max retry attempts
  retryDelay: 1000, // Initial delay (ms)
  exponentialBackoff: true, // Enable exponential backoff
  showDetailedErrors: true, // Show stack traces (dev)
  enableCircuitBreaker: true, // Enable circuit breaker
  circuitBreakerThreshold: 5, // Failures before activation
  logToConsole: true, // Console logging (dev)
  reportToMonitoring: false, // External monitoring (prod)
};
```

---

## 📊 Module Health Monitoring

Check module health status:

```javascript
// In browser console
import { moduleRegistry } from "./errorBoundary.exports";

// Get health for specific module
moduleRegistry.getModuleHealth("remote-app-1/Button");

// Output:
// {
//   moduleName: 'remote-app-1/Button',
//   totalAttempts: 10,
//   failureCount: 3,
//   successCount: 7,
//   consecutiveFailures: 0,
//   circuitBreakerActive: false,
//   lastSuccessTime: 1234567890
// }

// Get all module health
moduleRegistry.getHealthSummary();

// Reset circuit breaker manually
moduleRegistry.resetCircuitBreaker("remote-app-1/Button");
```

---

## ✅ Verification Checklist

After testing, verify:

- [ ] Module load failures are caught and displayed
- [ ] Runtime errors are caught without crashing the app
- [ ] Retry mechanism works with exponential backoff
- [ ] Other modules continue working when one fails
- [ ] Circuit breaker activates after threshold
- [ ] Error logging tracks all failures
- [ ] Top-level boundary catches app-wide errors
- [ ] Production mode hides detailed errors
- [ ] Development mode shows stack traces
- [ ] Console logging works in dev mode

---

## 🚀 Production Deployment

Before deploying to production:

1. **Integrate with monitoring service:**

Update `errorLogger.ts`:

```typescript
private reportToMonitoring(context: ModuleErrorContext): void {
  // Example with Sentry
  Sentry.captureException(context.error, {
    tags: {
      module: context.moduleName,
      errorType: context.errorType,
    },
    extra: context.additionalContext,
  });
}
```

2. **Update remote URLs** to production CDN:

```typescript
// In vite.config.ts
remotes: {
  'remote-app-1': 'https://cdn.example.com/remote-1/remoteEntry.js',
  'remote-app-2': 'https://cdn.example.com/remote-2/remoteEntry.js',
}
```

3. **Test in production mode:**

```bash
npm run build
npm run preview
```

---

## 📖 Usage Examples

### Basic Usage (Already Implemented in App.tsx)

```typescript
import { RemoteComponentWrapper } from "./components/RemoteComponentWrapper";

<RemoteComponentWrapper
  moduleName="remote-app-1/Button"
  fallback={<div>Loading...</div>}
>
  <Remote1Button />
</RemoteComponentWrapper>;
```

### Custom Error Fallback

```typescript
<RemoteComponentWrapper
  moduleName="remote-app-1/Button"
  fallback={<LoadingSpinner />}
  errorFallback={<div>Custom error message for this specific component</div>}
>
  <Remote1Button />
</RemoteComponentWrapper>
```

### Custom Error Handler

```typescript
<RemoteComponentWrapper
  moduleName="remote-app-1/Button"
  onError={(error, errorInfo) => {
    console.log("Custom error handling", error);
    // Send to analytics, show notification, etc.
  }}
>
  <Remote1Button />
</RemoteComponentWrapper>
```

---

## 🎓 Next Steps

After validating the error boundaries:

1. **Add unit tests** for error boundary components
2. **Integrate monitoring** (Sentry, DataDog, etc.)
3. **Add E2E tests** with intentional failures
4. **Create error dashboard** using health metrics
5. **Implement alerting** for repeated failures
6. **Add performance monitoring** for module load times

---

## 📞 Troubleshooting

### Error boundary not catching errors?

- Ensure the error occurs **within** the boundary's children
- Error boundaries don't catch errors in event handlers (use try-catch)
- Check that the component is wrapped correctly

### Retry not working?

- Check circuit breaker status (`moduleRegistry.getModuleHealth()`)
- Verify retry count hasn't exceeded `maxRetries`
- Look for console logs showing retry attempts

### Circuit breaker too aggressive?

- Increase `circuitBreakerThreshold` in config
- Implement manual reset UI
- Add time-based circuit breaker reset

---

## 📝 Notes

- Error boundaries are **React components** and follow React lifecycle
- They only catch errors during **rendering**, in **lifecycle methods**, and in **constructors**
- They do **NOT** catch errors in:
  - Event handlers (use try-catch)
  - Asynchronous code (use try-catch)
  - Server-side rendering
  - Errors thrown in the error boundary itself

For event handlers and async code, use try-catch and call `errorLogger.logModuleError()` manually.

---

**Happy Testing! 🎉**
