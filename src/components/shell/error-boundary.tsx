import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Top-level error boundary — the app fails closed, never blank. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled render error", error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <main className="grid min-h-screen place-items-center bg-ink p-6">
          <div className="hairline w-full max-w-md rounded-[4px] bg-panel p-6 text-center">
            <p className="eyebrow">Fault</p>
            <h1 className="mt-2 font-display text-xl font-semibold text-bone">
              The interface hit an unrecoverable error
            </h1>
            <p className="mt-2 text-sm text-fog">
              Nothing was transmitted. Your keys and local state are intact. Reload to continue.
            </p>
            <p className="mt-3 font-mono text-xs break-all text-dim">
              {this.state.error.message}
            </p>
            <Button
              variant="primary"
              className="mt-5"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
