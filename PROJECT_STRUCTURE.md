# Project Structure

This project follows a specialized micro-frontend directory structure, separating the host (container) from remote (feature) applications and shared utilities.

## Directory Overview

```text
/
├── host-app/          # Main Container Application
│   ├── src/
│   ├── module-federation.config.ts  # Federation config (consumes remotes)
│   └── rsbuild.config.ts            # Build config (Port 5000)
│
├── remote-app-1/      # Feature Application 1
│   ├── src/
│   │   └── components/
│   │       └── Button # Exposed component
│   ├── module-federation.config.ts  # Exposes './Button'
│   └── rsbuild.config.ts            # Build config (Port 5001)
│
├── remote-app-2/      # Feature Application 2
│   ├── src/
│   ├── module-federation.config.ts  # Configured as remote
│   └── rsbuild.config.ts            # Build config (Port 5002)
│
├── shared-utils/      # Shared Logic Library
│   ├── src/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── eventBus/  # Cross-app communication
│   │   └── types/
│   ├── module-federation.config.ts  # Exposes logic, types, eventBus
│   └── rsbuild.config.ts            # Build config (Port 5003)
│
├── docs/              # Documentation files
└── package.json       # Root scripts for orchestration
```

## Key Files

- **rsbuild.config.ts**: Configuration for the Rsbuild tool, setting up ports and React plugins.
- **module-federation.config.ts**: The heart of the micro-frontend setup. Defines `name`, `exposes` (what this app shares), `remotes` (what this app consumes), and `shared` dependencies.
- **package.json**: Standard Node.js package file. Note the `dependencies` vs `devDependencies`. React must be shared as a singleton.

## Application Roles

- **Host App**: The shell. It handles the main layout, routing, and composition of remote applications. It usually doesn't own business logic but orchestrates it.
- **Remote Apps**: Standalone features that can be developed and deployed independently. They expose components (like Buttons, Widgets, full Pages) to the Host.
- **Shared Utils**: A specialized remote that exports _functions_, _hooks_, and _types_ rather than UI components. It ensures consistency across the platform.
