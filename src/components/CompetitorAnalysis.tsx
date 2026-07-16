import React, { useState } from "react";
import { 
  Users, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Crown,
  Lock,
  ArrowUpRight,
  Info
} from "lucide-react";
import { CompetitorComparison } from "../types";

export default function CompetitorAnalysis() {
  const [userUrl, setUserUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<CompetitorComparison | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUrl.trim() || !competitorUrl.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/competitor/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userUrl, competitorUrl }),
      });
      const data = await response.json();
      setComparisonResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">SEO Competitor Analysis</h2>
        <p className="text-slate-400 text-sm mt-1">Audit your domain directly against your chief competitors to outline actionable bypass steps</p>
      </div>

      {/* Input Comparison Form */}
      <form onSubmit={handleCompare} className="p-6 bg-slate-900/30 rounded-2xl border border-slate-900 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">My Website URL</label>
            <input
              type="text"
              required
              value={userUrl}
              onChange={(e) => setUserUrl(e.target.value)}
              placeholder="e.g. abccreative.studio"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Competitor's URL</label>
            <input
              type="text"
              required
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="e.g. competitor-agency.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl text-xs font-semibold font-sans shadow-lg shadow-sky-500/10 flex items-center gap-1.5 transition whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Comparing Sites...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Run Comparison Audit</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Display Results */}
      {!comparisonResult ? (
        <div className="text-center py-24 bg-slate-900/10 border border-slate-900 rounded-2xl">
          <Users className="w-12 h-12 text-slate-700 mx-auto stroke-1 mb-4" />
          <h3 className="text-sm font-semibold text-slate-300">No comparison audited</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
            Supply your target business URL and competitor URL to isolate gaps in referring backlink footprints, loading metrics, and metadata.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Winner Banner */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Crown className="w-5 h-5 stroke-1.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {comparisonResult.userScore >= comparisonResult.competitorScore 
                    ? "Your Website is in the SEO Lead! 🎉" 
                    : "Competitor Leads overall authority score ⚠️"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comparing {comparisonResult.userScore}/100 score against {comparisonResult.competitorScore}/100.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 text-center min-w-[80px]">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Your Score</span>
                <span className="text-sm font-bold text-slate-200 mt-1 block">{comparisonResult.userScore}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 text-center min-w-[80px]">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">COMPETITOR</span>
                <span className="text-sm font-bold text-slate-300 mt-1 block">{comparisonResult.competitorScore}</span>
              </div>
            </div>
          </div>

          {/* Metric Comparison Table */}
          <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
            <h3 className="text-sm font-bold text-white font-sans pb-3 mb-4 border-b border-slate-900">Side-by-Side Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-900 pb-3">
                    <th className="py-2.5 font-bold">SEO Metric</th>
                    <th className="py-2.5 font-bold">My Website ({comparisonResult.userUrl})</th>
                    <th className="py-2.5 font-bold">Competitor ({comparisonResult.competitorUrl})</th>
                    <th className="py-2.5 font-bold text-right">Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {comparisonResult.comparison.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 transition">
                      <td className="py-3.5 font-bold font-sans text-slate-200">{item.metric}</td>
                      <td className="py-3.5 font-mono text-[11px]">{item.userValue}</td>
                      <td className="py-3.5 font-mono text-[11px]">{item.competitorValue}</td>
                      <td className="py-3.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          item.winner === 'user' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          item.winner === 'competitor' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-slate-800 text-slate-400 border border-slate-900'
                        }`}>
                          {item.winner === 'tie' ? 'TIE' : item.winner.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strengths & Weaknesses block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Your Competitive Strengths</span>
              <ul className="space-y-2 text-xs text-slate-300">
                {comparisonResult.userStrengths.map((str, idx) => (
                  <li key={idx} className="flex gap-2.5 leading-relaxed font-sans font-medium">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono text-rose-400/80 font-bold uppercase tracking-wider block">Your Gaps & Vulnerabilities</span>
              <ul className="space-y-2 text-xs text-slate-300">
                {comparisonResult.userWeaknesses.map((wk, idx) => (
                  <li key={idx} className="flex gap-2.5 leading-relaxed font-sans font-medium">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Strategic Action Plan */}
          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">AI SEO Action Blueprint</span>
              <p className="text-xs text-slate-500 mt-1">Execute these steps inside your active projects to leapfrog competitor search visibility</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-900/50">
              {comparisonResult.actionPlan.map((action, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl flex items-start gap-3.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold border border-indigo-500/20">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-200 leading-normal font-sans font-medium">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
