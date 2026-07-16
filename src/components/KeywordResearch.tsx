import React, { useState } from "react";
import { 
  Search, 
  Loader2, 
  TrendingUp, 
  Tag, 
  Layers, 
  HelpCircle, 
  DollarSign, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { KeywordData } from "../types";

export default function KeywordResearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywordResult, setKeywordResult] = useState<KeywordData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'longtail' | 'clusters' | 'questions'>('overview');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/keyword/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setKeywordResult(data);
      setActiveTab('overview');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIntentColor = (intent: string) => {
    switch(intent) {
      case 'transactional': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'commercial': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'informational': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const getDifficultyColor = (diff: number) => {
    if (diff >= 70) return "text-rose-400";
    if (diff >= 40) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">AI Keyword Planner</h2>
        <p className="text-slate-400 text-sm mt-1">Identify search volumes, difficulties, user intent, and topic clusters using Gemini</p>
      </div>

      {/* Input Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl bg-slate-900/30 p-2 rounded-2xl border border-slate-900">
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-4 text-slate-500 w-4 h-4" />
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. web developer, organic pet food, best yoga mats"
            className="w-full bg-transparent pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-0 font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl text-xs font-semibold font-sans shadow-lg shadow-sky-500/10 flex items-center gap-1.5 transition whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Plannig...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Generate Ideas</span>
            </>
          )}
        </button>
      </form>

      {/* Search Result Display */}
      {!keywordResult ? (
        <div className="text-center py-24 bg-slate-900/10 border border-slate-900 rounded-2xl">
          <Search className="w-12 h-12 text-slate-700 mx-auto stroke-1 mb-4" />
          <h3 className="text-sm font-semibold text-slate-300">No keyword analyzed yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
            Enter any search query above to receive real monthly volume estimation, semantic groupings, and related long-tail phrases.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Keyword Header Card */}
          <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <Tag className="w-5 h-5 stroke-1.5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans truncate capitalize">"{keywordResult.keyword}"</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wide uppercase border font-semibold ${getIntentColor(keywordResult.intent)}`}>
                    {keywordResult.intent} intent
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-900 text-slate-400">
                    Competition: {keywordResult.competition.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Metric numbers */}
            <div className="grid grid-cols-3 gap-4 md:text-right border-t border-slate-900 md:border-none pt-4 md:pt-0">
              <div className="px-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Volume</span>
                <span className="text-lg font-bold text-slate-200 mt-0.5 block font-sans">
                  {keywordResult.volume.toLocaleString()}
                </span>
              </div>
              <div className="px-2 border-l border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Difficulty</span>
                <span className={`text-lg font-bold mt-0.5 block font-sans ${getDifficultyColor(keywordResult.difficulty)}`}>
                  {keywordResult.difficulty}/100
                </span>
              </div>
              <div className="px-2 border-l border-slate-900">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Est. CPC</span>
                <span className="text-lg font-bold text-sky-400 mt-0.5 block font-sans flex items-center md:justify-end gap-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {keywordResult.cpc.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-900 rounded-xl max-w-sm">
            {(['overview', 'longtail', 'clusters', 'questions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  activeTab === tab 
                    ? "bg-slate-900 text-sky-400 font-bold" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Active Tab rendering */}
          <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
            
            {/* 1. Related and Overview tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Related Keywords & Semantic Variations</span>
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Incorporate these relevant semantic key phrases inside your article headings, lists, or tags to elevate search engine authority.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-900/50">
                  {keywordResult.related.map((term, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-center justify-between hover:border-slate-800 transition">
                      <span className="text-xs text-slate-300 font-sans">{term}</span>
                      <span className="text-[10px] font-mono text-slate-500">Related Var</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Long Tail Tab */}
            {activeTab === 'longtail' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-400" />
                  <span>Long-tail Keyword Opportunities</span>
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Long-tail keywords feature lower competition metrics, facilitating easier, faster organic search position tracking.
                </p>
                <div className="space-y-2.5 pt-3 border-t border-slate-900/50">
                  {keywordResult.longTail.map((term, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                      <span className="text-xs text-slate-200 font-sans font-medium">{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Clusters Tab */}
            {activeTab === 'clusters' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>AI Semantic Topical Clusters</span>
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Structure your blog architecture by grouping these keywords together. Search engines prioritize websites demonstrating complete topical expertise.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-900/50">
                  {keywordResult.clusters.map((cluster, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 space-y-3">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block border-b border-slate-900 pb-2">
                        {cluster.clusterName}
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {cluster.keywords.map((kw, kIdx) => (
                          <li key={kIdx} className="flex items-center gap-2 font-sans font-medium">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                            <span>{kw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>People Also Ask & FAQs</span>
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Incorporate these queries directly into your content's H2 or H3 heading structures and write direct answers to secure rich ranking snippets.
                </p>
                <div className="space-y-2.5 pt-3 border-t border-slate-900/50">
                  {keywordResult.questions.map((q, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-900 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-200 font-sans leading-relaxed font-semibold">{q}</span>
                      <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono font-bold whitespace-nowrap">
                        snippet target
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
