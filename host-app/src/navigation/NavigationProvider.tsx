import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { importRemoteFunction } from "../utils/utils";

const loadTypes = import("shared-utils/types");
const loadEventBus = import("shared-utils/eventBus");

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

export const NavigationContext = createContext<NavigationMethods | null>(null);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupEventBus = async () => {
      try {
        const { eventBus } = await loadEventBus;

        // Listen for navigation requests from remotes
        unsubscribe = eventBus.on("navigation:request", (payload: any) => {
          const { path, replace, state } = payload as NavigationEvent;
          navigate(path, { replace, state });
        });
      } catch (error) {
        console.error("Failed to setup navigation event bus:", error);
      }
    };

    setupEventBus();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const value: NavigationMethods = {
    navigate: (path, options) => navigate(path, options),
    goBack: () => navigate(-1 as any), // React Router v6 way
    currentPath: location.pathname,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
