"use client";

import React, { useState } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as LucideIcons from "lucide-react";
import { useBuilderStore } from "@/store/builderStore";

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

export const ComponentPreview: React.FC = () => {
  // Pull data and setters directly from Zustand store
  const code = useBuilderStore((state) => state.code);
  const deviceMode = useBuilderStore((state) => state.deviceMode);
  const setSelectedElement = useBuilderStore((state) => state.setSelectedElement);

  // Track bounding rect relative to container to draw a reliable border overlay
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.getAttribute("data-live-preview") === "true") return;

    e.stopPropagation();
    e.preventDefault();

    const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
    const targetRect = target.getBoundingClientRect();

    // Store dimensions for the visual overlay box
    setSelectionRect(targetRect);

    console.log("Double-clicked target element:", target);

    // Directly update Zustand store
    setSelectedElement({
      tagName: target.tagName.toLowerCase(),
      className: target.className || "",
      text: target.innerText?.slice(0, 50) || "",
      rect: targetRect,
    });
  };

  const transformedCode = cleanComponentCode(code);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d0e15] shadow-2xl">
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-auto bg-[#07080c]" ref={containerRef}>
        <div
          className={`h-full transition-all duration-300 ${getDeviceWidth()} flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#12131c] shadow-2xl relative`}
        >
          <LiveProvider code={transformedCode} scope={scope} noInline={transformedCode.includes("render(")}>
            <div 
              className="flex-1 overflow-auto border-slate-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-4 relative"
              onDoubleClick={handleDoubleClick}
              data-live-preview="true"
            >
              <LivePreview className="h-full w-full cursor-pointer" />
              <LiveError className="mt-2 rounded-lg bg-red-950/80 border border-red-800 p-3 font-mono text-xs text-red-300" />

              {/* Persistent Selection Overlay Box */}
              {selectionRect && containerRef.current && (
                <div 
                  style={{
                    position: "absolute",
                    top: selectionRect.top - containerRef.current.getBoundingClientRect().top,
                    left: selectionRect.left - containerRef.current.getBoundingClientRect().left,
                    width: selectionRect.width,
                    height: selectionRect.height,
                    pointerEvents: "none",
                  }}
                  className="border-2 border-blue-400 bg-blue-400/10 rounded z-50 transition-all duration-150"
                />
              )}
            </div>
          </LiveProvider>
        </div>
      </div>
    </div>
  );
};