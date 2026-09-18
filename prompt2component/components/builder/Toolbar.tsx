"use client";

import React, { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Download,
  FileCode,
} from "lucide-react";

interface ToolbarProps {
  fileName: string;
  code: string;
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  isValid?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  fileName,
  code,
  deviceMode,
  setDeviceMode,
  isValid = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "Component.jsx";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-2 text-neutral-300 backdrop-blur">
      <div className="flex items-center gap-2">
        <FileCode className="h-4 w-4 text-indigo-400" />
        <span className="text-sm font-medium">{fileName || "Component.jsx"}</span>
        <span
          className={`h-2 w-2 rounded-full ${
            isValid ? "bg-emerald-500" : "bg-amber-500"
          }`}
          title={isValid ? "Code Valid" : "Issues Detected"}
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 p-1">
        <button
          onClick={() => setDeviceMode("desktop")}
          className={`rounded p-1.5 transition ${
            deviceMode === "desktop"
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
          title="Desktop view"
        >
          <Monitor className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeviceMode("tablet")}
          className={`rounded p-1.5 transition ${
            deviceMode === "tablet"
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
          title="Tablet view"
        >
          <Tablet className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeviceMode("mobile")}
          className={`rounded p-1.5 transition ${
            deviceMode === "mobile"
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
          title="Mobile view"
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>
    </div>
  );
};