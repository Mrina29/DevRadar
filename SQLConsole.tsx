import React, { ReactNode } from 'react';
import { LayoutDashboard, Terminal, Bot, ToggleLeft, ToggleRight, Ship, Compass } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bypassCoral: boolean;
  setBypassCoral: (bypass: boolean) => void;
}

export default function Layout({ children, activeTab, setActiveTab, bypassCoral, setBypassCoral }: LayoutProps) {
  const navItems = [
    { id: 'ai', name: 'Incident Investigator', icon: Bot },
    { id: 'dashboard', name: 'Proactive Radar', icon: LayoutDashboard },
    { id: 'sql', name: 'Query Architect', icon: Terminal },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ocean-950 font-sans text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-ocean-900 border-r border-ocean-800 flex flex-col">
        {/* Logo Brand area */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-ocean-800">
          <div className="p-2 bg-ocean-coral rounded-lg text-white">
            <Ship size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider">DEVRADAR</h1>
            <p className="text-[10px] text-ocean-coral font-bold tracking-[0.2em] uppercase">Coral SQL Engine</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-ocean-700 to-ocean-800 text-white border-l-4 border-ocean-coral shadow-lg font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-ocean-800 font-medium'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-ocean-coral' : 'text-slate-400'} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* System Settings & Live Engine Selector */}
        <div className="p-4 mb-4">
          <div className="p-4 bg-ocean-800/40 rounded-2xl border border-ocean-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engine Mode</span>
              <button 
                onClick={() => setBypassCoral(!bypassCoral)} 
                className="hover:opacity-80 transition-opacity flex items-center justify-center p-0"
              >
                {bypassCoral ? (
                  <ToggleLeft size={20} className="text-slate-500" />
                ) : (
                  <ToggleRight size={20} className="text-ocean-seafoam" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-ocean-seafoam font-mono tracking-wider">
              {bypassCoral ? 'DAEMON MOCKED' : 'DAEMON CONNECTED'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main View Shell */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-ocean-900 to-ocean-950">
        {/* Top Header */}
        <header className="h-16 border-b border-ocean-800 flex items-center justify-between px-8 bg-ocean-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-ocean-seafoam shadow-[0_0_8px_var(--seafoam)] animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-ocean-seafoam tracking-widest uppercase">
              SYSTEM STATUS: OPTIMAL
            </span>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="px-3 py-1 bg-ocean-800 border border-ocean-700 rounded-md text-[10px] font-mono text-slate-400 tracking-tighter">
              WORKSPACES / PIRATE-FLEET / CORAL-OS
            </div>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
