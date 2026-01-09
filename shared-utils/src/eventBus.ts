import { EventBus as TrutooEventBus } from "@trutoo/event-bus";
import type { EventBusEvents } from "./eventTypes";

/**
 * Event Bus for Micro-Frontend Communication
 *
 * This is a lightweight, type-safe event bus using @trutoo/event-bus library.
 * It enables decoupled communication between micro-frontends without
 * the overhead of Redux for ephemeral events.
 */

// Define schemas for our events.
// @trutoo/event-bus uses JSON Schema for validation.
// For now, we allow any payload that matches the TS type (schema is open),
// but we register the channels effectively.
const schemas = {
  // User events
  "user:login": {
    type: "object",
    properties: {
      userId: { type: "string" },
      email: { type: "string" },
      timestamp: { type: "number" },
    },
    required: ["userId", "email", "timestamp"],
  },
  "user:logout": {
    type: "object",
    properties: {
      userId: { type: "string" },
      timestamp: { type: "number" },
    },
    required: ["userId", "timestamp"],
  },
  "user:profile-updated": {
    type: "object",
    properties: {
      userId: { type: "string" },
      changes: { type: "object" },
      timestamp: { type: "number" },
    },
    required: ["userId", "changes", "timestamp"],
  },

  // Cart events
  "cart:item-added": {
    type: "object",
    properties: {
      itemId: { type: "string" },
      itemName: { type: "string" },
      quantity: { type: "number" },
      price: { type: "number" },
      timestamp: { type: "number" },
    },
    required: ["itemId", "itemName", "quantity", "price", "timestamp"],
  },
  "cart:item-removed": {
    type: "object",
    properties: {
      itemId: { type: "string" },
      timestamp: { type: "number" },
    },
    required: ["itemId", "timestamp"],
  },
  "cart:cleared": {
    type: "object",
    properties: {
      timestamp: { type: "number" },
      reason: { type: "string", enum: ["user-action", "logout", "checkout"] },
    },
    required: ["timestamp"],
  },
  "cart:checkout": {
    type: "object",
    properties: {
      totalAmount: { type: "number" },
      itemCount: { type: "number" },
      timestamp: { type: "number" },
    },
    required: ["totalAmount", "itemCount", "timestamp"],
  },

  // Theme events
  "theme:changed": {
    type: "object",
    properties: {
      theme: { type: "string", enum: ["light", "dark"] },
      timestamp: { type: "number" },
    },
    required: ["theme", "timestamp"],
  },

  // Notification events
  "notification:show": {
    type: "object",
    properties: {
      id: { type: "string" },
      message: { type: "string" },
      type: { type: "string", enum: ["info", "success", "warning", "error"] },
      duration: { type: "number" },
      timestamp: { type: "number" },
    },
    required: ["id", "message", "type", "timestamp"],
  },
  "notification:dismiss": {
    type: "object",
    properties: {
      notificationId: { type: "string" },
      timestamp: { type: "number" },
    },
    required: ["notificationId", "timestamp"],
  },

  // Navigation events
  "navigation:navigate": {
    type: "object",
    properties: {
      path: { type: "string" },
      params: { type: "object", additionalProperties: { type: "string" } },
      timestamp: { type: "number" },
    },
    required: ["path", "timestamp"],
  },
  "navigation:request": {
    type: "object",
    properties: {
      path: { type: "string" },
      params: { type: "object", additionalProperties: { type: "string" } },
      timestamp: { type: "number" },
    },
    required: ["path", "timestamp"],
  },

  // Button events
  "button:clicked": {
    type: "object",
    properties: {
      buttonId: { type: "string" },
      label: { type: "string" },
      timestamp: { type: "number" },
    },
    required: ["buttonId", "label", "timestamp"],
  },
};

/**
 * Enhanced event bus with logging and debugging capabilities
 */
class EventBusWrapper {
  private bus: TrutooEventBus;
  private isDevelopment: boolean;

  constructor() {
    this.bus = new TrutooEventBus();
    this.isDevelopment =
      import.meta.env.DEV || import.meta.env.MODE === "development";

    // Register schemas
    Object.entries(schemas).forEach(([channel, schema]) => {
      this.bus.register(channel, schema);
    });

    // Add development logging
    if (this.isDevelopment) {
      this.setupDevelopmentLogging();
    }
  }

  /**
   * Setup logging middleware for development
   */
  private setupDevelopmentLogging() {
    // The new library might not have a '*' listener easily exposed,
    // but we can wrap the emit method or just leave it for now.
    // @trutoo/event-bus doesn't natively support wildcard subscription in the same way mitt does
    // without using specific pattern matching features if available.
    // For now we will rely on manual logging in emit.
  }

  /**
   * Emit an event
   * @param type - Event name
   * @param payload - Event payload
   */
  /**
   * Emit an event
   * @param type - Event name
   * @param payload - Event payload
   */
  emit<Key extends keyof EventBusEvents>(
    type: Key,
    payload: EventBusEvents[Key]
  ): void {
    if (this.isDevelopment) {
      console.log(
        `%c[EventBus] ${String(type)}`,
        "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
        payload
      );
    }
    this.bus.publish(type as string, payload);
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
    let subscription: { unsubscribe: () => void } | null = null;
    let isUnsubscribed = false;

    // Wrap handler to extract payload from ChannelEvent
    const wrappedHandler = (event: { payload?: EventBusEvents[Key] }) => {
      // Validation: ensure event has payload
      if (event.payload) {
        handler(event.payload);
      }
    };

    // subscribe returns a Promise<Subscription>
    this.bus
      .subscribe(type as string, wrappedHandler)
      .then((sub: { unsubscribe: () => void }) => {
        if (isUnsubscribed) {
          sub.unsubscribe();
        } else {
          subscription = sub;
        }
      })
      .catch((err) => {
        console.error(`[EventBus] Failed to subscribe to ${String(type)}`, err);
      });

    return () => {
      isUnsubscribed = true;
      if (subscription) {
        subscription.unsubscribe();
      }
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
    const unsubscribe = this.on(type, (payload) => {
      unsubscribe();
      handler(payload);
    });
  }

  /**
   * Remove event listener
   * @param type - Event name
   * @param handler - Event handler function
   */
  off<Key extends keyof EventBusEvents>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type: Key,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _handler: (payload: EventBusEvents[Key]) => void
  ): void {
    console.warn(
      "eventBus.off() is deprecated. Please use the unsubscribe function returned by eventBus.on()."
    );
  }

  /**
   * Remove all event listeners
   * @param type - Optional event name to clear specific event listeners
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear<Key extends keyof EventBusEvents>(_type?: Key): void {
    // Implementation depends on library capabilities
    // this.bus.clear(type) if available
  }

  /**
   * Get all registered event handlers (for debugging)
   */
  getHandlers(): Record<string, unknown> {
    // Not directly exposed by all event buses
    return {};
  }
}

// Export singleton instance
export const eventBus = new EventBusWrapper();

// Export types for convenience
export type { EventBusEvents } from "./eventTypes";
