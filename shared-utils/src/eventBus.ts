import mitt from "mitt";
import type { Emitter } from "mitt";
import type { EventBusEvents } from "./eventTypes";

/**
 * Event Bus for Micro-Frontend Communication
 *
 * This is a lightweight, type-safe event bus using mitt library.
 * It enables decoupled communication between micro-frontends without
 * the overhead of Redux for ephemeral events.
 *
 * Usage:
 * ```typescript
 * import { eventBus } from 'shared-utils/eventBus';
 *
 * // Emit an event
 * eventBus.emit('user:logout', { userId: '123', timestamp: Date.now() });
 *
 * // Listen to an event
 * const unsubscribe = eventBus.on('user:logout', (payload) => {
 *   console.log('User logged out:', payload.userId);
 * });
 *
 * // Cleanup
 * unsubscribe();
 * ```
 */

// Create the event bus instance
const emitter: Emitter<EventBusEvents> = mitt<EventBusEvents>();

/**
 * Enhanced event bus with logging and debugging capabilities
 */
class EventBus {
  private emitter: Emitter<EventBusEvents>;
  private isDevelopment: boolean;

  constructor(emitter: Emitter<EventBusEvents>) {
    this.emitter = emitter;
    this.isDevelopment =
      import.meta.env.DEV || import.meta.env.MODE === "development";

    // Add development logging
    if (this.isDevelopment) {
      this.setupDevelopmentLogging();
    }
  }

  /**
   * Setup logging middleware for development
   */
  private setupDevelopmentLogging() {
    // Listen to all events in development mode
    this.emitter.on(
      "*",
      (
        type: keyof EventBusEvents,
        payload: EventBusEvents[keyof EventBusEvents]
      ) => {
        console.log(
          `%c[EventBus] ${String(type)}`,
          "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
          payload
        );
      }
    );
  }

  /**
   * Emit an event
   * @param type - Event name
   * @param payload - Event payload
   */
  emit<Key extends keyof EventBusEvents>(
    type: Key,
    payload: EventBusEvents[Key]
  ): void {
    this.emitter.emit(type, payload);
  }

  /**
   * Listen to an event
   * @param type - Event name
   * @param handler - Event handler function
   * @returns Unsubscribe function
   */
  on<Key extends keyof EventBusEvents>(
    type: Key,
    handler: (payload: EventBusEvents[Key]) => void
  ): () => void {
    this.emitter.on(type, handler);

    // Return unsubscribe function
    return () => {
      this.emitter.off(type, handler);
    };
  }

  /**
   * Listen to an event once
   * @param type - Event name
   * @param handler - Event handler function
   */
  once<Key extends keyof EventBusEvents>(
    type: Key,
    handler: (payload: EventBusEvents[Key]) => void
  ): void {
    const wrappedHandler = (payload: EventBusEvents[Key]) => {
      handler(payload);
      this.emitter.off(type, wrappedHandler);
    };

    this.emitter.on(type, wrappedHandler);
  }

  /**
   * Remove event listener
   * @param type - Event name
   * @param handler - Event handler function
   */
  off<Key extends keyof EventBusEvents>(
    type: Key,
    handler: (payload: EventBusEvents[Key]) => void
  ): void {
    this.emitter.off(type, handler);
  }

  /**
   * Remove all event listeners
   * @param type - Optional event name to clear specific event listeners
   */
  clear<Key extends keyof EventBusEvents>(type?: Key): void {
    if (type) {
      this.emitter.off(type);
    } else {
      this.emitter.all.clear();
    }
  }

  /**
   * Get all registered event handlers (for debugging)
   */
  getHandlers(): Map<
    keyof EventBusEvents | "*",
    Array<(payload?: unknown) => void>
  > {
    return this.emitter.all;
  }
}

// Export singleton instance
export const eventBus = new EventBus(emitter);

// Export types for convenience
export type { EventBusEvents } from "./eventTypes";
