import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import CartContent from "./CartContent";

interface RootState {
  user?: {
    count: number;
  };
}

const loadSharedUtils = async () => {
  const utils = await import("sharedUtils/utils");
  return utils;
};

const loadEventBus = async () => {
  const { eventBus } = await import("sharedUtils/eventBus");
  return eventBus;
};

function Cart() {
  const count = useSelector((state: RootState) => state?.user?.count ?? 0);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Listen to user logout events
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    loadEventBus().then((eventBus) => {
      unsubscribe = eventBus.on("user:logout", (payload) => {
        console.log("🚪 [Remote-2 Cart] User logged out:", payload);
        setIsLoggedOut(true);

        // Emit notification
        eventBus.emit("notification:show", {
          id: `cart-logout-${Date.now()}`,
          message: "Cart cleared due to logout",
          type: "warning",
          timestamp: Date.now(),
        });
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const onCheckUtils = async () => {
    const data = (await loadSharedUtils()).getUserMessage();
    console.log("Remote-2 Cart:", data);
  };

  const handleAddItem = async () => {
    const eventBus = await loadEventBus();
    eventBus.emit("cart:item-added", {
      itemId: `item-${Date.now()}`,
      itemName: "Sample Product",
      quantity: 1,
      price: 29.99,
      timestamp: Date.now(),
    });
  };

  if (isLoggedOut) {
    return (
      <div
        style={{
          padding: "15px",
          backgroundColor: "#ffebee",
          borderRadius: "4px",
          marginTop: "10px",
        }}
      >
        <p>⚠️ Cart is unavailable. User has been logged out.</p>
        <button onClick={() => setIsLoggedOut(false)}>Restore Cart</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "10px" }}>
      {count % 3 !== 0 && <CartContent />}
      <p>Outside Count: {count}</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={onCheckUtils}>Check Shared Utils in Remote 2</button>
        <button
          onClick={handleAddItem}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Item to Cart (Emit Event)
        </button>
      </div>
    </div>
  );
}

export default Cart;
