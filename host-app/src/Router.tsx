import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Button from "./pages/remote-1/Button";
import { RemoteComponentWrapper } from "./errorBoundary.exports";

const types = await import("shared-utils/types");

// Lazy load remotes
const Remote2Cart = lazy(() => import("remote-app-2/Cart"));

const Home = () => (
  <div>
    <h2>Home Page</h2>
    <p>Welcome to the Micro-Frontend Demo</p>
  </div>
);
const NotFound = () => (
  <div>
    <h2>404 - Not Found</h2>
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={`${types.ROUTES.HOME}`} element={<Home />} />

        {/* Remote 1 Routes */}
        <Route
          path={`${types.ROUTES.REMOTE1.ROOT}`}
          element={
            <RemoteComponentWrapper moduleName="remote-app-1/Button">
              <Button />
            </RemoteComponentWrapper>
          }
        />

        {/* Remote 2 Routes */}
        <Route
          path={`${types.ROUTES.REMOTE2.CART}`}
          element={
            <RemoteComponentWrapper moduleName="remote-app-2/Cart">
              <Remote2Cart />
            </RemoteComponentWrapper>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
