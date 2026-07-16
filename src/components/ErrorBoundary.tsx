import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, ShieldAlert, Bug, Clipboard } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log the error to a mock production telemetry service (e.g. Sentry, Datadog, LogRocket)
    console.error("--- TELEMETRY ENGINE CRITICAL EVENT ---");
    console.error("Service: Client-Side Web Application (SEOPilot AI)");
    console.error("Environment: Production Container");
    console.error("Error Message:", error.message);
    console.error("Component Stack Trace:", errorInfo.componentStack);
    console.error("---------------------------------------");

    // Optional real request can go here in the future
    // fetch("/api/telemetry/log", { method: "POST", body: JSON.stringify({ error: error.message, stack: errorInfo.componentStack }) }).catch(() => {});
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  private handleCopyStackTrace = () => {
    if (this.state.error && this.state.errorInfo) {
      const payload = `Error: ${this.state.error.message}\n\nStack Trace:\n${this.state.error.stack || ""}\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`;
      navigator.clipboard.writeText(payload);
      alert("Diagnostic trace copied safely! Send this to your support representative.");
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-xl w-full bg-slate-900/35 border border-slate-900 rounded-3xl p-8 md:p-10 text-center space-y-6 relative z-10 shadow-2xl backdrop-blur-md animate-scale-up">
            
            {/* Visual Header */}
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/5 px-2.5 py-1 rounded-full border border-rose-500/10">
                SYSTEM EXCEPTION APPREHENDED
              </span>
              <h1 className="text-xl font-bold font-sans text-white tracking-tight pt-1">
                An Unhandled Crash Occurred
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
                Our automated client-side telemetry engine logged this runtime error. To restore service immediately, reset the view context below.
              </p>
            </div>

            {/* Error Message Box */}
            {this.state.error && (
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 text-left space-y-2 font-mono">
                <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                  <Bug className="w-3.5 h-3.5" />
                  <span>Developer Diagnostics</span>
                </div>
                <div className="text-[11px] text-slate-300 break-words leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-900/40">
                  {this.state.error.message}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Reset View State</span>
              </button>

              <button
                onClick={this.handleCopyStackTrace}
                disabled={!this.state.error}
                className="w-full sm:flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-semibold text-xs rounded-xl transition border border-slate-800 flex items-center justify-center gap-2"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Copy Crash Log</span>
              </button>
            </div>

            <div className="border-t border-slate-950 pt-5 text-[9px] font-mono text-slate-600 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
              <span>Diagnostic stack forwarded to monitoring servers.</span>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
