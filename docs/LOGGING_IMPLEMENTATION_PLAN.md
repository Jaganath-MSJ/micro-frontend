# Implementation Plan - Comprehensive Logging & Lifecycle Tracking

This plan outlines the steps to implement a custom logger utility and a Module Federation runtime plugin to track module loading lifecycle events (success, failure, timing).

## Best Practices & Rationale

### 1. Centralized & Typed Logging

- **Why**: In a distributed system like micro-frontends, having consistent log formats (JSON, timestamps, log levels) across all apps is crucial for debugging.
- **Approach**: Create a single `Logger` class in `shared-utils`. This ensures `host-app` and all remotes use the exact same logging logic.

### 2. Module Federation Runtime Plugins

- **Why**: Ad-hoc logging scattered in components is unreliable for tracking when a remote _starts_ or _fails_ to load.
- **Approach**: Use `@module-federation/enhanced/runtime` or standard runtime hooks. We will effectively "hook" into the loading process. Since we are using `@module-federation/vite`, we will create a custom runtime plugin that intercepts `beforeRequest`, `onLoad`, and `errorLoadRemote`.
- **Benefit**: This allows us to capture the _exact_ moment a network request is made for a remote entry file.

### 3. Performance API vs Date.now()

- **Why**: `Date.now()` is susceptible to system clock changes and has lower precision.
- **Approach**: Use `performance.now()` (floats with microsecond precision) to measure load times. We will also use `performance.mark` and `performance.measure` so these events show up visually in the **Chrome DevTools Performance tab**.

### 4. Error Handling & Fallbacks

- **Why**: A remote failing should not crash the host.
- **Approach**: The `errorLoadRemote` hook allows us to log the error specifically and can even be used to trigger fallback UIs (though for this task, we focus on the _reporting_ aspect).

## Proposed Changes

### Shared Utils (`shared-utils`)

#### [NEW] [logger.ts](file:///d:/Projects/mirco-frontend/shared-utils/src/utils/logger.ts)

- Create a `Logger` class with methods: `info`, `warn`, `error`, `debug`.
- Support log levels and optional timestamping.

#### [MODIFY] [index.ts](file:///d:/Projects/mirco-frontend/shared-utils/src/utils/index.ts)

- Export the `Logger` class.

#### [MODIFY] [vite.config.ts](file:///d:/Projects/mirco-frontend/shared-utils/vite.config.ts)

- Ensure the logger is exposed (already covers `./src/utils/index`).

### Host Application (`host-app`)

#### [NEW] [logger.ts](file:///d:/Projects/mirco-frontend/host-app/src/utils/logger.ts)

- Create a local copy of the `Logger` class for the host to use independently of remotes.

#### [NEW] [federationLogger.ts](file:///d:/Projects/mirco-frontend/host-app/src/plugins/federationLogger.ts)

- Implement a Module Federation Runtime Plugin.
- Hooks to implement:
  - `beforeRequest`: Log start of request.
  - `onLoad`: Log success and duration.
  - `errorLoadRemote`: Log errors with details.
- Use `Performance API` (performance.now()) for accurate timing.

#### [MODIFY] [vite.config.ts](file:///d:/Projects/mirco-frontend/host-app/vite.config.ts)

- Register the `federationLogger` plugin in the `federation` configuration using `runtimePlugins`.

## Verification Plan

### Manual Verification

1.  **Start Applications**: Run `host-app` and remotes.
2.  **Console Check**: Open the browser console (F12) for `host-app`.
3.  **Verify Logs**:
    - Observe logs indicating "Loading remote: ..."
    - Observe logs indicating "Loaded remote: ... (took Xms)"
    - Intentionally stop a remote (e.g., `remote-app-1`) and refresh `host-app`.
    - Observe "Error loading remote: ..." logs.
