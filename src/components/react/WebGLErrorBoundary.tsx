import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render-time errors from the carousel below it — WebGL context
// creation can throw synchronously on a browser/device with no WebGL
// support at all, which a try/catch inside the engine itself can't guard
// against once React has already started rendering that subtree.
export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function WebGLFallback({ className, message }: { className?: string; message: string }) {
  return (
    <div className={className} role="status">
      {message}
    </div>
  );
}
