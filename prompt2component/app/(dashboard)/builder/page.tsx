"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/builder/CodeEditor";
import { ComponentPreview } from "@/components/builder/ComponentPreview";
import { PromptInput } from "@/components/builder/PromptInput";
import { Toolbar } from "@/components/builder/Toolbar";
import { generateComponentCode } from "@/services/component.service";
import { GeneratedComponentState } from "@/types/component.types";
import { tokenStorage } from "@/services/auth.service";

const INITIAL_CODE = `function WelcomeCard() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
        Prompt2Component
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-sm">
        Enter a prompt in the input below to generate your custom React component.
      </p>
    </div>
  );
}`;

export default function BuilderPage() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      console.log("#################################")
      console.log("#################################")
      console.log("#################################") 
      console.log("Generated component result:", result);
       console.log("#################################")
      console.log("#################################")
      console.log("#################################")
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
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-neutral-950 text-neutral-100">
      <Toolbar
        fileName={componentMeta.fileName || "Component.jsx"}
        code={code}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        isValid={componentMeta.isValid}
      />

      {/* Editor & Preview Split Workspace */}
      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-2">
        <div className="flex h-full flex-col overflow-hidden">
          <CodeEditor
            code={code}
            onChange={setCode}
            language="javascript"
            theme="vs-dark"
          />
        </div>
        <div className="flex h-full flex-col overflow-hidden">
          <ComponentPreview code={code} deviceMode={deviceMode} />
        </div>
      </div>

      {/* Prompt Console Bar */}
      <div className="border-t border-neutral-800 bg-neutral-900/80 p-4">
        <div className="mx-auto max-w-4xl">
          <PromptInput
            onGenerate={handleGenerate}
            isLoading={isLoading}
            iterationCount={componentMeta.iterationCount}
          />
        </div>
      </div>
    </div>
  );
}