/// <reference types="vite/client" />

declare module "sharedUtils/utils" {
  const utils: unknown;
  export default utils;
}

declare module "sharedUtils/eventBus" {
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

declare module "sharedUtils/eventTypes" {
  export interface ThemeChangedEvent {
    theme: "light" | "dark";
    timestamp: number;
  }

  export interface ButtonClickedEvent {
    buttonId: string;
    label: string;
    timestamp: number;
  }

  export type EventBusEvents = {
    "theme:changed": ThemeChangedEvent;
    "button:clicked": ButtonClickedEvent;
  };
}
