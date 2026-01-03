# Technologies

This project utilizes a modern stack designed for high-performance micro-frontends.

## Core Framework

- **React**: `v19.2.3` - The library for web and native user interfaces.
- **TypeScript**: `~5.9.3` - For static type checking and better developer experience.

## Build & Bundling

- **Rsbuild**: `^1.7.1` - A high-performance build tool based on Rspack. It replaces Vite/Webpack for faster builds.
- **Rspack**: The underlying Rust-based bundler powering Rsbuild.

## Micro-Frontend Architecture

- **Module Federation Enhanced**: `@module-federation/enhanced` (`^0.22.0`)
  - Provides advanced federation capabilities beyond the standard Webpack plugin.
  - Handles runtime sharing, type federation (`@mf-types`), and version management.
- **@module-federation/rsbuild-plugin**: Bridges Rsbuild with Module Federation.

## State Management & Communication

- **Redux Toolkit**: `@reduxjs/toolkit` (`^2.11.2`) - Standard logic for Redux state management.
- **React Redux**: `^9.2.0` - Bindings for React.
- **Mitt**: `^3.0.1` (in `shared-utils`) - A tiny functional event emitter, used for cross-micro-frontend communication (Event Bus).

## Routing

- **React Router**: `^7.11.0` - For client-side routing within the Host and Remotes.

## Linting & Quality

- **ESLint**: `^9.39.2`
- **TypeScript ESLint**: `^8.51.0`
