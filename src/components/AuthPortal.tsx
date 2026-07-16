import React, { useState } from "react";
import { Sparkles, Shield, User, Lock, Key, ArrowRight, Bot, Info, Globe } from "lucide-react";

interface AuthPortalProps {
  onLogin: (email: string, role: "agency" | "client") => void;
}

export default function AuthPortal({ onLogin }: AuthPortalProps) {
  const [activeRole, setActiveRole] = useState<"agency" | "client">("agency");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAccessKeys, setShowAccessKeys] = useState(false);

  const handleDemoLogin = (role: "agency" | "client") => {
    setIsSubmitting(true);
    setError("");
    setTimeout(() => {
      if (role === "agency") {
        onLogin("agency@seopilot.ai", "agency");
      } else {
        onLogin("client@abccreative.studio", "client");
      }
      setIsSubmitting(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Realistic authentication flow simulation
    setTimeout(() => {
      // If client is typed, log in as client, otherwise agency
      const isClientEmail = email.toLowerCase().includes("client") || email.toLowerCase().includes("studio");
      onLogin(email.trim(), isClientEmail ? "client" : "agency");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Visual background ambient details */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-sky-500/10 to-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-sky-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="w-full max-w-md space-y-6 z-10 animate-fade-in">
        
        {/* Branding Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-indigo-500/20 mb-1">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white">SEOPilot AI Client Portal</h1>
            <p className="text-slate-400 text-xs mt-1">
              Premium SEO Audit & White-Label Reporting Workspace
            </p>
          </div>
        </div>

        {/* Portal Main Card */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900/80 rounded-2xl p-6 shadow-2xl shadow-black/60 relative overflow-hidden">
          
          {/* Card Border glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent"></div>
          
          {/* Tabs header */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/60 border border-slate-900 rounded-xl mb-6">
            <button
              id="auth-tab-agency"
              type="button"
              onClick={() => {
                setActiveRole("agency");
                setError("");
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg font-sans transition-all flex items-center justify-center gap-1.5 ${
                activeRole === "agency"
                  ? "bg-slate-900 text-sky-400 shadow-md border border-slate-800"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Agency Administrator</span>
            </button>
            <button
              id="auth-tab-client"
              type="button"
              onClick={() => {
                setActiveRole("client");
                setError("");
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg font-sans transition-all flex items-center justify-center gap-1.5 ${
                activeRole === "client"
                  ? "bg-slate-900 text-sky-400 shadow-md border border-slate-800"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Client Portal</span>
            </button>
          </div>

          {/* Tab Description Context */}
          <div className="mb-6 p-3 bg-slate-950/40 border border-slate-900/60 rounded-xl">
            {activeRole === "agency" ? (
              <p className="text-[11px] text-slate-400 font-sans leading-normal">
                <span className="text-sky-400 font-bold block mb-0.5">AGENCY MASTER ACCOUNT</span>
                Full control over clients and domains. Run SEO audits, perform organic keyword analysis, generate blog briefs, and access the consulting copilot.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 font-sans leading-normal">
                <span className="text-sky-400 font-bold block mb-0.5">WHITE-LABEL CLIENT ACCESS</span>
                Restricted client dashboard customized with white-labeled agency descriptors. View latest audited scores, browse metrics checklist, and submit payment method.
              </p>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeRole === "agency" ? "agency@seopilot.ai" : "client@abccreative.studio"}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 focus:border-sky-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600" />
                <input
                  id="auth-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 focus:border-sky-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-400 font-medium font-sans">{error}</p>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 mt-4 shadow-lg shadow-sky-500/10 cursor-pointer font-sans"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-900/60"></div>
              <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-600 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-slate-900/60"></div>
            </div>

            <button
              id="auth-guest-btn"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setIsSubmitting(true);
                setError("");
                setTimeout(() => {
                  onLogin("guest@seopilot.ai", "agency");
                  setIsSubmitting(false);
                }, 600);
              }}
              className="w-full py-3 bg-slate-950 hover:bg-slate-900/80 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <span>Explore with Free Guest Tier</span>
              <Globe className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </form>

          {/* Collapsible Quick-fill Demo Accounts */}
          <div className="mt-5 pt-4 border-t border-slate-900/60 text-center">
            <button
              id="toggle-access-keys-btn"
              type="button"
              onClick={() => setShowAccessKeys(!showAccessKeys)}
              className="text-[10px] font-mono font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Key className="w-3 h-3 text-slate-600" />
              <span>{showAccessKeys ? "Hide Sandbox Access Keys" : "Show Sandbox Access Keys"}</span>
            </button>
            
            {showAccessKeys && (
              <div className="grid grid-cols-2 gap-3 mt-3 animate-fade-in">
                <button
                  id="demo-agency-btn"
                  type="button"
                  onClick={() => handleDemoLogin("agency")}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold font-sans transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px]">Demo Agency Admin</span>
                  <span className="text-[8px] text-slate-500 font-mono">agency@seopilot.ai</span>
                </button>
                <button
                  id="demo-client-btn"
                  type="button"
                  onClick={() => handleDemoLogin("client")}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold font-sans transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px]">Demo Client Portal</span>
                  <span className="text-[8px] text-slate-500 font-mono">client@abccreative.studio</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Security Trust Info footer */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
          <Key className="w-3.5 h-3.5 text-slate-600" />
          <span>Client tokens signed securely using local proxy headers.</span>
        </div>

      </div>
    </div>
  );
}
