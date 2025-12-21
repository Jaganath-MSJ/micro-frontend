import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Button from "./pages/remote-1/Button";
import { RemoteComponentWrapper } from "./errorBoundary.exports";

const types = await import("shared-utils/types");

// Lazy load remotes
const Remote2Cart = lazy(() => import("remote-app-2/Cart"));
// For Remote 1, we plan to expose routes/index, but currently we only can assume what is available or stub it.
// The plan says we WILL update remotes. For now, let's keep existing components or stub new ones.
// Current Host App loads Button from remote-1.
// We'll update this once remotes expose routes.
// For now, let's setup the structure.

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

        {/* Remote 1 Routes - Placeholder until Remote 1 is updated */}
        <Route
          path={`${types.ROUTES.REMOTE1.ROOT}`}
          element={
            <RemoteComponentWrapper
              moduleName="remote-app-1/Button"
              fallback={<div>Loading remote 1 button component...</div>}
            >
              <Button />
            </RemoteComponentWrapper>
          }
        />

        {/* Remote 2 Routes */}
        <Route
          path={`${types.ROUTES.REMOTE2.CART}`}
          element={
            <RemoteComponentWrapper
              moduleName="remote-app-2/Cart"
              fallback={<div>Loading remote 2 cart component...</div>}
            >
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
