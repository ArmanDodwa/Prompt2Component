"use client";

import React, { useState, useEffect } from "react";
import { Sliders, RotateCcw } from "lucide-react";
import { useBuilderStore } from "@/store/builderStore";

export const VisualProperties: React.FC = () => {
  const selectedElement = useBuilderStore((state) => state.selectedElement);
  const updateElementProperties = useBuilderStore((state) => state.updateElementProperties);
  const commitDraftCode = useBuilderStore((state) => state.commitDraftCode);


  // --- LOCAL TEMPORARY STATE (Text & Text Color Only) ---
  const [text, setText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");

  // Sync state whenever selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      setText(selectedElement.text || "");
      setTextColor(selectedElement.textColor || "#FFFFFF");
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-800 bg-[#0d0e15] text-slate-500 font-sans text-xs p-6 text-center">
        Select an element on the canvas to configure visual properties.
      </div>
    );
  }

  // --- HANDLERS WITH LIVE DRAFT MUTATION ---
  const handlePropertyChange = (key: string, value: any) => {
    if (key === "text") setText(value);
    if (key === "textColor") setTextColor(value);

    console.log(`Property change detected: ${key} = ${value}`);

    // Stream the adjustment straight to draftCode via AST
    updateElementProperties({ [key]: value });
  };

  const handleApply = () => {
    commitDraftCode();
  };

  const handleReset = () => {
    if (selectedElement) {
      setText(selectedElement.text || "");
      setTextColor(selectedElement.textColor || "#FFFFFF");
    }
  };

  const displayLabel = `${selectedElement.tagName}${selectedElement.className ? `.${selectedElement.className.split(" ")[0]}` : ""}`;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d0e15] text-slate-300 shadow-2xl select-none font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#12131c] px-4 py-2.5">
        <div className="flex items-center gap-1.5 font-medium text-white">
          <Sliders size={14} className="text-indigo-400" />
          <span>Visual Properties</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded font-mono">
            Active
          </span>
          <button 
            onClick={handleReset}
            title="Discard changes & reset"
            aria-label="Reset properties" 
            className="text-slate-500 hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Selected Element Pill Banner */}
      <div className="bg-[#090a0f] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
        <span className="truncate max-w-[180px]" title={displayLabel}>{displayLabel}</span>
        <span className="text-slate-600">Draft Mode Active</span>
      </div>

      {/* Property Controls Body (Text & Font Color Only) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Text Content Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Text Content</span>
            <span className="font-mono text-[10px] text-indigo-400">String</span>
          </div>
          <input 
            type="text" 
            value={text}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            className="w-full bg-[#181926] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-slate-700" 
          />
        </div>

        {/* Text Color Picker Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Font Color</span>
            <span className="font-mono text-[10px] text-emerald-400">Hex Customizer</span>
          </div>
          <div className="flex items-center gap-3 bg-[#181926] border border-slate-800 rounded-lg p-2">
            <input 
              type="color" 
              value={textColor}
              onChange={(e) => handlePropertyChange("textColor", e.target.value)}
              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent" 
            />
            <input 
              type="text" 
              value={textColor}
              onChange={(e) => handlePropertyChange("textColor", e.target.value)}
              className="bg-transparent font-mono text-slate-200 focus:outline-none w-20"
            />
          </div>
        </div>

      </div>

      {/* Footer Action Buttons (Apply & Reset) */}
      <div className="p-3 border-t border-slate-800 bg-[#12131c] flex gap-2">
        <button 
          onClick={handleReset}
          className="w-1/3 bg-slate-900 hover:bg-slate-800 text-slate-400 font-medium py-2 rounded-lg border border-slate-800 transition-colors text-xs"
        >
          Reset
        </button>
        <button 
          onClick={handleApply}
          className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors shadow-sm text-xs"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};