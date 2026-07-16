import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import ProjectManager from "./components/ProjectManager";
import SEOAuditDetail from "./components/SEOAuditDetail";
import KeywordResearch from "./components/KeywordResearch";
import CompetitorAnalysis from "./components/CompetitorAnalysis";
import ContentAndOptimizer from "./components/ContentAndOptimizer";
import ChatAssistant from "./components/ChatAssistant";
import SettingsBilling from "./components/SettingsBilling";
import AuthPortal from "./components/AuthPortal";
import { Project, SEOAudit, Notification } from "./types";
import { Sparkles, Bot, LogOut, ChevronRight, Menu } from "lucide-react";
import { useMetadata } from "./metadata-config";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; role: "agency" | "client"; projectId?: string } | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("seopilot_user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // Default to open on desktop, closed on smaller screens
    }
    return true;
  });
  const [userPlan, setUserPlan] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("seopilot_plan") || "pro";
    }
    return "pro";
  });
  const [whiteLabelName, setWhiteLabelName] = useState<string>("Acme SEO Consultants Ltd.");

  const [savedCard, setSavedCard] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("seopilot_card");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [billingHistory, setBillingHistory] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("seopilot_billing");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "inv-1",
        date: "Jun 15, 2026",
        amount: "$49.00",
        status: "Paid",
        planName: "Pro Strategist",
        invoiceNo: "INV-2026-8941"
      },
      {
        id: "inv-2",
        date: "May 15, 2026",
        amount: "$49.00",
        status: "Paid",
        planName: "Pro Strategist",
        invoiceNo: "INV-2026-3829"
      }
    ];
  });

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [audits, setAudits] = useState<Record<string, SEOAudit[]>>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Dynamic Metadata Syncing for search engine optimization
  const activeProj = projects.find((p) => p.id === selectedProjectId);
  
  const getDynamicMetadata = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "SEO Dashboard Overview | SEOPilot AI",
          description: "Access real-time organic visibility reports, crawled domain indices, and custom recommendations."
        };
      case "projects":
        return {
          title: "Manage Website Targets | SEOPilot AI",
          description: "Register target web applications, index deep-links structures, and execute on-demand recrawl requests."
        };
      case "audit":
        return {
          title: activeProj 
            ? `SEO Audit Report for ${activeProj.name} | SEOPilot AI` 
            : "SEO Domain Auditor | SEOPilot AI",
          description: activeProj 
            ? `Inspect technical crawl issues, heading structures, load times, page sizes, and XML sitemaps for ${activeProj.name} (${activeProj.url}).`
            : "Run dynamic, deep-crawler checks to inspect page metadata length, canonical configurations, image alt attributes, and server-side responses."
        };
      case "keywords":
        return {
          title: "AI Semantic Keyword Planner | SEOPilot AI",
          description: "Estimate monthly search volumes, isolate difficulty indices, group semantic clusters, and target snippets queries with Gemini."
        };
      case "competitors":
        return {
          title: "SEO Competitor Comparison | SEOPilot AI",
          description: "Compare your on-page metrics, backlink counts, and SSL certificates directly against chief industry competitors."
        };
      case "optimizer":
        return {
          title: "AI SEO Content Draft Writer & Editor | SEOPilot AI",
          description: "Generate high-converting organic articles or audit pasted drafts for keywords density, readability indices, and passive voice structures."
        };
      case "chat":
        return {
          title: "AI SEO Advisor Consulting | SEOPilot AI",
          description: "Converse directly with an elite technical search engine optimization strategist powered by Google Gemini to fix indexing bottlenecks."
        };
      case "settings":
        return {
          title: "Settings & SaaS Billing Tiers | SEOPilot AI",
          description: "Configure white-label display metadata, customize PDF titles, and toggle subscription packages to explore premium features."
        };
      default:
        return {};
    }
  };

  useMetadata(getDynamicMetadata(), [activeTab, selectedProjectId, projects]);

  // Fetch initial data from server
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch Projects
        const projRes = await fetch("/api/projects");
        const projData = await projRes.json();
        setProjects(projData);

        if (projData.length > 0) {
          setSelectedProjectId(projData[0].id);
          
          // Fetch audits for each project
          const auditsMap: Record<string, SEOAudit[]> = {};
          for (const p of projData) {
            const auditRes = await fetch(`/api/projects/${p.id}/audits`);
            const auditData = await auditRes.json();
            auditsMap[p.id] = auditData;
          }
          setAudits(auditsMap);
        }

        // Fetch Notifications
        const notifRes = await fetch("/api/notifications");
        const notifData = await notifRes.json();
        setNotifications(notifData);
      } catch (err) {
        console.error("Error loading initial full-stack data:", err);
      }
    }
    loadInitialData();
  }, []);

  // Sync session states to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem("seopilot_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("seopilot_user");
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("seopilot_plan", userPlan);
    }
  }, [userPlan]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (savedCard) {
        localStorage.setItem("seopilot_card", JSON.stringify(savedCard));
      } else {
        localStorage.removeItem("seopilot_card");
      }
    }
  }, [savedCard]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("seopilot_billing", JSON.stringify(billingHistory));
    }
  }, [billingHistory]);

  // Client workspace scope locking
  useEffect(() => {
    if (currentUser?.role === "client") {
      setSelectedProjectId("proj-1");
      // Redirect out of unauthorized pages for clients
      if (["projects", "keywords", "competitors", "optimizer"].includes(activeTab)) {
        setActiveTab("dashboard");
      }
    }
  }, [currentUser, activeTab]);

  const handleSignOut = () => {
    setCurrentUser(null);
    setSavedCard(null);
    setUserPlan("pro");
    setActiveTab("dashboard");
    if (typeof window !== "undefined") {
      localStorage.removeItem("seopilot_user");
      localStorage.removeItem("seopilot_card");
      localStorage.removeItem("seopilot_plan");
      localStorage.removeItem("seopilot_billing");
    }
  };

  // API Callbacks
  const handleAddProject = async (name: string, url: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });
      const newProj = await response.json();
      if (newProj && !newProj.error) {
        setProjects((prev) => [...prev, newProj]);
        setAudits((prev) => ({ ...prev, [newProj.id]: [] }));
        setSelectedProjectId(newProj.id);
        return newProj;
      }
      return newProj; // returns error object
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setAudits((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (selectedProjectId === id) {
        setSelectedProjectId("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAudit = async (projectId: string, url: string) => {
    setIsAuditing(true);
    try {
      const response = await fetch("/api/audit/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, url }),
      });
      const newAudit = await response.json();
      
      // Update audits state
      setAudits((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), newAudit],
      }));

      // Update project score in list
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, seoScore: newAudit.scores.overall, lastAudited: newAudit.createdAt }
            : p
        )
      );

      return newAudit;
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleMarkNotificationsRead = async (id?: string) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (id === undefined || n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Render the selected tab panel
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            projects={projects}
            notifications={notifications}
            onMarkNotificationsRead={handleMarkNotificationsRead}
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            currentUser={currentUser}
          />
        );
      case "projects":
        return (
          <ProjectManager
            projects={projects}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case "audit":
        return (
          <SEOAuditDetail
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            audits={audits}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
            currentUser={currentUser}
          />
        );
      case "keywords":
        return <KeywordResearch />;
      case "competitors":
        return <CompetitorAnalysis />;
      case "optimizer":
        return <ContentAndOptimizer />;
      case "chat":
        return <ChatAssistant />;
      case "settings":
        return (
          <SettingsBilling
            userPlan={userPlan}
            setUserPlan={setUserPlan}
            whiteLabelName={whiteLabelName}
            setWhiteLabelName={setWhiteLabelName}
            savedCard={savedCard}
            setSavedCard={setSavedCard}
            billingHistory={billingHistory}
            setBillingHistory={setBillingHistory}
          />
        );
      default:
        return (
          <div className="text-white font-sans text-center py-10">Tab Content is coming soon...</div>
        );
    }
  };

  // Condition 1: If there is no authenticated user session, render the high-fidelity Auth Portal
  if (!currentUser) {
    return (
      <AuthPortal 
        onLogin={(email, role) => {
          setCurrentUser({
            email,
            role,
            projectId: role === "client" ? "proj-1" : undefined
          });
          
          // Set plan dynamically based on guest choice or credentials
          if (email.toLowerCase().includes("guest")) {
            setUserPlan("free");
          } else {
            setUserPlan("pro");
          }

          // Redirect to dashboard on login
          setActiveTab("dashboard");
          if (role === "client") {
            setSelectedProjectId("proj-1");
          }
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userPlan={userPlan}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content View Frame */}
      <main className={`flex-1 min-h-screen overflow-y-auto px-6 py-8 md:px-10 lg:py-10 flex flex-col justify-between transition-all duration-300 ${
        sidebarOpen ? "md:pl-64" : "md:pl-20"
      }`}>
        <div className="space-y-6">
          
          {/* Top Header Row */}
          <header className="flex items-center justify-between border-b border-slate-900 pb-5 mb-2 mt-12 md:mt-0">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button 
                  id="header-sidebar-toggle"
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition flex items-center justify-center shadow-md shadow-black/40"
                  title="Expand Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className="text-xs font-mono font-bold text-slate-500 hover:text-sky-400 uppercase tracking-wider cursor-pointer transition-colors bg-transparent border-none p-0 focus:outline-none"
                  title="Return to Dashboard"
                >
                  Workspace
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-xs font-sans font-semibold text-slate-300 capitalize">{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick AI Trigger button */}
              <button 
                onClick={() => setActiveTab("chat")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-medium font-sans transition cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-sky-400" />
                <span>AI Consult</span>
              </button>

              {/* Sign out indicator in header */}
              <button
                id="header-signout-btn"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/25 hover:border-rose-900/50 text-rose-400 rounded-xl text-xs font-semibold font-sans transition cursor-pointer"
                title="Exit Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Render Active Module Tab */}
          <div className="relative pb-10">
            {renderTabContent()}
          </div>

        </div>

        {/* Global Footer Credits */}
        <footer className="border-t border-slate-950/60 pt-6 text-center text-[10px] font-mono text-slate-600">
          <p>© 2026 SEOPilot AI SaaS Platform. All Rights Reserved.</p>
          <p className="mt-1">Crafted with full-stack TypeScript, Express, and Gemini 3.5 models.</p>
        </footer>
      </main>
    </div>
  );
}
