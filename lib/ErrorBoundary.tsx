import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#0b1121] flex items-center justify-center p-6">
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Something went wrong</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-[#0f639e] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#0f639e]/80 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
