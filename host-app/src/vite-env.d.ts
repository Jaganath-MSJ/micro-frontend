/// <reference types="vite/client" />

declare module "remoteApp1/Button" {
  const Button: React.ComponentType<{
    label: string;
    onClick: () => void;
  }>;
  export default Button;
}

declare module "remoteApp1/*" {
  const value: unknown;
  export default value;
}

declare module "remoteApp2/Cart" {
  const Cart: React.ComponentType;
  export default Cart;
}

declare module "sharedUtils/utils" {
  const utils: unknown;
  export default utils;
}

declare module "sharedUtils/eventBus" {
  import type { EventBusEvents } from "sharedUtils/eventTypes";

  export const eventBus: {
    emit<K extends keyof EventBusEvents>(
      type: K,
      payload: EventBusEvents[K]
    ): void;
    on<K extends keyof EventBusEvents>(
      type: K,
      handler: (payload: EventBusEvents[K]) => void
    ): () => void;
    once<K extends keyof EventBusEvents>(
      type: K,
      handler: (payload: EventBusEvents[K]) => void
    ): void;
    off<K extends keyof EventBusEvents>(
      type: K,
      handler: (payload: EventBusEvents[K]) => void
    ): void;
    clear<K extends keyof EventBusEvents>(type?: K): void;
  };

  export type { EventBusEvents };
}

declare module "sharedUtils/eventTypes" {
  export interface UserLoginEvent {
    userId: string;
    email: string;
    timestamp: number;
  }

  export interface UserLogoutEvent {
    userId: string;
    timestamp: number;
  }

  export interface ThemeChangedEvent {
    theme: "light" | "dark";
    timestamp: number;
  }

  export interface NotificationShowEvent {
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    duration?: number;
    timestamp: number;
  }

  export interface ButtonClickedEvent {
    buttonId: string;
    label: string;
    timestamp: number;
  }

  export interface CartItemAddedEvent {
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
    timestamp: number;
  }

  export type EventBusEvents = {
    "user:login": UserLoginEvent;
    "user:logout": UserLogoutEvent;
    "theme:changed": ThemeChangedEvent;
    "notification:show": NotificationShowEvent;
    "button:clicked": ButtonClickedEvent;
    "cart:item-added": CartItemAddedEvent;
    // Navigation events
    "navigation:request": NavigationEvent;
  };
}

declare module "sharedUtils/types" {
  // export * from "sharedUtils/src/types/index";
  // // We need to properly type this based on what we exposed.
  // // Since we exposed it via module federation, we should declare it:
  // import { AppRoutes } from "sharedUtils/src/types/routes";
  // import {
  //   NavigationMethods,
  //   NavigationEvent,
  //   NAVIGATION_EVENTS,
  // } from "sharedUtils/src/types/navigation";

  // export const ROUTES: AppRoutes;
  // export type { NavigationEvent, NavigationMethods };
  // export const NAVIGATION_EVENTS: typeof NAVIGATION_EVENTS;
  const value: unknown;
  export default value;
}
