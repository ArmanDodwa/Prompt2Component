"use client";

import React, { useState } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as LucideIcons from "lucide-react";
import { Sparkles, Eye, Code, Monitor, Tablet, Smartphone } from "lucide-react";

interface ComponentPreviewProps {
  code: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}

const cleanComponentCode = (rawCode: string): string => {
  let cleaned = rawCode
    .replace(/^import\s+.*?;\s*$/gm, "")
    .replace(/export\s+default\s+function\s*([A-Za-z0-9_]*)/g, "function $1")
    .replace(/export\s+default\s+class\s*([A-Za-z0-9_]*)/g, "class $1")
    .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "render($1);")
    .replace(/export\s+/g, "")
    .trim();

  if (!cleaned.includes("render(") && !cleaned.startsWith("<")) {
    const fnMatch = cleaned.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
    const constMatch = cleaned.match(/(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=/);
    const componentName = fnMatch?.[1] || constMatch?.[1];

    if (componentName) {
      cleaned += `\nrender(<${componentName} />);`;
    }
  }

  return cleaned;
};

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  code,
  deviceMode = "desktop",
}) => {
  const [activeTab, setActiveTab] = useState<"visual" | "preview" | "code">("visual");
  const [currentDevice, setCurrentDevice] = useState<"desktop" | "tablet" | "mobile">(deviceMode);

  const scope = {
    React,
    useState,
    ...LucideIcons,
  };

  const getDeviceWidth = () => {
    switch (currentDevice) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  const transformedCode = cleanComponentCode(code);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d0e15] shadow-2xl">
      {/* Studio Toolbar / Navbar Subheader */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#12131c] px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-slate-300">Live Render Canvas</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-400">720 x 420 px</span>
        </div>

        {/* Center View Controls */}
        <div className="flex items-center bg-[#181926] border border-slate-800 rounded-lg p-0.5 gap-1">
          <button
            onClick={() => setActiveTab("visual")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "visual"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles size={13} className="text-indigo-400" />
            Visual Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "preview"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye size={13} />
            Preview Only
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "code"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code size={13} />
            Code & AST
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Device Toggles */}
          <div className="flex items-center gap-1 text-slate-400 px-1">
            <button
              onClick={() => setCurrentDevice("desktop")}
              className={`p-1 rounded transition-colors ${currentDevice === "desktop" ? "text-white bg-slate-800" : "hover:text-white"}`}
            >
              <Monitor size={13} />
            </button>
            <button
              onClick={() => setCurrentDevice("tablet")}
              className={`p-1 rounded transition-colors ${currentDevice === "tablet" ? "text-white bg-slate-800" : "hover:text-white"}`}
            >
              <Tablet size={13} />
            </button>
            <button
              onClick={() => setCurrentDevice("mobile")}
              className={`p-1 rounded transition-colors ${currentDevice === "mobile" ? "text-white bg-slate-800" : "hover:text-white"}`}
            >
              <Smartphone size={13} />
            </button>
            <span className="text-[11px] font-mono ml-1 text-slate-400">100%</span>
          </div>
        </div>

        {/* Right Status / Action placeholders */}
        <div className="text-xs text-slate-500 font-mono">
          TailwindCSS v3.4
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-auto bg-[#07080c] p-6">
        <div
          className={`h-full transition-all duration-300 ${getDeviceWidth()} flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#12131c] shadow-2xl`}
        >
          <LiveProvider code={transformedCode} scope={scope} noInline={transformedCode.includes("render(")}>
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#181926] px-4 py-2 text-xs font-semibold text-slate-400">
              <span>Live Preview Canvas</span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">Active Component</span>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <LivePreview className="h-full w-full" />
              <LiveError className="mt-2 rounded-lg bg-red-950/80 border border-red-800 p-3 font-mono text-xs text-red-300" />
            </div>
          </LiveProvider>
        </div>
      </div>
    </div>
  );
};