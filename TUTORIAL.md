# Tutorial: Adding a New Shared Component

This tutorial guides you through creating a new component in a Remote application and consuming it in the Host application.

## Step 1: Create the Component

In `remote-app-1`, create a new file `src/components/Header.tsx`:

```tsx
import React from "react";

const Header = ({ title }: { title: string }) => {
  return (
    <div style={{ padding: "10px", background: "#333", color: "white" }}>
      <h1>{title}</h1>
    </div>
  );
};

export default Header;
```

## Step 2: Expose the Component

Open `remote-app-1/module-federation.config.ts` and add the new component to the `exposes` object:

```typescript
export default createModuleFederationConfig({
  name: "remoteApp1",
  // ...
  exposes: {
    "./Button": "./src/components/Button",
    "./Header": "./src/components/Header", // Add this line
  },
  // ...
});
```

_Note: You may need to restart the development server for `remote-app-1` if the changes aren't picked up immediately._

## Step 3: Consume in Host App

In `host-app`, you can now import this component. Because we are using Module Federation Enhanced with Type Federation, you may need to wait a moment for the types to sync (or run the build).

Open `host-app/src/App.tsx`:

```tsx
// The import path matches the 'remotes' key in host's config + the 'exposes' key in remote's config
import Header from "remoteApp1/Header";

const App = () => {
  return (
    <div>
      <Header title="Micro-Frontend Host" />
      <p>Welcome to the host application!</p>
    </div>
  );
};

export default App;
```

## Step 4: Verify

1. Ensure both apps are running.
2. Refresh the Host App (localhost:5000).
3. You should see the dark header rendered from the Remote App.
