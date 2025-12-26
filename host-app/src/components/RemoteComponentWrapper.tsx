import { type ReactNode, Suspense } from "react";
import { RemoteModuleErrorBoundary } from "./RemoteModuleErrorBoundary";

interface RemoteComponentWrapperProps {
  children: ReactNode;
  moduleName: string;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Convenience wrapper that combines Suspense and ErrorBoundary for remote modules
 *
 * This provides a clean API for loading remote components with proper error handling
 * and loading states.
 *
 * @example
 * ```tsx
 * <RemoteComponentWrapper
 *   moduleName="remoteApp1/Button"
 *   fallback={<LoadingSpinner />}
 * >
 *   <Remote1Button />
 * </RemoteComponentWrapper>
 * ```
 */
export function RemoteComponentWrapper({
  children,
  moduleName,
  fallback = <DefaultLoadingFallback moduleName={moduleName} />,
  errorFallback,
  onError,
}: RemoteComponentWrapperProps) {
  return (
    <RemoteModuleErrorBoundary
      moduleName={moduleName}
      fallback={errorFallback}
      onError={onError}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </RemoteModuleErrorBoundary>
  );
}

/**
 * Default loading fallback component
 */
function DefaultLoadingFallback({ moduleName }: { moduleName: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "#666",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <p>Loading {moduleName}...</p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
