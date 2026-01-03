# Learning Goals

This project is designed to help you master modern Micro-Frontend development. By exploring and modifying this codebase, you will learn:

## 1. Module Federation Fundamentals

- **Concept**: Understanding how code is shared at runtime between browser applications.
- **Configuration**: How to configure `exposes` and `remotes` in `module-federation.config.ts`.
- **Shared Dependencies**: How singleton sharing works to prevent duplicate libraries (React context issues).

## 2. Modern Build Tools (Rsbuild)

- Move away from Webpack complexity.
- Learn how **Rsbuild** provides zero-config TypeScript support and faster HMR (Hot Module Replacement).
- Understanding `rsbuild.config.ts`.

<!-- ## 3. TypeScript in Federation

- One of the hardest parts of MFE is typing.
- Learn how `@module-federation/enhanced` automatically provides types (`@mf-types`) so you get autocomplete and error checking for remote components, just like local code. -->

## 3. Architectural Patterns

- **Host vs Remote**: The shell pattern.
- **Shared Library**: Creating a dedicated remote (`shared-utils`) for utility functions and types, ensuring DRY (Don't Repeat Yourself) principles across boundaries.
- **Loosely Coupled Communication**: implementing an Event Bus pattern to allow apps to talk without hard dependencies.

## 4. Deployment Simulation

- Running multiple servers on different ports to simulate a real distributed environment on a local machine.
