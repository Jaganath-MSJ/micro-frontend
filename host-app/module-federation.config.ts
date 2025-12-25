import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";
import { dependencies } from "./package.json";

export default createModuleFederationConfig({
  name: "hostApp",
  remotes: {
    remoteApp1: "remoteApp1@http://localhost:5001/remoteEntry1.js",
    remoteApp2: "remoteApp2@http://localhost:5002/remoteEntry2.js",
    sharedUtils: "sharedUtils@http://localhost:5003/sharedEntry1.js",
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
