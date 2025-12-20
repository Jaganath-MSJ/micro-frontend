import { useEffect, useRef } from "react";
import type { EventBusEvents } from "../eventTypes";

/**
 * React Hook for Event Bus Subscriptions
 *
 * This hook provides a convenient way to subscribe to event bus events
 * with automatic cleanup on component unmount.
 *
 * @param eventName - The name of the event to listen to
 * @param handler - The event handler function
 * @param deps - Optional dependency array (like useEffect)
 *
 * @example
 * ```typescript
 * import { useEventBus } from 'shared-utils/hooks';
 *
 * function MyComponent() {
 *   useEventBus('user:logout', (payload) => {
 *     console.log('User logged out:', payload.userId);
 *     // Handle logout in this component
 *   });
 *
 *   return <div>My Component</div>;
 * }
 * ```
 */
export function useEventBus<K extends keyof EventBusEvents>(
  eventName: K,
  handler: (payload: EventBusEvents[K]) => void,
  deps: React.DependencyList = []
): void {
  // Use ref to store the latest handler to avoid stale closures
  const handlerRef = useRef(handler);

  // Update ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    // Import event bus dynamically to avoid circular dependencies
    import("../eventBus").then(({ eventBus }) => {
      // Create a wrapper that calls the latest handler
      const wrappedHandler = (payload: EventBusEvents[K]) => {
        handlerRef.current(payload);
      };

      // Subscribe to the event
      const unsubscribe = eventBus.on(eventName, wrappedHandler);

      // Cleanup function
      return () => {
        unsubscribe();
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, ...deps]);
}

/**
 * React Hook for Emitting Events
 *
 * This hook returns a memoized emit function that can be used to emit events.
 *
 * @returns Emit function
 *
 * @example
 * ```typescript
 * import { useEventEmit } from 'shared-utils/hooks';
 *
 * function MyComponent() {
 *   const emit = useEventEmit();
 *
 *   const handleLogout = () => {
 *     emit('user:logout', {
 *       userId: '123',
 *       timestamp: Date.now()
 *     });
 *   };
 *
 *   return <button onClick={handleLogout}>Logout</button>;
 * }
 * ```
 */
export function useEventEmit() {
  const emitRef = useRef<typeof import("../eventBus").eventBus.emit | null>(
    null
  );

  useEffect(() => {
    import("../eventBus").then(({ eventBus }) => {
      emitRef.current = eventBus.emit.bind(eventBus);
    });
  }, []);

  return <K extends keyof EventBusEvents>(
    eventName: K,
    payload: EventBusEvents[K]
  ): void => {
    if (emitRef.current) {
      emitRef.current(eventName, payload);
    }
  };
}
