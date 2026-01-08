import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote-app-1",
      filename: "remoteEntry1.js",
      remotes: {
        "shared-utils": {
          type: "module",
          entry: "http://localhost:5003/sharedEntry1.js",
          name: "shared-utils",
          shareScope: "default",
        },
      },
      exposes: {
        "./Button": "./src/components/Button",
        // './ProductCard': './src/components/ProductCard'
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
        "react-router-dom": {
          singleton: true,
          requiredVersion: dependencies["react-router-dom"],
        },
      },
    }),
  ],
  server: {
    origin: "http://localhost:5001",
    port: 5001,
  },
  build: {
    target: "chrome89",
  },
});
