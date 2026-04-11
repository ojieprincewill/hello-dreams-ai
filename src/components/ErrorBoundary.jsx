import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#212121] text-[#010413] dark:text-white p-8">
          <div className="max-w-md text-center space-y-4">
            <p className="text-[22px] font-bold">Something went wrong</p>
            <p className="text-[16px] text-[#666] dark:text-[#aaa]">
              An unexpected error occurred in this section. Your other modules
              are unaffected.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2 bg-[#1342ff] text-white rounded-lg hover:bg-[#0f33cc] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
