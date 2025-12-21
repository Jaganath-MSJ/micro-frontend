import { useState, useEffect } from "react";
import "./App.css";
import { AppRouter } from "./Router";
import { NavigationProvider } from "./navigation/NavigationProvider";
import { importRemoteFunction } from "./utils/utils";

// Load shared utils
const loadSharedUtils = import("shared-utils/utils");

// Load event bus
// const loadEventBus = importRemoteFunction("shared-utils/eventBus");
const loadEventBus = import("shared-utils/eventBus");

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifications, setNotifications] = useState<string[]>([]);

  // Setup event listeners
  useEffect(() => {
    let unsubscribeLogout: (() => void) | undefined;
    let unsubscribeTheme: (() => void) | undefined;
    let unsubscribeNotification: (() => void) | undefined;
    let unsubscribeButton: (() => void) | undefined;
    let unsubscribeCart: (() => void) | undefined;

    loadEventBus.then(({ eventBus }) => {
      // Listen to user logout events
      unsubscribeLogout = eventBus.on("user:logout", (payload) => {
        console.log("🚪 User logged out:", payload);
        addNotification(`User ${payload.userId} logged out`);
      });

      // Listen to theme change events
      unsubscribeTheme = eventBus.on("theme:changed", (payload) => {
        console.log("🎨 Theme changed:", payload);
        setTheme(payload.theme);
        addNotification(`Theme changed to ${payload.theme}`);
      });

      // Listen to notification events
      unsubscribeNotification = eventBus.on("notification:show", (payload) => {
        console.log("🔔 Notification:", payload);
        addNotification(payload.message);
      });

      // Listen to button click events from remote
      unsubscribeButton = eventBus.on("button:clicked", (payload) => {
        console.log("🔘 Button clicked:", payload);
        addNotification(`Button "${payload.label}" clicked`);
      });

      // Listen to cart events
      unsubscribeCart = eventBus.on("cart:item-added", (payload) => {
        console.log("🛒 Cart item added:", payload);
        addNotification(`Added ${payload.itemName} to cart`);
      });
    });

    // Cleanup on unmount
    return () => {
      unsubscribeLogout?.();
      unsubscribeTheme?.();
      unsubscribeNotification?.();
      unsubscribeButton?.();
      unsubscribeCart?.();
    };
  }, []);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev.slice(-4), message]);
  };

  const onCheckUtils = async () => {
    const data = (await loadSharedUtils).getUserMessage();
    console.log(data);
    const { eventBus } = await loadEventBus;
    const handler = eventBus.getHandlers();
    console.log("all handler", handler);
  };

  const handleLogout = async () => {
    const { eventBus } = await loadEventBus;
    eventBus.emit("user:logout", {
      userId: "user-123",
      timestamp: Date.now(),
    });
  };

  const handleThemeToggle = async () => {
    const { eventBus } = await loadEventBus;
    const newTheme = theme === "light" ? "dark" : "light";
    eventBus.emit("theme:changed", {
      theme: newTheme,
      timestamp: Date.now(),
    });
  };

  const handleShowNotification = async () => {
    const { eventBus } = await loadEventBus;
    eventBus.emit("notification:show", {
      id: `notif-${Date.now()}`,
      message: "This is a test notification from Host App!",
      type: "info",
      timestamp: Date.now(),
    });
  };

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
        minHeight: "100vh",
        padding: "20px",
        transition: "all 0.3s ease",
      }}
    >
      <h1>🏠 Host Application</h1>
      <p>
        Current Theme: <strong>{theme}</strong>
      </p>

      {/* Event Bus Controls */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#f0f0f0",
        }}
      >
        <h3>🎯 Event Bus Controls</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={onCheckUtils}>Check Shared Utils</button>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: "#f44336", color: "white" }}
          >
            Trigger Logout Event
          </button>
          <button
            onClick={handleThemeToggle}
            style={{ backgroundColor: "#2196F3", color: "white" }}
          >
            Toggle Theme Event
          </button>
          <button
            onClick={handleShowNotification}
            style={{ backgroundColor: "#FF9800", color: "white" }}
          >
            Show Notification Event
          </button>
        </div>
      </div>

      {/* Notifications Display */}
      {notifications.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "2px solid #2196F3",
            borderRadius: "8px",
            backgroundColor: theme === "dark" ? "#2a2a2a" : "#e3f2fd",
          }}
        >
          <h3>🔔 Recent Events</h3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {notifications.map((notif, idx) => (
              <li key={idx}>{notif}</li>
            ))}
          </ul>
        </div>
      )}

      {/* <NavigationProvider> */}
      <div style={{ marginTop: "20px" }}>
        <AppRouter />
      </div>
      {/* </NavigationProvider> */}
    </div>
  );
}

export default App;
