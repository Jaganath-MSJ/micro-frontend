/**
 * Event Bus Type Definitions
 *
 * This file contains all event types and their payload definitions
 * for cross-micro-frontend communication.
 *
 * Naming Convention: <domain>:<action>
 * Example: 'user:login', 'cart:item-added'
 */

// ============================================================================
// USER EVENTS
// ============================================================================

export interface UserLoginEvent {
  userId: string;
  email: string;
  timestamp: number;
}

export interface UserLogoutEvent {
  userId: string;
  timestamp: number;
}

export interface UserProfileUpdatedEvent {
  userId: string;
  changes: Record<string, unknown>;
  timestamp: number;
}

// ============================================================================
// CART EVENTS
// ============================================================================

export interface CartItemAddedEvent {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  timestamp: number;
}

export interface CartItemRemovedEvent {
  itemId: string;
  timestamp: number;
}

export interface CartClearedEvent {
  timestamp: number;
  reason?: "user-action" | "logout" | "checkout";
}

export interface CartCheckoutEvent {
  totalAmount: number;
  itemCount: number;
  timestamp: number;
}

// ============================================================================
// THEME EVENTS
// ============================================================================

export interface ThemeChangedEvent {
  theme: "light" | "dark";
  timestamp: number;
}

// ============================================================================
// NOTIFICATION EVENTS
// ============================================================================

export interface NotificationShowEvent {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
  timestamp: number;
}

export interface NotificationDismissEvent {
  notificationId: string;
  timestamp: number;
}

// ============================================================================
// NAVIGATION EVENTS
// ============================================================================

export interface NavigationEvent {
  path: string;
  params?: Record<string, string>;
  timestamp: number;
}

// ============================================================================
// BUTTON EVENTS (Example from Remote App 1)
// ============================================================================

export interface ButtonClickedEvent {
  buttonId: string;
  label: string;
  timestamp: number;
}

// ============================================================================
// EVENT BUS TYPE MAP
// ============================================================================

/**
 * Central type map for all events in the system.
 * Add new events here to get type safety across all micro-frontends.
 */
export type EventBusEvents = {
  // User events
  "user:login": UserLoginEvent;
  "user:logout": UserLogoutEvent;
  "user:profile-updated": UserProfileUpdatedEvent;

  // Cart events
  "cart:item-added": CartItemAddedEvent;
  "cart:item-removed": CartItemRemovedEvent;
  "cart:cleared": CartClearedEvent;
  "cart:checkout": CartCheckoutEvent;

  // Theme events
  "theme:changed": ThemeChangedEvent;

  // Notification events
  "notification:show": NotificationShowEvent;
  "notification:dismiss": NotificationDismissEvent;

  // Navigation events
  "navigation:navigate": NavigationEvent;

  // Button events
  "button:clicked": ButtonClickedEvent;
};

/**
 * Type helper to get event payload type by event name
 *
 * Usage:
 * type LoginPayload = EventPayload<'user:login'>
 */
export type EventPayload<T extends keyof EventBusEvents> = EventBusEvents[T];

/**
 * Type helper for event names
 */
export type EventName = keyof EventBusEvents;
