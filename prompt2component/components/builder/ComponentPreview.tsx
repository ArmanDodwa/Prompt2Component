"use client";

import React, { useState } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as LucideIcons from "lucide-react";

interface ComponentPreviewProps {
  code: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}

// Clean common export patterns so react-live can execute
const cleanComponentCode = (rawCode: string): string => {
  let cleaned = rawCode
    .replace(/^import\s+.*?;\s*$/gm, "") // remove ES import statements
    .replace(/export\s+default\s+function\s*([A-Za-z0-9_]*)/g, "function $1")
    .replace(/export\s+default\s+class\s*([A-Za-z0-9_]*)/g, "class $1")
    .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, "render($1);")
    .replace(/export\s+/g, "") // strip remaining export keywords
    .trim();

  // If no explicit render call, attempt to render the component or wrap root
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
    useState,
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
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <div
        className={`h-full transition-all duration-300 ${getDeviceWidth()} flex flex-col overflow-hidden rounded-md border border-neutral-800 bg-white shadow-xl dark:bg-neutral-900`}
      >
        <LiveProvider code={transformedCode} scope={scope} noInline={transformedCode.includes("render(")}>
          <div className="border-b border-neutral-200 bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
            Live Preview
          </div>
          <div className="flex-1 overflow-auto p-4">
            <LivePreview className="h-full w-full" />
            <LiveError className="mt-2 rounded bg-red-950/80 p-3 font-mono text-xs text-red-300" />
          </div>
        </LiveProvider>
      </div>
    </div>
  );
};