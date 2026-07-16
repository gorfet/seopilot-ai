import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Globe, 
  Clock, 
  ArrowRight, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  X,
  AlertCircle
} from "lucide-react";
import { Project } from "../types";

interface ProjectManagerProps {
  projects: Project[];
  onAddProject: (name: string, url: string) => Promise<any>;
  onDeleteProject: (id: string) => Promise<any>;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  onRunAudit: (projectId: string, url: string) => Promise<any>;
  isAuditing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProjectManager({
  projects,
  onAddProject,
  onDeleteProject,
  selectedProjectId,
  setSelectedProjectId,
  onRunAudit,
  isAuditing,
  setActiveTab
}: ProjectManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectUrl.trim()) return;

    setLocalLoading(true);
    setErrorMessage("");
    try {
      const res = await onAddProject(newProjectName, newProjectUrl);
      if (res && res.error) {
        setErrorMessage(res.error);
      } else {
        setNewProjectName("");
        setNewProjectUrl("");
        setShowAddModal(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to add project");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInstantScan = async (project: Project) => {
    try {
      await onRunAudit(project.id, project.url);
      setSelectedProjectId(project.id);
      setActiveTab("audit");
    } catch (err) {
      console.error(err);
    }
  };

  const selectedProj = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">Active SEO Projects</h2>
          <p className="text-slate-400 text-sm mt-1">Configure and manage target domains you are optimizing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold font-sans shadow-lg shadow-sky-500/10 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Main Grid: Projects List + Selection view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects List Panel (left column) */}
        <div className="lg:col-span-2 space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/10 border border-slate-900 rounded-2xl">
              <Globe className="w-12 h-12 text-slate-700 mx-auto stroke-1 mb-4" />
              <h3 className="text-sm font-semibold text-slate-300">No active domains</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-normal">
                You haven't tracked any websites yet. Click 'Add Project' to begin auditing your search ranks.
              </p>
            </div>
          ) : (
            projects.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <div 
                  key={proj.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isSelected 
                      ? "bg-slate-900/40 border-sky-500/35 shadow-lg shadow-sky-500/5" 
                      : "bg-slate-900/10 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div 
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="flex items-start gap-4 cursor-pointer overflow-hidden flex-1"
                    >
                      <div className={`p-3 rounded-xl border transition ${
                        isSelected ? "bg-sky-500/10 border-sky-500/20 text-sky-400" : "bg-slate-950 border-slate-900 text-slate-500"
                      }`}>
                        <Globe className="w-5 h-5 stroke-1.5" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h3 className="text-sm font-bold text-slate-200 font-sans tracking-tight">{proj.name}</h3>
                        <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{proj.url}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-600" />
                            {proj.lastAudited ? `Audited ${new Date(proj.lastAudited).toLocaleDateString()}` : "Never audited"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <button
                        onClick={() => handleInstantScan(proj)}
                        disabled={isAuditing}
                        className="px-3.5 py-1.5 text-[10px] font-bold tracking-tight bg-slate-950 text-sky-400 border border-sky-500/20 hover:border-sky-500/50 hover:bg-slate-900 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                      >
                        {isAuditing && isSelected ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <span>Run Scan</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 bg-slate-950/40 text-slate-600 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg border border-slate-900 hover:border-rose-950/40 transition"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Project Sidebar Capsule View (right column) */}
        <div className="space-y-4">
          <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Project Selector</h3>
            {selectedProj ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-sans">Active Target:</span>
                  <span className="text-xs text-white font-sans font-semibold">{selectedProj.name}</span>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-mono font-bold block uppercase">Current SEO score</span>
                  <div className="mt-2 text-3xl font-extrabold text-white font-sans">
                    {selectedProj.seoScore}
                    <span className="text-sm font-normal text-slate-500">/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-900">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedProj.seoScore >= 80 ? "bg-emerald-500" :
                        selectedProj.seoScore >= 60 ? "bg-amber-400" :
                        "bg-rose-500"
                      }`}
                      style={{ width: `${selectedProj.seoScore}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProjectId(selectedProj.id);
                    setActiveTab("audit");
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold font-sans border border-slate-800 flex items-center justify-center gap-1.5 transition"
                >
                  <span>Detailed Audit Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-6 text-center py-6 text-slate-500 text-xs font-sans">
                Select a project from the left panel to examine SEO health metrics.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Project Modal overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-white text-base">New Target Website</h3>
                <p className="text-xs text-slate-500 mt-0.5">Let's set up a new domain target scan</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Online Store"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">Website Homepage URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://myshopify.com"
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  {localLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Add and Track</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
