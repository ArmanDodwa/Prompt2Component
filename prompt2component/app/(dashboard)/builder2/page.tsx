"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/builder2/Navbar";
import { Sidebar } from "@/components/builder2/Sidebar";
import { CodeEditor } from "@/components/builder2/CodeEditor";
import { ComponentPreview } from "@/components/builder2/ComponentPreview";
import { VisualProperties } from "@/components/builder2/VisualProperties";
import { PromptInput } from "@/components/builder2/PromptInput";
import { generateComponentCode } from "@/services/component.service";
import { GeneratedComponentState } from "@/types/component.types";
import { tokenStorage } from "@/services/auth.service";

const INITIAL_CODE = `export default function WelcomeCard() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-3xl font-extrabold text-white mb-2">
        Prompt2Component
      </h2>
      <p className="text-neutral-400 text-sm max-w-sm">
        Enter a prompt below...
      </p>
    </div>
  );
}`;

export default function BuilderPage() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Sidebar hidden by default, toggled via navbar logo
  const [componentMeta, setComponentMeta] = useState<Partial<GeneratedComponentState>>({
    fileName: "WelcomeCard.jsx",
    isValid: true,
    iterationCount: 0,
    explanation: "",
  });

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const token = tokenStorage.getAccessToken();

      if (!token) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return;
      }
      const result = await generateComponentCode({ prompt: String(prompt) }, token);
      console.log("Generated component result:", result);

      if (result.code) {
        setCode(result.code);
      }

      setComponentMeta({
        fileName: result.fileName || "Component.jsx",
        isValid: result.isValid,
        iterationCount: result.iterationCount,
        explanation: result.explanation,
      });
    } catch (err) {
      console.error("Failed to generate component:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07080c] text-slate-100 font-sans select-none">
      {/* 1. Full-Width Top Navigation Bar (clicking logo toggles sidebar) */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main Content Area (Sidebar + Workspace container) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Appears conditionally based on state) */}
        {isSidebarOpen && <Sidebar />}

        {/* Right Content Wrapper */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Workspace Layout: ~70% Preview Canvas on Left, Stacked Editor & Properties on Right */}
          <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-12 bg-[#07080c]">
            {/* Component Preview / Canvas (~70% width -> col-span-8 out of 12) */}
            <div className="flex h-full flex-col overflow-hidden lg:col-span-8">
              <ComponentPreview code={code} deviceMode={deviceMode} />
            </div>

            {/* Right Column: Code Editor (Top) & Visual Properties (Bottom) -> (~30% width -> col-span-4) */}
            <div className="flex h-full flex-col overflow-hidden lg:col-span-4 gap-3">
              {/* Upper Part: Code Editor */}
              <div className="h-[52%] overflow-hidden">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language="javascript"
                  theme="vs-dark"
                />
              </div>
              {/* Down Side: Visual Properties */}
              <div className="h-[48%] overflow-hidden">
                <VisualProperties />
              </div>
            </div>
          </div>

          {/* Prompt Console Bar at Bottom */}
          <div className="border-t border-slate-800 bg-[#0d0e15] px-6 py-3">
            <div className="mx-auto max-w-5xl">
              <PromptInput
                onGenerate={handleGenerate}
                isLoading={isLoading}
                iterationCount={componentMeta.iterationCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}