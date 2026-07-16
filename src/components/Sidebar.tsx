import React from "react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  ShieldAlert, 
  Key, 
  Users, 
  FileSpreadsheet, 
  Settings, 
  CreditCard, 
  MessageSquare, 
  Sparkles, 
  Search, 
  Bot,
  Menu,
  X,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userPlan: string;
  currentUser: { email: string; role: "agency" | "client"; projectId?: string } | null;
  onSignOut: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen, 
  userPlan,
  currentUser,
  onSignOut
}: SidebarProps) {
  
  // Custom navigation structure depending on role
  const allMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["agency", "client"] },
    { id: "projects", label: "Projects", icon: FolderKanban, roles: ["agency"] },
    { id: "audit", label: "SEO Audit", icon: ShieldAlert, roles: ["agency", "client"] },
    { id: "keywords", label: "Keywords", icon: Search, roles: ["agency"] },
    { id: "competitors", label: "Competitors", icon: Users, roles: ["agency"] },
    { id: "optimizer", label: "AI Writer & Blog", icon: Sparkles, roles: ["agency"] },
    { id: "chat", label: "AI Copilot Chat", icon: Bot, roles: ["agency", "client"] },
    { id: "settings", label: "Settings & Plan", icon: Settings, roles: ["agency", "client"] },
  ];

  const userRole = currentUser?.role || "agency";
  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Menu Toggle (only if sidebar is closed) */}
      {!isOpen && (
        <button 
          id="mobile-sidebar-toggle"
          onClick={() => setIsOpen(true)} 
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900/85 backdrop-blur text-white border border-slate-800 rounded-lg shadow-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar Container */}
      <aside 
        id="main-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen bg-slate-950 border-r border-slate-900 text-slate-300 flex flex-col transition-all duration-300 ${
          isOpen 
            ? "w-64 translate-x-0" 
            : "-translate-x-full md:translate-x-0 md:w-20 overflow-hidden"
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div className="transition-opacity duration-300 whitespace-nowrap">
                <h1 className="font-sans font-bold text-base tracking-tight text-white leading-none">SEOPilot AI</h1>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                  {userRole === "client" ? "CLIENT REPORTING" : "ENTERPRISE SAAS"}
                </span>
              </div>
            )}
          </div>
          {isOpen && (
            <button 
              id="sidebar-collapse-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-900 text-slate-500 hover:text-white rounded-lg transition cursor-pointer"
              title="Collapse Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Info Capsule */}
        <div className={`mx-3 my-4 p-2.5 bg-slate-900/40 border border-slate-900/60 rounded-xl flex items-center justify-between transition-all ${
          isOpen ? "gap-3 px-3.5" : "px-2 justify-center"
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-sky-400 font-bold">
              {currentUser?.role === "client" ? "CL" : "AD"}
            </div>
            {isOpen && (
              <div className="overflow-hidden flex-1 transition-opacity duration-300 whitespace-nowrap">
                <p className="text-xs font-medium text-slate-200 truncate font-sans">
                  {currentUser?.email || "Guest Session"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 capitalize font-mono font-semibold">{userPlan} Plan</span>
                </div>
              </div>
            )}
          </div>

          {isOpen && (
            <button
              id="sidebar-logout-btn"
              onClick={onSignOut}
              className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded-lg transition cursor-pointer"
              title="Sign Out Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2 scrollbar-none">
          <div className={`px-3 mb-2 text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold ${
            isOpen ? "text-left" : "text-center whitespace-nowrap text-[9px]"
          }`}>
            {isOpen ? (userRole === "client" ? "Client Access" : "Core Modules") : "Core"}
          </div>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center transition-all duration-200 group relative cursor-pointer ${
                  isOpen 
                    ? "justify-start gap-3.5 px-4 py-3 rounded-xl text-sm" 
                    : "justify-center px-0 py-3.5 rounded-xl"
                } ${
                  isActive 
                    ? "bg-slate-900 text-white font-medium border border-slate-800" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 min-w-[18px] min-h-[18px] transition-colors ${
                  isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"
                }`} />
                {isOpen && <span className="transition-opacity duration-300 whitespace-nowrap">{item.label}</span>}
                {isActive && isOpen && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                )}
                {isActive && !isOpen && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info banner */}
        <div className="p-3 border-t border-slate-900 text-center">
          <div className="p-2 bg-slate-900/30 rounded-xl border border-slate-900/50 flex flex-col items-center justify-center">
            {isOpen ? (
              <>
                <p className="text-[10px] text-slate-500 font-mono">SEOPilot AI v3.5</p>
                <p className="text-[9px] text-slate-600 font-mono mt-0.5">Gemini 3.5 Engine</p>
              </>
            ) : (
              <p className="text-[10px] text-slate-500 font-mono font-bold">V3</p>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
        ></div>
      )}
    </>
  );
}
