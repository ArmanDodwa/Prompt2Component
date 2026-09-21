"use client";

import React from 'react';
import { 
  Layers, 
  Component, 
  Network, 
  Palette, 
  Settings, 
  Plus, 
  Zap 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0d0e15] border-r border-slate-800 text-slate-300 flex flex-col h-full select-none shrink-0 transition-all duration-300">
      {/* Project Explorer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Project Explorer
        </span>
        <button 
          aria-label="Add new project or item"
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Layers & Elements (Active Item) */}
        <div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 text-white font-medium text-sm border border-slate-700/50">
            <Layers size={18} className="text-indigo-400" />
            <span>Layers & Elements</span>
          </div>
          
          {/* Sub-menu items */}
          <div className="pl-7 mt-1 space-y-1 border-l border-slate-800 ml-4 py-1">
            <a href="#components" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">
              <Component size={14} />
              <span>Components Tree</span>
            </a>
            <a href="#ast" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">
              <Network size={14} />
              <span>AST & State Graph</span>
            </a>
            <a href="#tokens" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">
              <Palette size={14} />
              <span>Design Tokens</span>
            </a>
            <a href="#config" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors">
              <Settings size={14} />
              <span>Config & Settings</span>
            </a>
          </div>
        </div>
      </div>

      {/* Token Budget Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#090a0f]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Zap size={14} /> Token Budget
          </span>
          <span className="text-slate-400">84%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full w-[84%] rounded-full" />
        </div>
      </div>
    </aside>
  );
};