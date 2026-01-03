# Architecture

This document describes the high-level architecture of the micro-frontend system.

## System Overview

The system allows independent development and deployment of features (`remote-app-1`, `remote-app-2`) while aggregating them into a single cohesive application (`host-app`).

```mermaid
graph TD
    subgraph Browser
        Host[Host App<br/>(Port 5000)]
        Remote1[Remote App 1<br/>(Port 5001)]
        Remote2[Remote App 2<br/>(Port 5002)]
        Shared[Shared Utils<br/>(Port 5003)]
    end

    Host -->|Consumes| Remote1
    Host -->|Consumes| Remote2
    Host -->|Consumes| Shared
    Remote1 -->|Consumes| Shared
    Remote2 -->|Consumes| Shared
```

## Module Federation Config

- **Host App**: The consumer. It does not expose modules itself but loads them at runtime.
- **Remotes**:
  - `remoteApp1` exposes `Button` component.
  - `sharedUtils` exposes common logic (`hooks`, `utils`, `eventBus`) and types.

## Data Flow

### 1. Shared State (Redux)

Each application maintains its own Redux store. While it is possible to share a single store instance, this project likely encourages isolation or specific patterns for state sharing.

> _Note: Typically in MFE, local state stays local. Global state (Auth, Theme) can be passed down or managed via a shared singleton._

### 2. Event Bus

A **Mitt**-based event bus is exposed from `shared-utils`. This allows loose coupling between apps.

- **Publisher**: Any app can emit an event (e.g., `remote-app-1` emits `USER_CLICKED`).
- **Subscriber**: Any app can listen for events (e.g., `host-app` listens for `USER_CLICKED` to show a notification).

## Dependencies Sharing

To prevent loading multiple copies of React, the `module-federation.config.ts` enforces **Singleton** mode for:

- `react`
- `react-dom`
- `react-redux`
- `@reduxjs/toolkit`

This ensures that hooks like `useState` or `useSelector` work correctly across the application boundaries.
