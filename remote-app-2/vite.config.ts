import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote-app-2",
      filename: "remoteEntry2.js",
      exposes: {
        "./Cart": "./src/cart/Cart",
        "./cartSlice": "./src/store/cartSlice",
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
    origin: "http://localhost:5002",
    port: 5002,
  },
  build: {
    target: "chrome89",
  },
});
