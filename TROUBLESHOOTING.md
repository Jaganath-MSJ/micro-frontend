# Troubleshooting

Common issues and solutions for the Micro-Frontend project.

## 1. "Remote Module not found" or "Loading script failed"

**Symptoms**: The page loads but crashes, or the console shows errors about failing to fetch `remoteEntry.js`.

**Solutions**:

- **Check Ports**: Ensure the remote app is actually running on the expected port (e.g., 5001 for `remote-app-1`).
- **Check URL**: Try opening `http://localhost:5001/remoteEntry.js` in your browser. If it's 404, check your `module-federation.config.ts` filename setting.
- **CORS**: Ensure your development server allows CORS (Rsbuild usually handles this by default).

## 2. "Invalid Hook Call" or "Multiple React instances"

**Symptoms**: Error saying "Hooks can only be called inside the body of a function component" when using a component from a remote.

**Cause**: The Remote is bundling its own copy of React instead of using the Host's copy.

**Solutions**:

- **Check Singleton**: Ensure `react` and `react-dom` are in the `shared` section of `module-federation.config.ts` for **BOTH** the Host and the Remote.
- **Singleton Config**:
  ```typescript
  shared: {
    react: { singleton: true, requiredVersion: "..." },
    "react-dom": { singleton: true, requiredVersion: "..." },
  }
  ```

<!-- ## 3. Type Errors (TypeScript)

**Symptoms**: `Cannot find module 'remoteApp1/Button' or its corresponding type declarations.`

**Solutions**:

- **Wait**: The `@mf-types` system needs a moment to fetch types from the running remote.
- **Restart**: Restart the generic TS server or your IDE.
- **Run Type Sync**: Sometimes running a build cycle `npm run build` helps generate the initial types in the `@mf-types` directory.
- **Check Name**: Ensure the import string matches exactly the `remotes` key in your host config. -->

## 3. Port Conflicts

**Symptoms**: `Error: listen EADDRINUSE: address already in use :::5001`

**Solutions**:

- Another process is using the port.
- Kill the node process or change the port in `rsbuild.config.ts` (and update the consumer's `module-federation.config.ts` to match!).
