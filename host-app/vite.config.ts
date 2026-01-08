import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { dependencies } from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host-app",
      exposes: {
        "./store": "./src/store/store",
        "./userSlice": "./src/store/userSlice",
      },
      remotes: {
        "remote-app-1": {
          type: "module",
          entry: "http://localhost:5001/remoteEntry1.js",
          name: "remote-app-1",
          shareScope: "default",
        },
        "remote-app-2": {
          type: "module",
          entry: "http://localhost:5002/remoteEntry2.js",
          name: "remote-app-2",
          shareScope: "default",
        },
        "shared-utils": {
          type: "module",
          entry: "http://localhost:5003/sharedEntry1.js",
          name: "shared-utils",
          shareScope: "default",
        },
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
      // hostInitInjectLocation: "html",
      runtimePlugins: ["./src/plugins/federationLogger.ts"],
    }),
  ],
  server: {
    origin: "http://localhost:5000",
    port: 5000,
    open: true,
  },
  build: {
    target: "chrome89",
  },
});
