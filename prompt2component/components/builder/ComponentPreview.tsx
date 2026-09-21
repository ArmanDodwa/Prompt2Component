"use client";

import React from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as LucideIcons from "lucide-react";

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
  const scope = {
    React,
    useState: React.useState,
    ...LucideIcons,
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
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
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d0e15] shadow-2xl ">
      {/* Main Canvas Area (Full Height now that the subheader is removed) */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-auto bg-[#07080c]">
        <div
          className={`h-full transition-all duration-300 ${getDeviceWidth()} flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#12131c] shadow-2xl`}
        >
          <LiveProvider code={transformedCode} scope={scope} noInline={transformedCode.includes("render(")}>
            <div className="flex-1 overflow-auto border-slate-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <LivePreview className="h-full w-full" />
              <LiveError className="mt-2 rounded-lg bg-red-950/80 border border-red-800 p-3 font-mono text-xs text-red-300" />
            </div>
          </LiveProvider>
        </div>
      </div>
    </div>
  );
};