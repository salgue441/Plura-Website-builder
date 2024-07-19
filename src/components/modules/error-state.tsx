"use client";

import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary component
 * @component
 * @version 1.0.0
 *
 * @param children: ReactNode - The children to render.
 * @param fallback: ReactNode - The fallback component to
 *                  render when an error occurs.
 * @returns The error boundary component.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /**
   * Catches uncaught errors
   *
   * @param error: Error - The error that was thrown.
   * @param errorInfo: ErrorInfo - The error info.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  /**
   * Renders the error boundary component
   *
   * @returns ReactNode - The rendered component.
   * @override
   * @protected @method
   */
  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
