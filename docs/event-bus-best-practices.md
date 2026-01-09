# Best Practices for Micro-Frontend Event Bus Communication

This document outlines best practices for implementing and using an event bus in a micro-frontend architecture, specifically focusing on the transition to `@trutoo/event-bus`.

## 1. Core Principles

### Decoupling

- **Loose Coupling:** Micro-frontends should remain agnostic of each other. The event bus acts as the only integration point for cross-app communication.
- **Contract-First:** Define events and their payloads rigorously. These contracts (schemas) are the "API" between your micro-frontends.

### Type Safety & Validation

- **Strict Typing:** Always export and share TypeScript interfaces for event payloads.
- **Runtime Validation:** Use JSON Schemas (supported by `@trutoo/event-bus`) to validate events at runtime. This prevents malformed data from crashing remote applications.

## 2. Event Naming Conventions

Use a scoped naming convention to avoid collisions and improve readability.

- **Format:** `domain:action` or `domain:entity:action`
- **Examples:**
  - `user:login`
  - `cart:item-added`
  - `payment:transaction-completed`

## 3. Payload Design

- **Minimal Payload:** Only send necessary data. Avoid sending massive objects or whole application state.
- **Immutable Data:** Treat event payloads as immutable.
- **Metadata:** Include metadata like `timestamp` or `source` to help with debugging and ordering.

## 4. Usage Patterns

### Publishing

- **Fire and Forget:** Emitters should not expect a return value.
- **Idempotency:** Designing handlers to be idempotent allows events to be replayed safely (a feature of `@trutoo/event-bus`).

### Subscribing

- **Lifecycle Management:** Always unsubscribe from events when components unmount to prevent memory leaks.
  ```typescript
  useEffect(() => {
    const unsubscribe = eventBus.on("event", handler);
    return () => unsubscribe();
  }, []);
  ```
- **Error Handling:** Wrap event handlers in try-catch blocks to prevent one handler's failure from affecting others.

## 5. @trutoo/event-bus Specifics

### Schema Registration

Register schemas for your channels to enforce data integrity.

```typescript
eventBus.register("user:login", {
  properties: {
    userId: { type: "string" },
  },
});
```

### Replay Capability

Leverage the replay feature for late-binding subscribers (e.g., a component that loads after an event has fired but needs the last state).

## 6. Anti-Patterns to Avoid

- **Request-Response:** Do not use the event bus for request-response flows (use API calls or direct exports for that).
- **State Management:** Do not use the event bus as a global state manager (use Redux, Zustand, or Context for app-internal state).
- **Broadcasting Sensitive Data:** Avoid sending PII or secrets over the event bus unless strictly necessary and secured.
