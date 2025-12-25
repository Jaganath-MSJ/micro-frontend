import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";
import { dependencies } from "./package.json";

export default createModuleFederationConfig({
  name: "remoteApp2",
  filename: "remoteEntry2.js",
  remotes: {
    sharedUtils: "sharedUtils@http://localhost:5003/sharedEntry1.js",
  },
  exposes: {
    "./Cart": "./src/cart/Cart",
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies.react,
    },
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
  implementation: require.resolve('@module-federation/runtime-tools'),
});
