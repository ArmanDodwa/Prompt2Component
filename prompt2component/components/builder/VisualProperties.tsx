"use client";

import React, { useState } from "react";
import { Sliders, RotateCcw, ChevronDown } from "lucide-react";

interface VisualPropertiesProps {
  selectedElement?: string;
  onPropertyChange?: (property: string, value: unknown) => void;
}

export const VisualProperties: React.FC<VisualPropertiesProps> = ({
  selectedElement = "h2.text-3xl (Selected)",
}) => {
  const [fontWeight, setFontWeight] = useState<string>("Extrabold");
  const [textAlign, setTextAlign] = useState<string>("center");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [marginBottom, setMarginBottom] = useState<number>(2); // 8px (mb-2)
  const [paddingVal, setPaddingVal] = useState<string>("0px");

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
            Selected
          </span>
          <button 
            aria-label="Reset properties" 
            className="text-slate-500 hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Selected Element Pill Banner */}
      <div className="bg-[#090a0f] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between font-mono text-[11px] text-slate-400">
        <span>{selectedElement}</span>
        <span className="text-slate-600">Double-click to edit text</span>
      </div>

      {/* Property Controls Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Font Size / Leading */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Font Size / Leading</span>
            <span className="font-mono text-slate-500">Tailwind class</span>
          </div>
          <div className="w-full bg-[#181926] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs flex items-center justify-between">
            <span>text-3xl — 30px (1.875rem)</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </div>

        {/* Font Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Font Weight</span>
            <span className="font-mono text-slate-500">font-extrabold (800)</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-[#181926] border border-slate-800 rounded-lg p-1">
            {["Regular", "Semibold", "Extrabold"].map((weight) => (
              <button
                key={weight}
                onClick={() => setFontWeight(weight)}
                className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                  fontWeight === weight
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>

        {/* Text Align */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Text Align</span>
            <span className="font-mono text-slate-500">text-center</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-[#181926] border border-slate-800 rounded-lg p-1">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                onClick={() => setTextAlign(align)}
                className={`py-1.5 rounded-md flex items-center justify-center transition-all ${
                  textAlign === align
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <div className={`w-4 h-1 bg-current rounded ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Text Color</span>
            <span className="font-mono text-[10px] text-emerald-400">100% Opacity</span>
          </div>
          <div className="flex items-center gap-3 bg-[#181926] border border-slate-800 rounded-lg p-2">
            <div 
              className="w-6 h-6 rounded border border-slate-700 shadow-inner" 
              style={{ backgroundColor: textColor }} 
            />
            <span className="font-mono text-slate-200">{textColor}</span>
            <span className="ml-auto font-mono text-slate-500 text-[11px]">text-white</span>
          </div>
        </div>

        {/* Margin Bottom */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold tracking-wider uppercase">Margin Bottom</span>
            <span className="font-mono text-slate-300">8px (mb-2)</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={marginBottom}
            onChange={(e) => setMarginBottom(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Box Model Inspection */}
        <div className="space-y-1.5 pt-2">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400">
            Box Model Inspection
          </span>
          <div className="bg-[#12131c] border border-slate-800 rounded-lg p-3 text-center font-mono text-[11px] space-y-2">
            <div className="text-slate-500">margin: 0px 0px 8px 0px</div>
            <div className="bg-[#181926] border border-dashed border-slate-700 py-1.5 rounded text-slate-400">
              padding: {paddingVal}
            </div>
            <div className="text-indigo-400 font-medium">512 × 38 px</div>
          </div>
        </div>
      </div>

      {/* Footer Extract Action */}
      <div className="p-3 border-t border-slate-800 bg-[#12131c]">
        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg border border-slate-700 transition-colors shadow-sm">
          Extract Component
        </button>
      </div>
    </div>
  );
};