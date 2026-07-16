import React, { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  Globe, 
  Settings, 
  Zap,
  Sparkles,
  Info
} from "lucide-react";
import { Project, Notification } from "../types";

interface DashboardOverviewProps {
  projects: Project[];
  notifications: Notification[];
  onMarkNotificationsRead: (id?: string) => void;
  setActiveTab: (tab: string) => void;
  setSelectedProjectId: (id: string) => void;
  currentUser?: { email: string; role: string; projectId?: string } | null;
}

export default function DashboardOverview({ 
  projects, 
  notifications, 
  onMarkNotificationsRead, 
  setActiveTab,
  setSelectedProjectId,
  currentUser
}: DashboardOverviewProps) {
  const [activeChart, setActiveChart] = useState<'seo' | 'traffic' | 'keywords'>('seo');

  const unreadCount = notifications.filter(n => !n.read).length;

  // Custom SVG Chart Data Definitions
  const seoHistoryPoints = [
    { label: "Jun 15", val: 62 },
    { label: "Jun 22", val: 68 },
    { label: "Jun 29", val: 74 },
    { label: "Jul 06", val: 78 },
    { label: "Jul 13", val: 84 },
  ];

  const trafficPoints = [
    { label: "Jun 15", val: 1200 },
    { label: "Jun 22", val: 1850 },
    { label: "Jun 29", val: 2400 },
    { label: "Jul 06", val: 3100 },
    { label: "Jul 13", val: 4800 },
  ];

  const keywordPoints = [
    { label: "Jun 15", val: 12 },
    { label: "Jun 22", val: 18 },
    { label: "Jun 29", val: 25 },
    { label: "Jul 06", val: 32 },
    { label: "Jul 13", val: 45 },
  ];

  const getChartPoints = () => {
    if (projects.length === 0) {
      return [
        { label: "Jun 15", val: 0 },
        { label: "Jun 22", val: 0 },
        { label: "Jun 29", val: 0 },
        { label: "Jul 06", val: 0 },
        { label: "Jul 13", val: 0 },
      ];
    }
    switch(activeChart) {
      case 'traffic': return trafficPoints;
      case 'keywords': return keywordPoints;
      default: return seoHistoryPoints;
    }
  };

  const points = getChartPoints();
  const rawMax = Math.max(...points.map(p => p.val));
  const maxVal = rawMax === 0 ? 100 : rawMax;
  const minVal = Math.min(...points.map(p => p.val));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/40 border border-slate-900 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">
            {currentUser?.role === "client" ? "Welcome to Your Client Portal" : "Welcome Back, SEO Captain"}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {currentUser?.role === "client" 
              ? "Access your customized agency SEO health reports, active performance audits, and workspace billing." 
              : "SEOPilot AI analyzed your web assets automatically. Everything is running smoothly."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentUser?.role === "client" ? (
            <button 
              onClick={() => setActiveTab("settings")} 
              className="px-4 py-2 text-xs font-semibold font-sans rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/10 flex items-center gap-2 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Billing</span>
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab("projects")} 
              className="px-4 py-2 text-xs font-semibold font-sans rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/10 flex items-center gap-2 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Manage Websites</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Avg SEO Score</span>
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight font-sans">
              {projects.length > 0 
                ? Math.round(projects.reduce((acc, curr) => acc + (curr.seoScore || 0), 0) / projects.length) 
                : "--"
              }
              <span className="text-sm font-semibold text-slate-500">/100</span>
            </span>
            {projects.length > 0 && (
              <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +8.5%
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Weighted average across {projects.length} sites</p>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Keywords Tracked</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight font-sans">
              {projects.length > 0 ? "45" : "0"}
            </span>
            {projects.length > 0 && (
              <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Organic queries indexed</p>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Competitors</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight font-sans">
              {projects.length > 0 ? "4" : "0"}
            </span>
            <span className={`text-xs font-mono font-medium ${projects.length > 0 ? "text-slate-400" : "text-slate-600"}`}>
              {projects.length > 0 ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Bypassing keywords authority</p>
        </div>

        {/* Card 4 */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Crawl Status</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight font-sans">
              {projects.length > 0 ? "100%" : "0%"}
            </span>
            <span className={`text-xs font-mono font-medium ${projects.length > 0 ? "text-sky-400" : "text-slate-600"}`}>
              {projects.length > 0 ? "Healthy" : "Idle"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Automated checks active</p>
        </div>
      </div>

      {/* Main Grid: Charts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabbed Analytics Chart Card */}
        <div className="lg:col-span-2 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-sans">SEO Trend Diagnostics</h3>
              <p className="text-xs text-slate-500 mt-0.5">Visualize key organic performance metrics over time</p>
            </div>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-900 flex gap-1">
              {(['seo', 'traffic', 'keywords'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={`px-3 py-1.5 text-xs font-sans font-medium rounded-lg transition-all capitalize ${
                    activeChart === tab 
                      ? "bg-slate-900 text-sky-400 shadow font-semibold" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === 'seo' ? "SEO score" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Glow Vector Wave Chart */}
          <div className="py-6 h-64 relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

              {/* Glowing Line Path */}
              <path
                d={`M 0,${200 - (points[0].val / maxVal) * 160} 
                   L 125,${200 - (points[1].val / maxVal) * 160} 
                   L 250,${200 - (points[2].val / maxVal) * 160} 
                   L 375,${200 - (points[3].val / maxVal) * 160} 
                   L 500,${200 - (points[4].val / maxVal) * 160}`}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Area Gradient Fill */}
              <path
                d={`M 0,200 
                   L 0,${200 - (points[0].val / maxVal) * 160} 
                   L 125,${200 - (points[1].val / maxVal) * 160} 
                   L 250,${200 - (points[2].val / maxVal) * 160} 
                   L 375,${200 - (points[3].val / maxVal) * 160} 
                   L 500,${200 - (points[4].val / maxVal) * 160} 
                   L 500,200 Z`}
                fill="url(#chartGradient)"
              />

              {/* Data Node Dots */}
              {points.map((pt, idx) => {
                const cx = (idx / (points.length - 1)) * 500;
                const cy = 200 - (pt.val / maxVal) * 160;
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle cx={cx} cy={cy} r="6" fill="#020617" stroke="#38bdf8" strokeWidth="3" />
                    <circle cx={cx} cy={cy} r="12" fill="#38bdf8" fillOpacity="0" className="hover:fill-opacity-15 transition-all duration-200" />
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive Tooltip Overlay */}
            <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono">
              <span className="text-slate-400">Peak: </span>
              <span className="text-sky-400 font-bold">
                {activeChart === 'traffic' ? `${maxVal} visits` : activeChart === 'keywords' ? `${maxVal} keywords` : `${maxVal}/100 Score`}
              </span>
            </div>
          </div>

          {/* Chart Axis Labels */}
          <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-4 border-t border-slate-900">
            {points.map((pt, idx) => (
              <div key={idx} className="text-center">
                <span className="block font-medium text-slate-400">{pt.label}</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  {activeChart === 'traffic' ? `${pt.val}` : activeChart === 'keywords' ? `+${pt.val}` : `${pt.val}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Sidebar Box */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight font-sans">Recent Pilot Alerts</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-sky-500/10 text-sky-400 font-bold font-mono rounded-full border border-sky-500/20">
                    {unreadCount} New
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={() => onMarkNotificationsRead()}
                  className="text-[10px] font-sans text-slate-500 hover:text-white transition"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Notification List timeline */}
            <div className="mt-4 space-y-4 max-h-[260px] overflow-y-auto scrollbar-none pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto stroke-1" />
                  <p className="text-xs text-slate-500 mt-2 font-sans">No new notifications found</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3.5 rounded-xl border transition duration-200 relative ${
                      notif.read 
                        ? "bg-slate-900/10 border-slate-900/50 text-slate-400" 
                        : "bg-slate-900/30 border-slate-900 text-slate-200"
                    }`}
                  >
                    {!notif.read && (
                      <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                    )}
                    <div className="flex gap-2.5">
                      <div className={`mt-0.5 p-1 rounded-lg ${
                        notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                        notif.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-sky-500/10 text-sky-400'
                      }`}>
                        {notif.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                         notif.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                         <Info className="w-3.5 h-3.5" />}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="text-xs font-bold font-sans truncate">{notif.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-1">{notif.message}</p>
                        <span className="block text-[9px] text-slate-500 font-mono mt-1.5">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 mt-4">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-900 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-mono font-semibold uppercase">API Limits & Scans</p>
                <p className="text-xs text-slate-300 font-medium mt-0.5 font-sans">{projects.length} / 5 Tracked Sites Used</p>
              </div>
              <div className="w-16 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (projects.length / 5) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Website Overviews Bento Panel */}
      <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight font-sans">
              {currentUser?.role === "client" ? "My Web Property" : "Monitored Web Properties"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Summary of overall health score state per URL</p>
          </div>
          {currentUser?.role !== "client" && (
            <button 
              onClick={() => setActiveTab("projects")} 
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-sans transition cursor-pointer"
            >
              <span>View All Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {projects.filter((p) => currentUser?.role !== "client" || p.id === "proj-1").length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-slate-900 rounded-xl bg-slate-950/20">
            <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3 stroke-1" />
            <p className="text-sm font-semibold text-slate-300 font-sans">No Monitored Websites Registered</p>
            <p className="text-xs text-slate-500 font-mono mt-1 mb-4">Add your first domain in the Projects panel to begin automated audits.</p>
            {currentUser?.role !== "client" && (
              <button 
                onClick={() => setActiveTab("projects")} 
                className="px-4 py-2 text-xs font-semibold font-sans rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 transition cursor-pointer"
              >
                Go to Projects Panel
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects
              .filter((p) => currentUser?.role !== "client" || p.id === "proj-1")
              .map((proj) => (
                <div 
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setActiveTab("audit");
                  }}
                  className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl flex items-center justify-between hover:border-slate-800 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 group-hover:text-white transition">
                      <Globe className="w-5 h-5 stroke-1" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-slate-200 truncate font-sans group-hover:text-white transition">{proj.name}</h4>
                      <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{proj.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`text-lg font-bold font-sans ${
                          proj.seoScore >= 80 ? "text-emerald-400" :
                          proj.seoScore >= 60 ? "text-amber-400" :
                          "text-rose-400"
                        }`}>{proj.seoScore}</span>
                        <span className="text-[9px] text-slate-500 font-mono">/100</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block font-mono">SEO Audit</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
