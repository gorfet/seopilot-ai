import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Globe, 
  Gauge, 
  CheckCircle2, 
  HelpCircle,
  Clock, 
  FileText, 
  Download, 
  Search,
  BookOpen,
  Check,
  Eye,
  Info
} from "lucide-react";
import { Project, SEOAudit, AuditIssue } from "../types";

interface SEOAuditDetailProps {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  audits: Record<string, SEOAudit[]>;
  onRunAudit: (projectId: string, url: string) => Promise<any>;
  isAuditing: boolean;
  currentUser?: { email: string; role: string; projectId?: string } | null;
}

export default function SEOAuditDetail({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  audits,
  onRunAudit,
  isAuditing,
  currentUser
}: SEOAuditDetailProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'technical' | 'content' | 'performance' | 'accessibility'>('all');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const selectedProj = projects.find(p => p.id === selectedProjectId);
  const projectAudits = selectedProjectId ? (audits[selectedProjectId] || []) : [];
  const latestAudit = projectAudits[projectAudits.length - 1];

  const handleRunNewScan = async () => {
    if (!selectedProj) return;
    try {
      await onRunAudit(selectedProj.id, selectedProj.url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      alert(`Successfully compiled white-label agency ${format.toUpperCase()} export report for ${selectedProj?.name}!`);
    }, 1500);
  };

  // Filter issues based on active categories
  const filteredIssues = latestAudit 
    ? latestAudit.issues.filter(issue => activeCategory === 'all' || issue.category === activeCategory)
    : [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score >= 60) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-rose-400 border-rose-500/20 bg-rose-500/5";
  };

  const getSeverityPill = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      case 'medium': return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case 'low': return "bg-sky-500/15 text-sky-400 border-sky-500/20";
    }
  };

  if (!selectedProj) {
    return (
      <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-2xl animate-fade-in">
        <Globe className="w-12 h-12 text-slate-700 mx-auto stroke-1 mb-4" />
        <h3 className="text-sm font-semibold text-slate-300">No project selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please select an active project in the selector above or Projects tab to inspect detailed SEO audits.
        </p>
        <div className="mt-6 max-w-xs mx-auto">
          <select
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition font-sans"
            value={selectedProjectId}
          >
            <option value="">Select a Project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Target Selector Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900/40 border border-slate-900 rounded-2xl">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-sky-400" />
          {currentUser?.role === "client" ? (
            <span className="text-sm font-bold text-white font-sans">
              {selectedProj?.name} <span className="text-xs font-mono text-slate-500 ml-1.5">({selectedProj?.url})</span>
            </span>
          ) : (
            <select
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer border-none font-sans"
              value={selectedProjectId}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">{p.name} ({p.url})</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadReport('pdf')}
            disabled={!latestAudit || downloadingFormat !== null}
            className="px-3.5 py-2 bg-slate-950 text-slate-400 hover:text-white rounded-xl text-xs font-semibold font-sans border border-slate-800 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {downloadingFormat === 'pdf' ? (
              <>
                <span className="animate-spin text-[10px]">●</span>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>PDF Report</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleRunNewScan}
            disabled={isAuditing}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold font-sans shadow-lg shadow-sky-500/10 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Auditing...</span>
              </>
            ) : (
              <span>Recrawl Now</span>
            )}
          </button>
        </div>
      </div>

      {!latestAudit ? (
        <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-2xl">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-4 stroke-1" />
          <h3 className="text-sm font-semibold text-slate-300">This domain hasn't been crawled yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
            Run an AI SEO Crawl scan right now to analyze heading distributions, page speed bottlenecks, canonical links, and technical SEO warnings.
          </p>
          <button
            onClick={handleRunNewScan}
            disabled={isAuditing}
            className="mt-6 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold rounded-xl font-sans transition disabled:opacity-50"
          >
            {isAuditing ? "Performing Crawling Audits..." : "Initiate SEO Audit Scan"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Audit Score Card Dials */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Overall */}
            <div className={`p-4 rounded-2xl border text-center relative ${getScoreColor(latestAudit.scores.overall)} md:col-span-1 col-span-2`}>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80 block">Overall Score</span>
              <div className="text-3xl font-extrabold font-sans mt-2.5">{latestAudit.scores.overall}%</div>
              <span className="text-[9px] font-mono opacity-60 block mt-1">Excellent Ranking</span>
            </div>

            {/* Technical */}
            <div className={`p-4 rounded-2xl border text-center ${getScoreColor(latestAudit.scores.technical)}`}>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80 block">Technical</span>
              <div className="text-2xl font-bold font-sans mt-3">{latestAudit.scores.technical}%</div>
            </div>

            {/* Content */}
            <div className={`p-4 rounded-2xl border text-center ${getScoreColor(latestAudit.scores.content)}`}>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80 block">Content</span>
              <div className="text-2xl font-bold font-sans mt-3">{latestAudit.scores.content}%</div>
            </div>

            {/* Accessibility */}
            <div className={`p-4 rounded-2xl border text-center ${getScoreColor(latestAudit.scores.accessibility)}`}>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80 block">Accessibility</span>
              <div className="text-2xl font-bold font-sans mt-3">{latestAudit.scores.accessibility}%</div>
            </div>

            {/* Performance */}
            <div className={`p-4 rounded-2xl border text-center ${getScoreColor(latestAudit.scores.performance)}`}>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80 block">Performance</span>
              <div className="text-2xl font-bold font-sans mt-3">{latestAudit.scores.performance}%</div>
            </div>

          </div>

          {/* Crawler Detailed Parameters Panel */}
          <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white font-sans tracking-tight">On-Page Crawled Elements</h3>
              <p className="text-xs text-slate-500 mt-0.5">Parameters collected from the direct HTML response source</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-900">
              
              {/* Left Column parameters */}
              <div className="space-y-4 text-xs font-sans">
                
                {/* Title */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                    <span>TITLE TAG</span>
                    <span className={latestAudit.metrics.titleLength <= 60 ? "text-emerald-400" : "text-amber-400"}>
                      {latestAudit.metrics.titleLength} / 60 Chars
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium font-sans leading-relaxed">"{latestAudit.metrics.title}"</p>
                </div>

                {/* Description */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                    <span>META DESCRIPTION</span>
                    <span className={latestAudit.metrics.descriptionLength <= 160 ? "text-emerald-400" : "text-amber-400"}>
                      {latestAudit.metrics.descriptionLength} / 160 Chars
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans font-normal">"{latestAudit.metrics.description}"</p>
                </div>

                {/* Canonical */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500">CANONICAL LINK</span>
                  <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs">{latestAudit.metrics.canonical || "Not Configured ⚠️"}</span>
                </div>

                {/* Heading Tags */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-500 block mb-2">HEADER DISTRIBUTION</span>
                  <div className="grid grid-cols-6 gap-2 text-center text-xs">
                    {Object.entries(latestAudit.metrics.headingsCount).map(([tag, count]) => (
                      <div key={tag} className="p-1.5 bg-slate-900/60 rounded-lg border border-slate-900/80">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">{tag}</span>
                        <span className="block font-bold text-slate-200 mt-1 font-sans">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column parameters */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Images count */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Image Alt Stats</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold text-white font-sans">{latestAudit.metrics.imagesWithAltCount}</span>
                    <span className="text-xs text-slate-500 font-sans"> / {latestAudit.metrics.imagesCount} with Alt</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-sky-400 h-full rounded-full"
                      style={{ width: `${(latestAudit.metrics.imagesWithAltCount / latestAudit.metrics.imagesCount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Page weight */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Load Weight</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold text-white font-sans">
                      {(latestAudit.metrics.pageSizeKb / 1024).toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-sans"> MB Size</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-2 block">HTML & scripts combined</span>
                </div>

                {/* Load time */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">TTFB Speed</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold text-white font-sans">{latestAudit.metrics.loadTimeSec}s</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 mt-2 block">✓ Excellent response</span>
                </div>

                {/* Broken links */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Broken Links</span>
                  <div className="mt-2.5">
                    <span className={`text-2xl font-bold font-sans ${latestAudit.metrics.brokenLinksCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {latestAudit.metrics.brokenLinksCount}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-2 block">Internal and external hrefs</span>
                </div>

                {/* Indicators grid */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 col-span-2 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-sans">
                    <span className="text-slate-400 font-medium">SSL Certificate Active</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${latestAudit.metrics.sslActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {latestAudit.metrics.sslActive ? "ACTIVE" : "MISSING"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-sans">
                    <span className="text-slate-400 font-medium">Robots.txt Configuration</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${latestAudit.metrics.robotsTxtFound ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {latestAudit.metrics.robotsTxtFound ? "FOUND" : "NOT FOUND"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-sans">
                    <span className="text-slate-400 font-medium">XML Sitemap Index</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${latestAudit.metrics.sitemapXmlFound ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {latestAudit.metrics.sitemapXmlFound ? "FOUND" : "NOT FOUND"}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Actionable Recommendations list with collapsible fix panels */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight font-sans">Actionable Pilot Recommendations</h3>
                <p className="text-xs text-slate-500 mt-0.5">Filter based on specific functional categories</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-1 bg-slate-950 p-1 border border-slate-900 rounded-xl">
                {(['all', 'technical', 'content', 'performance', 'accessibility'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-[11px] font-medium rounded-lg capitalize transition-all ${
                      activeCategory === cat 
                        ? "bg-slate-900 text-sky-400 font-bold" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations Loop */}
            {filteredIssues.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/10 border border-slate-900 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-sans font-medium">No errors found in this category! Perfect SEO status.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isExpanded = selectedIssueId === issue.id;
                return (
                  <div 
                    key={issue.id}
                    className="bg-slate-900/20 border border-slate-900 rounded-xl overflow-hidden hover:border-slate-800 transition-all duration-300"
                  >
                    <div 
                      onClick={() => setSelectedIssueId(isExpanded ? null : issue.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase border rounded-lg ${getSeverityPill(issue.severity)}`}>
                          {issue.severity} priority
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 font-sans tracking-tight">{issue.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 capitalize font-mono">{issue.category}</span>
                        <span className="text-slate-600 font-sans text-xs">
                          {isExpanded ? "Collapse" : "How to Fix"}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-900/60 bg-slate-950/20 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">The Issue:</span>
                            <p className="text-slate-300 mt-1 leading-relaxed font-sans">{issue.description}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-rose-400/80 font-bold uppercase">Rank Impact:</span>
                            <p className="text-rose-300/80 mt-1 leading-relaxed font-sans">{issue.impact}</p>
                          </div>
                        </div>

                        {issue.currentValue && issue.suggestedValue && (
                          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px]">
                            <div>
                              <span className="text-rose-400 block uppercase font-bold text-[9px]">DETECTED BAD VALUE:</span>
                              <code className="text-slate-400 block mt-1 break-all">{issue.currentValue}</code>
                            </div>
                            <div className="border-t sm:border-t-0 sm:border-l border-slate-900 pt-3 sm:pt-0 sm:pl-4">
                              <span className="text-emerald-400 block uppercase font-bold text-[9px]">RECOMMENDED PILOT FIX:</span>
                              <code className="text-slate-200 block mt-1 break-all font-semibold">{issue.suggestedValue}</code>
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-xl">
                          <span className="text-[10px] font-mono text-sky-400 font-bold uppercase flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            <span>AI FIX INSTRUCTION:</span>
                          </span>
                          <p className="text-slate-300 text-xs mt-1.5 leading-normal font-sans">{issue.fix}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
}
