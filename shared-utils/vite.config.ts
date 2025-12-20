import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shared-utils",
      filename: "sharedEntry1.js",
      exposes: {
        "./hooks": "./src/hooks/index",
        "./utils": "./src/utils/index",
        "./eventBus": "./src/eventBus",
        "./eventTypes": "./src/eventTypes",
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
        "react-redux": {
          singleton: true,
          requiredVersion: dependencies["react-redux"],
        },
        "@reduxjs/toolkit": {
          singleton: true,
          requiredVersion: dependencies["@reduxjs/toolkit"],
        },
      },
    }),
  ],
  server: {
    origin: "http://localhost:5003",
    port: 5003,
  },
  build: {
    target: "chrome89",
  },
});
