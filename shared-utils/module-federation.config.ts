import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";
import { dependencies } from "./package.json";

export default createModuleFederationConfig({
  name: "sharedUtils",
  filename: "sharedEntry1.js",
  exposes: {
    "./hooks": "./src/hooks/index",
    "./utils": "./src/utils/index",
    "./eventBus": "./src/eventBus",
    "./eventTypes": "./src/eventTypes",
    "./types": "./src/types/index",
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      // requiredVersion: dependencies.react,
    },
    "react-dom": {
      singleton: true,
      // requiredVersion: dependencies["react-dom"],
    },
    "react-redux": {
      singleton: true,
      // requiredVersion: dependencies["react-redux"],
    },
    "@reduxjs/toolkit": {
      singleton: true,
      // requiredVersion: dependencies["@reduxjs/toolkit"],
    },
  },
  // dts: true,
});
