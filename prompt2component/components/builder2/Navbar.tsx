"use client";

import React from 'react';
import { 
  Sparkles, 
  Eye, 
  Code, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Copy, 
  Share2, 
  User, 
  Star 
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-14 w-full bg-[#0d0e15] border-b border-slate-800 px-4 flex items-center justify-between text-slate-300 select-none z-20">
      {/* Left: Branding & Status (Clicking this toggles the sidebar) */}
      <div className="flex items-center gap-4">
        <div 
          onClick={onToggleSidebar}
          className="flex items-center gap-2 cursor-pointer group hover:opacity-90 transition-opacity"
          title="Toggle Sidebar"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
            P
          </div>
          <span className="font-semibold text-sm text-white tracking-wide">
            Prompt2Component Studio <span className="text-slate-500 font-normal">- Canvas & Inspector</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
          <span className="bg-slate-800/80 text-slate-300 px-2 py-1 rounded font-mono">WelcomeCard.jsx</span>
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE SYNCED
          </span>
          <span className="text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            React + Tailwind CSS
          </span>
        </div>
      </div>

      {/* Center: View Modes & Viewports */}
      <div className="hidden md:flex items-center bg-[#13141f] border border-slate-800 rounded-lg p-1 gap-1">
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-white text-xs font-medium shadow-sm transition-all">
          <Sparkles size={14} className="text-indigo-400" />
          Visual Edit
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-md text-slate-400 hover:text-white text-xs font-medium transition-all">
          <Eye size={14} />
          Preview Only
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-md text-slate-400 hover:text-white text-xs font-medium transition-all">
          <Code size={14} />
          Code & AST
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        <div className="flex items-center gap-1 text-slate-400 px-1">
          <button aria-label="Desktop view" className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"><Monitor size={14} /></button>
          <button aria-label="Tablet view" className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"><Tablet size={14} /></button>
          <button aria-label="Mobile view" className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"><Smartphone size={14} /></button>
          <span className="text-xs font-mono ml-1 text-slate-400">100%</span>
        </div>
      </div>

      {/* Right Actions: Utilities & Profile */}
      <div className="flex items-center gap-2">
        <button aria-label="Rate or favorite" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Star size={16} />
        </button>
        <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-slate-700">
          <Copy size={14} />
          Copy Code
        </button>
        <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md shadow-indigo-600/20 transition-colors">
          <Share2 size={14} />
          Export Component
        </button>
        <div className="h-4 w-[1px] bg-slate-800 mx-1" />
        <button aria-label="User profile" className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-300 hover:text-white transition-colors">
          <User size={16} />
        </button>
      </div>
    </header>
  );
};