# Getting Started

Welcome to the **Micro-frontend Project**! This repository demonstrates a micro-frontend architecture using **Rsbuild**, **React**, and **Module Federation Enhanced**.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: (Comes with Node.js)
- **Windows Terminal** (Recommended for the `npm run dev:all` script)

## Installation

This project is set up as a monorepo-style structure with individual packages. You can install dependencies for all applications with a single command from the root directory.

```bash
npm run install:all
```

Alternatively, you can install dependencies manually for each application:

```bash
cd host-app && npm install
cd ../remote-app-1 && npm install
cd ../remote-app-2 && npm install
cd ../shared-utils && npm install
```

## Running the Project

To start all applications simultaneously (Host + Remotes + Shared Utils), run:

```bash
npm run dev:all
```

> **Note**: This command uses `wt` (Windows Terminal) to open new tabs for each service. If you are not on Windows or don't have Windows Terminal, you may need to run each app in a separate terminal window:

### Manual Start

1. **Shared Utils** (Port 5003)

   ```bash
   cd shared-utils
   npm run dev
   ```

2. **Remote App 1** (Port 5001)

   ```bash
   cd remote-app-1
   npm run dev
   ```

3. **Remote App 2** (Port 5002)

   ```bash
   cd remote-app-2
   npm run dev
   ```

4. **Host App** (Port 5000)
   ```bash
   cd host-app
   npm run dev
   ```

Open [http://localhost:5000](http://localhost:5000) to view the Host Application.

## Development Scripts

The root `package.json` includes several convenience scripts:

- `npm run dev:all`: Starts all apps.
- `npm run build:all`: Builds all apps.
- `npm run lint:all`: Lints all apps.
- `npm run del-temp:all`: Cleans build artifacts and module federation temp files.
