import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationContext } from "./NavigationContext";
import type { NavigationEvent, NavigationMethods } from "./NavigationContext";

// const loadTypes = import("sharedUtils/types");
const loadEventBus = import("sharedUtils/eventBus");

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupEventBus = async () => {
      try {
        const { eventBus } = await loadEventBus;

        // Listen for navigation requests from remotes
        unsubscribe = eventBus.on(
          "navigation:request",
          (payload: NavigationEvent) => {
            const { path, replace, state } = payload;
            navigate(path, { replace, state });
          }
        );
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
    goBack: () => navigate(-1), // React Router v6 way
    currentPath: location.pathname,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
