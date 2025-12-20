import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const loadSharedUtils = async () => {
  const utils = await import("shared-utils/utils");
  return utils;
};

const loadEventBus = async () => {
  const { eventBus } = await import("shared-utils/eventBus");
  return eventBus;
};

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  const count =
    useSelector((state: { user: { count: number } }) => state?.user?.count) ??
    0;
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Listen to theme changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    loadEventBus().then((eventBus) => {
      unsubscribe = eventBus.on("theme:changed", (payload) => {
        console.log("🎨 [Remote-1 Button] Theme changed:", payload.theme);
        setTheme(payload.theme);
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const onCheckUtils = async () => {
    onClick();

    // Emit button clicked event
    const eventBus = await loadEventBus();
    eventBus.emit("button:clicked", {
      buttonId: "remote-1-button",
      label,
      timestamp: Date.now(),
    });

    const data = (await loadSharedUtils()).getUserMessage();
    console.log("Remote-1 Button:", data);
  };

  return (
    <button
      onClick={onCheckUtils}
      style={{
        padding: "10px 20px",
        cursor: "pointer",
        backgroundColor: theme === "dark" ? "#424242" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        transition: "all 0.3s ease",
      }}
    >
      {label}: {count}
    </button>
  );
}

export default Button;
