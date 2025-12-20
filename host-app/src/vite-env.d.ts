/// <reference types="vite/client" />

declare module "remote-app-1/Button" {
  const Button: React.ComponentType<{
    label: string;
    onClick: () => void;
  }>;
  export default Button;
}

declare module "remote-app-1/*" {
  const value: unknown;
  export default value;
}

declare module "remote-app-2/Cart" {
  const Cart: React.ComponentType;
  export default Cart;
}

declare module "shared-utils/utils" {
  const utils: unknown;
  export default utils;
}

declare module "shared-utils/eventBus" {
  import type { EventBusEvents } from "shared-utils/eventTypes";

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

declare module "shared-utils/eventTypes" {
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
  };
}
