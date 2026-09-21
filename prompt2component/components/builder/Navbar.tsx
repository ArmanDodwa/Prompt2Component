"use client";

import React, { useState } from 'react';
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
  Star,
  Terminal,
  Check,
  FileCode
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  deviceMode: "desktop" | "tablet" | "mobile";
  onDeviceChange: (device: "desktop" | "tablet" | "mobile") => void;
  viewMode: "visual" | "preview" | "code";
  onViewModeChange: (mode: "visual" | "preview" | "code") => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  deviceMode, 
  onDeviceChange, 
  viewMode, 
  onViewModeChange 
}) => {
  // State for editable component filename
  const [isEditingName, setIsEditingName] = useState(false);
  const [componentName, setComponentName] = useState('WelcomeCard.jsx');
  const [tempName, setTempName] = useState(componentName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setComponentName(tempName.trim());
    } else {
      setTempName(componentName);
    }
    setIsEditingName(false);
  };

  return (
    <header className="h-14 w-full bg-[#0d0e15] border-b border-slate-800 px-4 flex items-center justify-between text-slate-300 select-none z-20">
      {/* Left: Custom Branding & Enhanced Editable File Name */}
      <div className="flex items-center gap-4">
        {/* Custom Prompt2Component Logo */}
        <div 
          onClick={onToggleSidebar}
          className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
          title="Toggle Sidebar"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Terminal size={16} className="absolute text-indigo-200 opacity-60 -bottom-1 -right-1" />
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              Prompt2Component
              <span className="text-xs px-1.5 py-0.2 bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30 font-mono font-normal">Studio</span>
            </span>
          </div>
        </div>

        {/* Enhanced Editable Component File Badge */}
        <div className="hidden lg:flex items-center pl-4 border-l border-slate-800">
          {isEditingName ? (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-indigo-500 rounded-md px-2.5 py-1">
              <FileCode size={14} className="text-indigo-400" />
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                onBlur={handleSaveName}
                autoFocus
                className="bg-transparent text-slate-100 font-mono text-xs outline-none w-36 font-medium"
              />
              <button onClick={handleSaveName} className="text-indigo-400 hover:text-indigo-300 ml-1">
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => { setTempName(componentName); setIsEditingName(true); }}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-md font-mono text-xs cursor-pointer border border-slate-700/60 hover:border-slate-600 shadow-sm transition-all group"
              title="Click to rename component"
            >
              <FileCode size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide">{componentName}</span>
              <span className="text-[10px] text-slate-500 ml-1 uppercase bg-slate-900 px-1 py-0.5 rounded border border-slate-800">Edit</span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Connected View Modes & Viewports */}
      <div className="hidden md:flex items-center bg-[#13141f] border border-slate-800 rounded-lg p-1 gap-1">
        <button 
          onClick={() => onViewModeChange('visual')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'visual' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={14} className={viewMode === 'visual' ? 'text-indigo-400' : 'text-slate-400'} />
          Visual Edit
        </button>
        <button 
          onClick={() => onViewModeChange('preview')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'preview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={14} />
          Preview Only
        </button>
        <button 
          onClick={() => onViewModeChange('code')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'code' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code size={14} />
          Code & AST
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        <div className="flex items-center gap-1 text-slate-400 px-1">
          <button 
            onClick={() => onDeviceChange('desktop')}
            aria-label="Desktop view" 
            className={`p-1 rounded transition-colors ${deviceMode === 'desktop' ? 'bg-slate-800 text-white' : 'hover:text-white hover:bg-slate-800'}`}
          >
            <Monitor size={14} />
          </button>
          <button 
            onClick={() => onDeviceChange('tablet')}
            aria-label="Tablet view" 
            className={`p-1 rounded transition-colors ${deviceMode === 'tablet' ? 'bg-slate-800 text-white' : 'hover:text-white hover:bg-slate-800'}`}
          >
            <Tablet size={14} />
          </button>
          <button 
            onClick={() => onDeviceChange('mobile')}
            aria-label="Mobile view" 
            className={`p-1 rounded transition-colors ${deviceMode === 'mobile' ? 'bg-slate-800 text-white' : 'hover:text-white hover:bg-slate-800'}`}
          >
            <Smartphone size={14} />
          </button>
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