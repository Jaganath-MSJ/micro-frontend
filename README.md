# Micro-Frontend Architecture

A modern micro-frontend application built with **Module Federation Enhanced**, **Rsbuild**, and **React 19**. This project demonstrates a scalable architecture where multiple independent applications work together seamlessly.

## 🏗️ Architecture

This monorepo contains four interconnected applications:

- **host-app** - Main container application that orchestrates remote modules
- **remote-app-1** - Independent micro-frontend exposing reusable components
- **remote-app-2** - Independent micro-frontend exposing reusable components
- **shared-utils** - Shared utilities, types, and common functionality

## 🚀 Tech Stack

- **Build Tool**: [Rsbuild](https://rsbuild.dev/) - Fast Rspack-based build tool
- **Module Federation**: [@module-federation/enhanced](https://module-federation.io/) v0.22.0
- **Framework**: React 19.2.0
- **State Management**: Redux Toolkit 2.11.0
- **Routing**: React Router DOM 7.1.1
- **Type Safety**: TypeScript 5.9.3
- **Linting**: ESLint 9 with TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Windows Terminal (for `dev-all` script)

## 🛠️ Installation

Install dependencies for all applications:

```bash
npm run install-all
```

Or install individually:

```bash
cd host-app && npm install
cd remote-app-1 && npm install
cd remote-app-2 && npm install
cd shared-utils && npm install
```

## 🏃 Development

### Run All Applications

Start all applications simultaneously in separate Windows Terminal tabs:

```bash
npm run dev-all
```

This will start:

1. `shared-utils` (dependency first)
2. `remote-app-2`
3. `remote-app-1`
4. `host-app`

### Run Individual Applications

```bash
npm run dev-host-app        # Start host application
npm run dev-remote-app-1    # Start remote app 1
npm run dev-remote-app-2    # Start remote app 2
npm run dev-shared-utils    # Start shared utilities
```

Or navigate to individual directories:

```bash
cd host-app && npm run dev
```

## 🏗️ Build

Build all applications for production:

```bash
npm run build-all
```

Build individually:

```bash
cd host-app && npm run build
```

## 🧹 Maintenance

### Linting

```bash
npm run lint-all            # Lint all applications
```

### Clean Temporary Files

```bash
npm run del-temp-all        # Remove dist folders
```

### Remove Node Modules

```bash
npm run del-node-modules-all  # Remove all node_modules
```

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- [Error Handling Architecture](docs/ERROR_HANDLING_ARCHITECTURE.md)
- [Error Boundary Testing](docs/ERROR_BOUNDARY_TESTING.md)
- [Event Bus Guide](docs/EVENT_BUS_GUIDE.md)
- [Event Bus Implementation Plan](docs/EVENT_BUS_IMPLEMENTATION_PLAN.md)
- [Micro-Frontend Analysis](docs/MICRO_FRONTEND_ANALYSIS.md)
- [Navigation Best Practices](docs/NAVIGATION_BEST_PRACTICES.md)
- [Navigation Implementation Plan](docs/NAVIGATION_IMPLEMENTATION_PLAN.md)

## 🏛️ Project Structure

```
micro-frontend/
├── host-app/              # Main container application
│   ├── src/
│   ├── rsbuild.config.ts
│   └── package.json
├── remote-app-1/          # Remote micro-frontend 1
│   ├── src/
│   ├── rsbuild.config.ts
│   └── package.json
├── remote-app-2/          # Remote micro-frontend 2
│   ├── src/
│   ├── rsbuild.config.ts
│   └── package.json
├── shared-utils/          # Shared utilities and types
│   ├── src/
│   ├── rsbuild.config.ts
│   └── package.json
├── docs/                  # Documentation
└── package.json           # Root package.json with scripts
```

## 🔑 Key Features

- **Independent Deployment** - Each micro-frontend can be deployed independently
- **Type Federation** - Shared TypeScript types across all applications
- **Shared State Management** - Redux Toolkit for global state
- **Cross-App Navigation** - Seamless routing between micro-frontends
- **Error Boundaries** - Isolated error handling to prevent cascading failures
- **Event Bus** - Inter-app communication system
- **Hot Module Replacement** - Fast development experience

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint-all`
4. Build all apps: `npm run build-all`
5. Submit a pull request

## 📝 License

This project is private and not licensed for public use.

## 🔧 Troubleshooting

### Port Conflicts

If you encounter port conflicts, check the Rsbuild configuration in each application's `rsbuild.config.ts` file.

### Build Failures

1. Clean all temporary files: `npm run del-temp-all`
2. Remove node_modules: `npm run del-node-modules-all`
3. Reinstall dependencies: `npm run install-all`
4. Rebuild: `npm run build-all`

### Type Errors

Ensure all applications are built in the correct order (shared-utils first) to generate type definitions used by other apps.

## 📞 Support

For issues or questions, please refer to the documentation in the `docs/` folder or create an issue in the repository.
