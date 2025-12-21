export interface NavigationEvent {
  path: string;
  replace?: boolean;
  state?: any;
}

export interface NavigationMethods {
  navigate: (
    path: string,
    options?: { replace?: boolean; state?: any }
  ) => void;
  goBack: () => void;
  currentPath: string;
}

export const NAVIGATION_EVENTS = {
  NAVIGATE_REQUEST: "navigation:request",
  NAVIGATE_COMPLETE: "navigation:complete",
} as const;
