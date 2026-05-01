import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={container}>
          <div style={box}>
            <h2 style={{ margin: "0 0 0.5rem", color: "#1e3a5f" }}>Something went wrong</h2>
            <p style={{ color: "#64748b", margin: "0 0 1rem", fontSize: "0.9rem" }}>
              The app encountered an unexpected error. Your progress saved to localStorage is safe.
            </p>
            <code style={errText}>{this.state.error?.message ?? "Unknown error"}</code>
            <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button style={reloadBtn} onClick={() => window.location.reload()}>
                Reload App
              </button>
              <button style={resetBtn} onClick={() => this.setState({ hasError: false, error: null })}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const container: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  height: "100vh", background: "linear-gradient(135deg, #1e3a5f, #0d6e8a)", padding: "1rem",
};
const box: React.CSSProperties = {
  background: "#fff", borderRadius: 16, padding: "2rem", maxWidth: 480,
  width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};
const errText: React.CSSProperties = {
  display: "block", background: "#fef2f2", border: "1px solid #fecaca",
  borderRadius: 8, padding: "0.6rem 0.9rem", fontSize: "0.8rem", color: "#dc2626",
  textAlign: "left", wordBreak: "break-word",
};
const reloadBtn: React.CSSProperties = {
  padding: "0.5rem 1.4rem", background: "#3b82f6", color: "#fff",
  border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer",
};
const resetBtn: React.CSSProperties = {
  padding: "0.5rem 1.2rem", background: "#e2e8f0",
  border: "none", borderRadius: 8, cursor: "pointer",
};
