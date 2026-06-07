import React from 'react';
import { showToast } from '../utils/toastHelper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    showToast({ message: error?.message || "An unexpected error occurred", status: "error" });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-red-500/20 rounded-lg bg-red-500/10 text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Component Error</h3>
          <p className="text-sm text-gray-400 mb-4">Something went wrong while displaying this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
