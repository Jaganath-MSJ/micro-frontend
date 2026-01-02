/// <reference types="vite/client" />

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
  export interface UserLogoutEvent {
    userId: string;
    timestamp: number;
  }

  export interface NotificationShowEvent {
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    duration?: number;
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
    "user:logout": UserLogoutEvent;
    "notification:show": NotificationShowEvent;
    "cart:item-added": CartItemAddedEvent;
  };
}
