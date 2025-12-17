import React, { Component, type ReactNode } from "react";

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level Error Boundary for the entire application
 *
 * This catches any errors that escape the module-specific error boundaries
 * and prevents the entire app from crashing.
 */
export class AppErrorBoundary extends Component<
  { children: ReactNode },
  AppErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console in development
    console.error("[App Error Boundary] Caught error:", error, errorInfo);

    // In production, report to monitoring service
    if (import.meta.env.PROD) {
      // TODO: Send to monitoring service
      console.error("[Production Error]", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            backgroundColor: "#f5f5f5",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😕</div>
            <h1 style={{ color: "#d32f2f", marginBottom: "1rem" }}>
              Application Error
            </h1>
            <p style={{ color: "#666", marginBottom: "2rem" }}>
              We're sorry, but something went wrong. Please try reloading the
              application.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginBottom: "2rem",
                  textAlign: "left",
                  padding: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  color: "#d32f2f",
                }}
                open={false}
              >
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                  Error Details (Development Mode)
                </summary>
                <pre
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    overflow: "auto",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReload}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "white",
                backgroundColor: "#2196f3",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2196f3")
              }
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
