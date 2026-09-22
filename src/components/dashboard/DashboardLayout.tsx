import React from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  MessageSquareQuote,
  Bell,
  FileCheck,
  HeartHandshake,
  ShieldAlert,
  History,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Coins,
  Scale
} from 'lucide-react';
import { User } from '../../types/index.ts';

interface DashboardLayoutProps {
  currentUser: User;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onBackToPublic: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onBackToPublic,
  onLogout,
  children,
}) => {
  const isMember = currentUser.role === 'MEMBER';

  // Navigation Items tailored by role
  const adminNav = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'families', label: 'Families Census (142)', icon: Home },
    { id: 'members', label: 'Members (586)', icon: Users },
    { id: 'madrasa', label: 'Madrasa Darul Uloom', icon: GraduationCap },
    { id: 'finance', label: 'Finance & Treasury', icon: CreditCard },
    { id: 'zakat', label: 'Zakat Engine & Rules', icon: Coins },
    { id: 'warasath', label: 'Warasath Cases & Reviews', icon: Scale },
    { id: 'programmes-admin', label: 'Dates, Programs & Events', icon: Calendar },
    { id: 'messages-helpdesk', label: 'Member Messages & Help', icon: MessageSquareQuote },
    { id: 'announcements-admin', label: 'Notice Board (CMS)', icon: Bell },
    { id: 'registrations-admin', label: 'Applications Hub', icon: FileCheck },
    { id: 'problem-solving', label: 'Confidential Desk', icon: ShieldAlert },
    { id: 'audit-logs', label: 'Audit Trail', icon: History },
  ];

  const memberNav = [
    { id: 'overview', label: 'My Mahallu Profile', icon: Home },
    { id: 'zakat', label: 'Zakat Calculator', icon: Coins },
    { id: 'warasath', label: 'Warasath / Inheritance', icon: Scale },
  ];

  const navItems = isMember ? memberNav : adminNav;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans ${
      isMember
        ? 'bg-gradient-to-br from-emerald-950 via-teal-950 to-blue-950 text-slate-100'
        : 'bg-slate-50/60'
    }`}>
      
      {/* Sidebar */}
      <aside className={`w-full md:w-64 lg:w-72 flex flex-col justify-between shrink-0 transition-colors ${
        isMember
          ? 'bg-emerald-950/75 backdrop-blur-2xl border-r border-emerald-800/40 text-slate-100'
          : 'bg-white border-r border-slate-200/80'
      }`}>
        <div>
          
          {/* Logo & Return Link */}
          <div className={`p-5 border-b space-y-3 ${
            isMember ? 'border-emerald-800/40' : 'border-slate-100'
          }`}>
            <button
              onClick={onBackToPublic}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isMember ? 'text-emerald-300 hover:text-white' : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-lg font-extrabold shadow-sm ${
                isMember
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 shadow-emerald-500/30'
                  : 'bg-blue-600 text-white shadow-blue-500/20'
              }`}>
                M
              </div>
              <div>
                <div className={`font-display font-bold text-sm tracking-tight ${
                  isMember ? 'text-white' : 'text-slate-900'
                }`}>
                  MANOOR MAHALLU
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${
                  isMember ? 'text-emerald-400' : 'text-blue-600'
                }`}>
                  {currentUser.role} PORTAL
                </div>
              </div>
            </div>
          </div>

          {/* User Badge */}
          <div className={`p-4 mx-3 my-3 rounded-2xl flex items-center justify-between border ${
            isMember
              ? 'bg-white/10 backdrop-blur-md border-white/15 text-white'
              : 'bg-blue-50/60 border-blue-100/80'
          }`}>
            <div>
              <div className={`font-bold text-xs truncate max-w-[170px] ${
                isMember ? 'text-white' : 'text-slate-900'
              }`}>
                {currentUser.fullName}
              </div>
              <div className={`text-[10px] font-mono mt-0.5 ${
                isMember ? 'text-emerald-200/80' : 'text-slate-500'
              }`}>
                {currentUser.username} {currentUser.familyId ? `• ${currentUser.familyId}` : ''}
              </div>
            </div>
            <ShieldCheck className={`w-4 h-4 shrink-0 ${
              isMember ? 'text-emerald-400' : 'text-blue-600'
            }`} />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? isMember
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-extrabold shadow-lg shadow-emerald-500/25'
                        : 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold'
                      : isMember
                        ? 'text-emerald-100/80 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      isActive
                        ? isMember
                          ? 'text-emerald-950'
                          : 'text-white'
                        : isMember
                          ? 'text-emerald-300'
                          : 'text-slate-500'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className={`w-3.5 h-3.5 ${
                      isMember ? 'text-emerald-950' : 'text-blue-200'
                    }`} />
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer Sign Out */}
        <div className={`p-4 border-t ${
          isMember ? 'border-emerald-800/40' : 'border-slate-100'
        }`}>
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              isMember
                ? 'bg-white/10 hover:bg-red-500/20 text-emerald-200 hover:text-red-300 border border-white/10'
                : 'bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};
