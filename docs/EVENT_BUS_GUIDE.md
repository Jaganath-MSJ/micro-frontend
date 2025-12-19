# Event Bus Developer Guide

## Overview

This guide explains how to use the event bus for communication between micro-frontends in our application.

## When to Use Event Bus vs Redux

### Use Event Bus For:

✅ **One-time notifications** - User logout, toast messages  
✅ **Cross-app coordination** - Navigation events, analytics tracking  
✅ **Ephemeral data** - Form validation, temporary UI states  
✅ **Decoupled communication** - When apps shouldn't know about each other

### Use Redux For:

✅ **Persistent state** - User profile, shopping cart data  
✅ **Shared state** - Data that multiple components need to read/write  
✅ **Complex state logic** - State that requires reducers and middleware  
✅ **Time-travel debugging** - When you need Redux DevTools

> [!TIP] > **Rule of Thumb**: If the data needs to persist or be accessed by multiple components over time, use Redux. If it's a one-time event or notification, use the event bus.

---

## Quick Start

### 1. Import the Event Bus

```typescript
const loadEventBus = async () => {
  const { eventBus } = await import("shared-utils/eventBus");
  return eventBus;
};
```

### 2. Emit an Event

```typescript
const handleLogout = async () => {
  const eventBus = await loadEventBus();
  eventBus.emit("user:logout", {
    userId: "user-123",
    timestamp: Date.now(),
  });
};
```

### 3. Listen to an Event

```typescript
useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  loadEventBus().then((eventBus) => {
    unsubscribe = eventBus.on("user:logout", (payload) => {
      console.log("User logged out:", payload.userId);
      // Handle logout in your component
    });
  });

  return () => {
    unsubscribe?.(); // Always cleanup!
  };
}, []);
```

---

## Available Events

All events are defined in `shared-utils/src/eventTypes.ts`. Current events:

**User Events**: `user:login`, `user:logout`, `user:profile-updated`  
**Cart Events**: `cart:item-added`, `cart:item-removed`, `cart:cleared`, `cart:checkout`  
**Theme Events**: `theme:changed`  
**Notification Events**: `notification:show`, `notification:dismiss`  
**Navigation Events**: `navigation:navigate`  
**Button Events**: `button:clicked`

---

## How to Define New Events

1. Add event interface to `shared-utils/src/eventTypes.ts`
2. Add to `EventBusEvents` type map
3. Update `vite-env.d.ts` in apps that use it
4. Use with full type safety

---

## Best Practices

✅ Always include timestamp  
✅ Use namespaced event names (`domain:action`)  
✅ Always cleanup subscriptions  
✅ Use descriptive payload fields  
❌ Don't overuse events for state management

---

## Common Pitfalls

**Memory Leaks**: Always return cleanup function in useEffect  
**State vs Events**: Use Redux for state, events for notifications  
**Type Safety**: Always define event types

---

## Debugging

- All events logged in dev mode with green `[EventBus]` badge
- Use `eventBus.getHandlers()` to check active listeners
- Use `eventBus.clear()` to clear listeners for testing

---

## Examples

See the implementation in:

- [Host App](file:///d:/Projects/mirco-frontend/host-app/src/App.tsx) - Event listeners and emitters
- [Remote Button](file:///d:/Projects/mirco-frontend/remote-app-1/src/components/Button.tsx) - Emit click events
- [Remote Cart](file:///d:/Projects/mirco-frontend/remote-app-2/src/cart/Cart.tsx) - Listen to logout events

For detailed examples and troubleshooting, see the [Implementation Plan](file:///C:/Users/jagan/.gemini/antigravity/brain/d3e503f5-03be-44d5-8d2f-a96ed6e9c5af/implementation_plan.md).
