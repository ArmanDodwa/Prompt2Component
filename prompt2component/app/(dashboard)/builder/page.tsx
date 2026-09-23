"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/builder/Navbar";
import { Sidebar } from "@/components/builder/Sidebar";
import { CodeEditor } from "@/components/builder/CodeEditor";
import { ComponentPreview } from "@/components/builder/ComponentPreview";
import { VisualProperties } from "@/components/builder/VisualProperties";
import { PromptInput } from "@/components/builder/PromptInput";
import { generateComponentCode } from "@/services/component.service";
import { GeneratedComponentState } from "@/types/component.types";
import { tokenStorage } from "@/services/auth.service";
import { INITIAL_CODE } from "@/components/builder/InitialCode";

// Define the interface for selected element data
export interface SelectedElementData {
  tagName: string;
  className: string;
  text: string;
  rect: DOMRect;
}

export default function BuilderPage() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [viewMode, setViewMode] = useState<"visual" | "preview" | "code">("visual");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // State to hold the currently selected element data from the preview
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);

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
      {/* 1. Full-Width Top Navigation Bar */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        deviceMode={deviceMode}
        onDeviceChange={setDeviceMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar />}

        {/* Right Content Wrapper */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Workspace Layout */}
          <div className="grid flex-1 grid-cols-1 gap-2 overflow-hidden p-2 lg:grid-cols-12 bg-[#07080c]">
            
            {/* Component Preview / Canvas */}
            <div className="flex h-full flex-col overflow-hidden lg:col-span-9 relative">
              <ComponentPreview 
                code={code} 
                deviceMode={deviceMode} 
                onSelectElement={(elementData) => setSelectedElement(elementData)}
              />

              {/* Floating Prompt Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
                <div className="mx-auto max-w-3xl backdrop-blur-md bg-[#0d0e15]/90 border border-slate-700/60 rounded-xl shadow-2xl px-4 py-2.5">
                  <PromptInput
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    iterationCount={componentMeta.iterationCount}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor & Visual Properties */}
            <div className="flex h-full flex-col overflow-hidden lg:col-span-3 gap-2">
              <div className="h-[52%] overflow-hidden">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language="javascript"
                  theme="vs-dark"
                />
              </div>
              <div className="h-[48%] overflow-hidden">
                <VisualProperties selectedElement={selectedElement} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}